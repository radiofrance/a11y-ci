#!/usr/bin/env node
var fs = require('fs');
var a11y = require('a11y');
var program = require('commander');

// user input
program
    .version('0.0.1')
    .description('Generates report for a11y')
    .arguments('<url>')
    .option('-t, --timeout <timeout>', 'Timeout in seconds', parseInt)
    .option('-rv, --violations <violations>', 'Generates a violation XML file', false)
    .option('-rh, --html <html>', 'Generates a HTML report file', false)
    .option('-rd, --htmldox <html>', 'Generates a HTML Dox report file', false)
    .option('-rj, --junit <junit>', 'Generates a JUnit XML report file', false)
    .option('-q --quiet', 'Quiet mode', false)
    .action(function (url,  options) {
        main(url, options);
    })
    .parse(process.argv);


function main(url, options) {

    // options
    options.timeout = options.timeout || 20;

    // get source
    console.log('Auditing ' + url);
    console.log('  Fetching sources...');
    var source = require('./source');
    source.getSource(url, function (html) {

        // run audit
        console.log('  Running audit...');
        a11y(url, {resourceTimeout: options.timeout}, function (err, reports) {
            if (err) {
                throw err;
            }
            var audit = reports.audit;

            // XML logs
            if(options.violations) {
                require('./report/violations').generate(url, audit, options.violations);
            }

            // XML logs
            if(options.junit) {
                require('./report/junit').generate(url, audit, options.junit);
            }

            // HTML logs
            if(options.html) {
                require('./report/html').generate(url, audit, options.html, html);
            }

            // HTML dox logs
            if(options.htmldox) {
                require('./report/htmldox').generate(url, audit, options.htmldox, html);
            }

            if(!options.quiet) {
                require('./report/cli').generate(url, audit, reports.report);
            }

            console.log("\nDone");
        });
    });
}
