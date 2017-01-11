/**
 * (c) 2016 Radio France
 * This program is free software: you can redistribute it and/or modify it under the terms of the CeCILL-B license
 */
var fs = require('fs');

module.exports = {
    generate: function (url, audits, output, html) {

        console.log('  Generating violations file in ' + output);

        var check, i, selector, javascript;

        for (i = 0; i < audits.length; i++) {
            check = audits[i];

            if ('FAIL' !== check.result) {
                continue;
            }

            selector = check.elements.trim().split("\n").join(',');
            check.heading = check.heading.replace(/'/, "\\'");
            check.severity = check.severity.toLowerCase();
            javascript += "\na11y_add_error('" + check.severity + "','" + check.heading + "', '" + selector + "', '" + check.code + "', '" + check.url + "');";
        }

        // building Js
        javascript = `<script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.slim.min.js"></script>
            <script type="text/javascript">
            function a11y_add_error(level, description, selector, code, ruleUrl) {
                var color = 'yellow';
                switch(level) {
                    case 'severe': {
                        color= '#CC0000';
                        break;
                    }
                    case 'warning': {
                        color= '#CCCC00';
                        break;
                    }
                    case 'severe': {
                        color= '#0000CC';
                        break;
                    }
                }
                $(selector)
                    .css("background-color", color)
                    .css("outline", "4px solid red")
                    .attr("title", description + " (" + code +")")
                    .click(function(e) { e.preventDefault(); window.open(ruleUrl) });
            };
            $(function() { ${javascript} });
            </script>`;


        // building HTML
        html = html.replace(/<head>/, '<head><base href="' + url + '" />');
        html = html.replace(/(<body .*?>)/, '$1' + javascript);

        // Generating report
        fs.writeFileSync(output, html);
    }
};