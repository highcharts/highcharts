# Highcharts Samples

This directory contains Highcharts samples used in live demos, jsFiddle, visual
tests and unit tests. See the [highcharts-utils](https://github.com/highcharts/highcharts-utils)
repo on how to set up the _Sample viewer_.

## Tests
Once the sample viewer is set up and running, Highcharts regression tests are
found at `utils.highcharts.local/samples`. To run a test, click on the icon next
to the name. To run all tests in succession, click the "Run tests" button at the
top. Roughly there is one sample per API option, in addition to unit tests and
regression tests for issues. The test suite serves a double purpose, in part it
is simple usage examples or demos used from the API documentation, in part it is
regression tests.

There are different
types of tests:

1. **Auto-visual tests**. Unless otherwise specified in the sample itself, two
iframes are loaded, one with the current stable release and one with the test
candidate of Highcharts. The SVG output is rendered on two canvases, these are
compared pixel by pixel, and the difference is logged. Some auto-visual tests
are extended by a test script, `test.js`, that does actions on the chart before
the comparison runs. Auto-visual tests are less performant than unit tests, and
unit tests should be favoured for regression tests.

2. **Manual tests**. Some tests, like some dealing with animation or complicated
user input, are still manual. They are marked with a hand next to the name. We
are gradually replacing these with automatic tests. For each manual test, there
should be a file, `test-notes.html` that instructs the tester on what to look
for.

3. **Unit tests**. These samples are designed to run both in our sample viewer
and in karma. They load QUnit. Unit tests are recognized by a jigsaw puzzle
piece next to the name. QUnit is loaded in the `demo.details` files and the
required HTML must be present in `demo.html`. The recommended way to add a new
test is to copy and modify an existing one.

The tests that are added to `/samples/unit-tests` are also part of the
pre-commit tests that run via karma. Run `gulp test` on the root to pre-check.
Read more at [highcharts/test](https://github.com/highcharts/highcharts/tree/master/test).

### Useful tips for setting up tests
**Mouse events** are emulated using the
[TestController](https://github.com/highcharts/highcharts/blob/master/test/test-controller.js)
that is available in the test environment (through compare-iframe.php). To
emulate	a mouse event on a specific target, its position can be found using
`getBBox()`.

```js
// Instanciate
var controller = TestController(chart);

// Simulate panning with the shift key pressed. X and Y are chart coordinates.
controller.pan([200, 100], [150, 100], { shiftKey: true });
```
**demo.details** can be used to set some directives for the auto-visual tests.
* `compareTooltips: true` in auto-visual tests instructs the test runner to open
a tooltip before capturing the image.
* `exportInnerHTML: true` in auto-visual tests makes the comparison run on the
actual innerHTML of the charts. The default is to run `chart.getSVG()` to
export the chart first.
* `requiresManualTesting: true` makes the test runner skip the sample and waits
for manual testing.
* `skipTest: true` makes the test always pass. Typically used for samples that
are meant for education, where the actual feature is covered by other tests.
