var system = require('system');
var url = system.args[1];

var page = require('webpage').create();
page.onResourceError = page.onConsoleMessage = page.onError = page.onAlert = function(resourceError) {
};
page.open(url, function () {
    console.log(page.content);
    phantom.exit(0);
});