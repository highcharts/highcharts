Highcharts Samples
==================

This directory contains Highcharts samples used in live demos, jsFiddle, visual
tests and unit tests. See the [highcharts-utils](https://github.com/highcharts/highcharts-utils)
repo on how to set up the _Sample viewer_.


Tests
-----

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
compared pixel by pixel, and the difference is logged. Auto-visual tests are
less performant than unit tests, and unit tests should be favoured for
regression tests.

2. **Manual tests**. Some tests, like some dealing with animation or complicated
user input, are still manual. In the utils, they are marked with a checkbox to
the name. We are gradually replacing these with automatic tests. For each manual
test, there should be a file, `test-notes.md` that instructs the tester on
what to look for.

3. **Unit tests**. These samples are designed to run both in our sample viewer
and in karma. They load QUnit. Unit tests are recognized by a jigsaw puzzle
piece next to the name. QUnit is loaded in the `demo.details` files and the
required HTML must be present in `demo.html`. The recommended way to add a new
test is to copy and modify an existing one.

The tests that are added to `/samples/unit-tests` are also part of the
pre-commit tests that run via karma, and in CircleCI tests in multiple browsers.
Run `gulp test` on the root to pre-check. Read more at
[highcharts/test](https://github.com/highcharts/highcharts/tree/master/test).



Useful Tips for Setting Up Tests
--------------------------------

**Using data from `/samples/data`***
If you have a large data set, it is better to put it in `/samples/data` than to
paste it inline in demo.js or demo.html. These files must be loaded via `cdn.jsdelivr.net` in order to work both on our website, locally and on jsFiddle.
1. Add your file to `/samples/data`.
2. Perform a commit and take note of the commit hash.
3. Now in your sample (`demo.js`), load the data from jsdelivr.net, for example 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@24912efc85/samples/data/aapl.json', where the part after 'highcharts@' is the commit hash from last point. Note that this now works in the utils because the utils are rewriting the URL and loading locally.
4. Next time you push your commits, this will work online as well.

**Mouse events** are emulated using the
[TestController](https://github.com/highcharts/highcharts/blob/master/test/test-controller.js)
that is available in the test environment.

```js
// Instanciate
const controller = new TestController(chart);

// Simulate panning with the shift key pressed. X and Y are chart coordinates.
controller.pan([200, 100], [150, 100], { shiftKey: true });
```

**Increase performance** with test templates. They share charts between multiple
tests and cover common test scenarios. Details can be found further down.

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



Test Templates
--------------

### Using Test Templates

With the help of test templates you can increase the overal performance of the
unit tests task. The chart and its container are shared between multiple tests
and test-specific options get reverted after each test.

The limitations of the underlying `Chart.update` function applies, so that
callback functions are not supported as they cannot be reverted. Additionally
the `Chart.update` function is not wrapped in a template and therefor has to be
avoided as well. If you need to test with callback functions or multiple
updates, test templates are not for you.

Here is an example of the code pattern to make use of a test template with
test-specific options:
```js
QUnit.test('My test', function (assert) {
    TestTemplate.test('highcharts/line', {
        // additional options to modifiy the template defaults
        myOptionsToTest: {
            enabled: true
        }
    }, function (testTemplate) {
        var chart = testTemplate.chart;
        assert.strictEqual(
            chart.myPropertyToTest,
            20,
            'Chart.myPropertyToTest should be 20 if myOptionsToTest is enabled.'
        );
    });
});
```

### Debugging a Test Template

If you like to debug a template-based test in your browser with the help of
`highcharts-utils`, make sure that there is a copy of the template in
[`/public/javascript/test-templates`](https://github.com/highcharts/highcharts-utils/tree/master/public/javascript/test-templates).

### Create a New Test Template

Do not create several templates for the same series. Instead modify the
existing one in a way that it stays useable for every test. Options to the
specific test case should be made only during the test when calling the
`TestTemplate.test` function.

If you have a new series, that is lacking a test template, you can create one in
[/test/templates](https://github.com/highcharts/highcharts/tree/master/test/tesmplates).
The option set has to be as simple as possible to cover the common test
scenarios for this series. The name for the template should follow the file
path, so if the template is named `highmaps/geoseries`, it should be placed in
`/test/templates/highmaps/geoseries.js`.

```js
// Parameters: name, chart factory function, chart template options
TestTemplate.register('highmaps/geoseries', Highcharts.mapChart, {

    chart: {
        type: 'geoseries'
    },

    title: {
        text: 'template/highmaps/geoseries'
    },

    series: [{
        type: 'geoseries',
        data: [[0, 1], [2, 3], [2, 1]]
    }]

});
```

## Demos

Samples that are meant to appear on highcharts.com/demo have additional metadata requirements. These are set in the `demo.details` file. Below is an example.

```
---
name: Basic area
authors:
  - Torstein Hønsi
js_wrap: b
alt_text: >-
  Highcharts basic area chart JavaScript example graph compares cold war nuclear
  weapon stockpile peaks over time.
tags:
  - Highcharts demo
categories:
  - Area charts:
      priority: 1
...
```

Use the `tags` property to set the product tag, and `categories` to set the categories it should belong to. Both should correspond with tags and categories set in `/samples/demo-config.js`.

If you want the demo to appear higher (or lower) within the category you can also set a `priority`.

If you want to commit the demo without it appearing on the website, the category can be set to `unlisted`.