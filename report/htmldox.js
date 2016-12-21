var fs = require('fs');

module.exports = {
    generate: function (url, audits, output) {

        console.log('  Generating HTML dox file in ' + output);

        var check, i, selector, html, row, severes = [], warnings = [], infos = [], na = [], passed = [], nbFailed = 0;
        var today = new Date();
        var datestring = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " " +
            today.getHours() + ":" + today.getMinutes();

        for (i = 0; i < audits.length; i++) {
            check = audits[i];

            row = `
                <tr>
                    <td>${check.elements.trim().split("\n").length}</td>
                    <td>${check.severity}</td>
                    <td>
                        <span class="heading">${check.heading}</span>
                        <span class="code">${check.code}</span>
                        <span class="url">(<a title="learn more informations about this rule" href="${check.url}">learn more</a>)</span>
                    </td>
                </tr>
            `;

            switch (check.result) {
                case 'FAIL':
                    nbFailed++;
                    if ('severe' == check.severity.toLowerCase()) {
                        severes.push(row);
                    } else if ('warning' == check.severity.toLowerCase()) {
                        warnings.push(row);
                    } else if ('info' == check.severity.toLowerCase()) {
                        infos.push(row);
                    }
                    break;
                case 'NA':
                    na.push(row);
                    break;
                case 'PASS':
                default:
                    passed.push(row);
                    break;
            }
        }

        html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>a11y report - ${datestring}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css">
    <style type="text/css">
    .code { color: #666; }
    </style>
  </head>
  <body>
  
    <section class="white">
      <div class="row">
        <div class="container">
          <div class="col s12 l12">
            <h1>ay11 result (${passed.length + na.length} / ${audits.length})</h1>
          
            <p>
                <strong>${passed.length + na.length}</strong> passed tests on <strong>${audits.length}</strong>.
                Generated at ${datestring}
            </p>
          
            <h2>Failed <small>(${severes.length} severes, ${warnings.length} warnings, ${infos.length} infos)</small></h2>
          
            <table>
              <thead>
                <tr>
                  <th>DOM elements</th>
                  <th>Severity</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                ${severes.join("\b")}
                ${warnings.join("\b")}
                ${infos.join("\b")}
              </tbody>
            </table>
        
            <h2>Passed <small>(${passed.length})</small></h2>
          
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Severity</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                ${passed.join("\b")}
              </tbody>
            </table>
        
            <h2>NA <small>(${na.length})</small></h2>
          
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Severity</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                ${na.join("\b")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </body>
`;


        // Generating report
        fs.writeFileSync(output, html);
    }
};