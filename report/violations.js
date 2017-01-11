/**
 * (c) 2016 Radio France
 * This program is free software: you can redistribute it and/or modify it under the terms of the CeCILL-B license
 */
var fs = require('fs');

module.exports = {
    generate: function (url, audits, output) {

        console.log('  Generating violations file in ' + output);

        var i, check, xml = '', priority;

        xml = '<?xml version="1.0"?>'
            + "\n" + '<ruleset name="ay11 RuleSet"'
            + "\n" + 'xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"'
            + "\n" + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
            + "\n" + 'xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 http://pmd.sourceforge.net/ruleset_2_0_0.xsd">'
            + "\n" + '<description>Accessibility ruleset</description>';

        for (i = 0; i < audits.length; i++) {
            check = audits[i];

            if ('FAIL' !== check.result) {
                continue;
            }

            switch(check.severity.toLowerCase()) {
                case 'severe':
                    priority = 1;
                    break;
                case 'warning':
                    priority = 2;
                    break;
                case 'info':
                default:
                    priority = 3;
                    break;
            }

            xml += "\n"
                + '<rule name="' + check.code + '" message="' + check.heading + '" externalInfoUrl="' + check.url + '">'
                + "\n" + '    <description>' + check.heading + '</description>'
                + "\n" + '    <priority>' + priority + '</priority>'
                + "\n" + '</rule>';
        }

        xml += "\n</ruleset>";

        fs.writeFileSync(output, xml);
    }
};