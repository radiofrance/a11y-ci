#!/usr/bin/env node
var fs = require('fs');
var a11y = require('a11y');
var program = require('commander');

// user input
program
    .version('0.0.1')
    .description('Generates HTML report for a11y')
    .arguments('<url> <output>')
    .action(function (url, output) {
        main(url, output);
    })
    .parse(process.argv);


function main(url, output) {
    // get source
    console.log('Auditing ' + url);
    console.log('  Fetching sources...');
    var source = require('./source');
    source.getSource(url, function (html) {

        // run audit
        console.log('  Running audit...');
        a11y(url, {delay: 20}, function (err, reports) {
            if (err) {
                throw err;
            }
            var audit = reports.audit;
            var javascript = '', selector, errors = {}, error;


            var i, check;
            for (i = 0; i < audit.length; i++) {
                check = audit[i];
                if ('PASS' === check.status || 'NA' === check.status) {
                    continue;
                }

                selector = check.elements.trim().split("\n").join(',');
                check.heading = check.heading.replace(/'/, "\\'");
                check.severity = check.severity.toLowerCase();
                javascript += "\na11y_add_error('" + check.severity + "','" + check.heading + "', '" + selector + "', '" + check.code + "', '" + check.url + "');";

                if (typeof(errors[check.severity]) === 'undefined') {
                    errors[check.severity] = 0;
                }
                errors[check.severity]++;
            }

            // building Js
            javascript = '<script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.slim.min.js"></script>'
                + '<script type="text/javascript">'
                + 'function a11y_add_error(level, description, selector, code, ruleUrl) {'
                + '    $(selector)'
                + '        .css("background-color", "yellow")'
                + '        .css("outline", "4px solid red")'
                + '        .attr("title", description + " (" + code + ")")'
                + '        .click(function(e) { e.preventDefault(); window.open(ruleUrl) });'
                + '};'
                + '$(function() { ' + javascript + '});'
                + '</script>';


            // building HTML
            html = html.replace(/<head>/, '<head><base href="' + url + '" />');
            html = html.replace(/(<body .*?>)/, '$1' + javascript);

            // generating report
            console.log('  Generating report in ' + output + '...');
            fs.writeFile(output, html, function (err) {
                if (err) throw err;
                console.log("\nDone with:");

                for (error in errors) {
                    console.log(" - " + error + ': ' + errors[error]);
                }
            });
        });
    });
}
