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
DocumentRoot "/Users/{...}/highcharts.com/code"
ServerName code.highcharts.local
</VirtualHost>
```
```xml
<Directory "/Users/{...}/highcharts.com/code">
	AllowOverride All
</Directory>
```
```xml
<VirtualHost *>
DocumentRoot "/Users/{...}/highcharts.com/utils"
ServerName utils.highcharts.local
</VirtualHost>
```

**Note**: If you're running your apache server in a VirtualBox VM serving the util files from the host system, you may need to add `EnableSendfile Off` to the code directory configuration. This is because re-builds are not always picked up (and sometimes only partly picked up causing mangled output) without it due to internal OS caching.  

3. Restart your browser and point it to <a href="http://utils.highcharts.local">utils.highcharts.local</a>.

## Tests
Highcharts regression tests are found in the `utils.highcharts.local/samples`
tools. To run a test, click on the icon next to the name. To run all tests in succession, click the "Run tests" button at the top. Roughly there
is one sample per API option, in addition to unit tests and regression tests for issues. The test suite serves a double purpose, in part it is simple
usage examples or demos used from the API documentation, in part it is regression tests.

There are different
types of tests:

1. **Auto-visual tests**. Unless otherwise specified in the sample itself, two iframes are loaded, one with the current stable release
and one with the test candidate of Highcharts. The SVG output is rendered on two canvases, these are compared pixel by pixel,
and the difference is logged. Some auto-visual tests are extended by a test script, `test.js`, that does actions on the chart 
before the comparison runs. 
Auto-visual tests are less performant than unit tests, and unit tests should be favoured for regression tests.

2. **Manual tests**. Some tests, like some dealing with animation or complicated user input, are still manual. They are marked with
a hand next to the name. We are gradually replacing these with automatic tests. For each manual test, there should be a file, 
`test-notes.html` that instructs the tester on what to look for.

3. **Unit tests**. These samples are designed to run both in our sample viewer and in karma. They load QUnit. Unit tests are recognized
by a jigsaw puzzle piece next to the name. QUnit is loaded in the `demo.details` files and the required HTML must be present in `demo.html`.
The recommended way to add a new test is to copy and modify an existing one. 

The tests that are added to `/samples/unit-tests` are also part of the pre-commit tests 
that run via karma. Run `npm test` on the root to pre-check.

### Useful tips for setting up tests
**Mouse events** are emulated using the [TestController](https://github.com/highcharts/highcharts/blob/master/utils/samples/test-controller.js)
			that is available in the test environment (through compare-iframe.php). To emulate
			a mouse event on a specific target, its position can be found using `getBBox()`.

```js
// Instanciate
var controller = TestController(chart);
 
// Simulate panning with the shift key pressed. X and Y are chart coordinates.
test.mousedown(200, 100, { shiftKey: true });
test.mousemove(150, 100, { shiftKey: true });
test.mouseup();
```
**demo.details** can be used to set some directives for the auto-visual tests.
* `compareTooltips: true` in auto-visual tests instructs the test runner to open a tooltip before capturing the image.
* `exportInnerHTML: true` in auto-visual tests makes the comparison run on the actual innerHTML of the charts. The default is to run `chart.getSVG()` to export the chart first.
* `requiresManualTesting: true` makes the test runner skip the sample and waits for manual testing.
* `skipTest: true` makes the test always pass. Typically used for samples that are meant for education, where the actual feature is covered by other tests.


