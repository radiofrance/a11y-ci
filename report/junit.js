var fs = require('fs');

module.exports = {
    generate: function (url, audits, output) {

        console.log('  Generating junit file in ' + output);

        var i, check, xml = '';

        var xmlCases = '';

        // count errors
        var total = audits.length, errors = 0, skipped = 0;
        for (i = 0; i < audits.length; i++) {
            check = audits[i];

            if ('NA' == check.result) {
                skipped++;
                continue;
            }

            // build XML
            xmlCases += "\n" + '<testcase name="' + check.heading + '" classname="' + check.code + '" >';

            if ('FAIL' == check.result) {
                errors++;

                // log severe only
                if ('severe' == check.severity.toLowerCase()) {
                    xmlCases += "\n" + '<error message="' + check.elements.trim().split("\n").join(',') + '" ></error>';
                }
            }

            xmlCases += "\n</testcase>";
        }

        xml = '<?xml version="1.0"?>'
            + "\n<testsuites>"
            + "\n" + '<testsuite name="a11ySuite" tests="' + total + '" skipped="' + skipped + '" errors="' + errors + '">'
            + xmlCases
            + "\n</testsuite>"
            + "\n</testsuites>";


        fs.writeFileSync(output, xml);
    }
};