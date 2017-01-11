/**
 * (c) 2016 Radio France
 * This program is free software: you can redistribute it and/or modify it under the terms of the CeCILL-B license
 */
var system = require('system');
var url = system.args[1];

var page = require('webpage').create();
page.onResourceError = page.onConsoleMessage = page.onError = page.onAlert = function(resourceError) {
};
page.open(url, function () {
    console.log(page.content);
    phantom.exit(0);
});