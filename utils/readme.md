# Highcharts Utilities

Highcharts Utilities is a set of tools to run quality checks, maintenance and issue tracking on Highcharts. It runs
on PHP and is intended to be hosted from the local system.

## Requirements
* A web server with PHP enabled to run the utilities.
* In order to run the issue-by-commit tool, git needs to be installed on the system and available in the system path.

## Setup
You can run most the utilities by simply putting the highcharts.com folder in a place where PHP can reach it, and
point the browser to the `/utils` folder. However, the `/samples` page needs a local virtual host, `code.highcharts.local` in
order to run concatenated scripts from the local repo. Best practice is also to set up a virtual host for the utilities.

1. Add the two sites to the hosts file:
```
127.0.0.1    utils.highcharts.local
127.0.0.1    code.highcharts.local
```

2. Add them to the httpd.conf config file for Apache:
```xml
<VirtualHost *>
DocumentRoot "/Users/{...}/highcharts.com/js"
ServerName code.highcharts.local
</VirtualHost>
```
```xml
<Directory "/Users/{...}/highcharts.com/js">
	AllowOverride All
</Directory>
```
```xml
<VirtualHost *>
DocumentRoot "/Users/{...}/highcharts.com/utils"
ServerName utils.highcharts.local
</VirtualHost>
```

3. Restart your browser and point it to <a href="http://utils.highcharts.local">utils.highcharts.local</a>.

## Tests
Highcharts regression tests are found in the `utils.highcharts.local/samples` tools. To run a test, click on the side-by-side
(two panes) icon next to the name. To run all tests in succession, click the "Run tests" button at the top. Roughly there
is one sample per API option, in addition to regression tests for issues. 

There are different
types of tests:

1. **Auto-visual tests**. Unless otherwise specified in the sample itself, two iframes are loaded, one with the current stable release
and one with the test candidate of Highcharts. The SVG output is rendered on two canvases, these are compared pixel by pixel,
and the difference is logged. Some auto-visual tests are extended by a test script, `test.js`, that does actions on the chart 
before the comparison runs. This enables things like popping up the tooltip before comparing, doing mouse interaction and more. 
Auto-visual tests are less performant than unit tests, and unit tests should be favoured for regression tests.

2. **Manual tests**. Some tests, like those dealing with animation or complicated user input, are still manual. They are marked with
`[m]` in front of the name. We are gradually replacing these with automatic tests.

3. **Unit tests**. These samples are designed to run both in our sample viewer and in jsFiddle. They load QUnit. Unit tests are recognized
by a jigsaw puzzle piece next to the name. QUnit is loaded in the `demo.details` files and the required HTML must be present in `demo.html`.
The recommended way to add a new test is to copy and modify an existing one. 

