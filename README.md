# a11y-gui

Accessibility testing, with HTML reports

![previewing report](docs/screen1.jpg)

## Installation

    npm install -g a11y-gui

## Usage

    a11y-gui <url> <html-report-file>
    
    # Example:
    a11y-gui https://www.github.com ./my-report.html

## How it works

a11y-gui browses websites with [PhantomJs](https://github.com/ariya/phantomjs) and audit accessibility with the [Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools).

## Licence

Copyright Radio France, Licence [CeCILL-B](http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html) (fully compatible with BSD-like licenses (BSD, X11, MIT))