/**
 * (c) 2016 Radio France
 * This program is free software: you can redistribute it and/or modify it under the terms of the CeCILL-B license
 */
var fs = require('fs');

module.exports = {
    generate: function (url, audits, report) {

        var severity, errors = {}, error, i, check;

        // count errors
        for (i = 0; i < audits.length; i++) {
            check = audits[i];
            if ('FAIL' !== check.result) {
                continue;
            }

            severity = check.severity.toLowerCase();
            if (typeof(errors[severity]) === 'undefined') {
                errors[severity] = 0;
            }
            errors[severity]++;
        }

        console.log(report);

        console.log("\nResults:");
        for (error in errors) {
            console.log("  " + error + ': ' + errors[error]);
        }

    }
};