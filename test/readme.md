# Test runner

Use `gulp test` to run the tests using karma and QUnit. All tests in the `samples/unit-tests`
directory will run. For debugging, it may be convenient to use the
[visual test tools](https://github.com/highcharts/highcharts/tree/master/utils).

Tests will run on _pre-commit_ and will block committing in case of failure.

#### Features
- *Testing animation*. Animation is by default disabled by `Highcharts.setOptions`.
  For testing animation, `lolex` is available. It emulates animation in sync.
  Use the utility functions `lolexInstall` before the test and `lolexRunAndUninstall`
  after (find samples in the test suite).

#### Optimize for speed
We want fast running tests. The time it takes to run the test suite is largely
limited by the time it takes to create chart instances. Therefore, we want to
limit the number of charts in the test suite.

- When it feels correct, try reusing an existing chart instance to do your test.
  For example, when writing a test for a regression related to `setExtremes`, we 
  would see in the axis tests if there is a chart where we can run the problem
  code and add an assertion. Of course we shouldn't overdo this - try to find the
  right balance between well organized code and speed.
- Don't create a chart unless you have to. For example, tests for text wrapping
  only needs an `SVGRenderer` instance, colors can test directly against the
  `Color` object, data parsing directly against the `Data` object.

#### Troubleshooting
- All the Highcharts files, including modules and indicators, are loaded in the
  test runner. A badly written module can cause errors downstream. If you
  can't pinpoint an error, try removing files from `test/karma-files.json`.
- Similar to the above, all tests run in the same thread, so a badly written 
  test may cause errors downstream. Try limiting the number of tests that run
  by modifying the glob in the `files` config in `tests/karma-config.js`.
- Traditionally, the Highcharts unit tests have a `demo.html` file where the
  tests in `demo.js` run. In karma/QUnit, the `demo.html` file is not included.
  If the test depends on things like the width of the container or other DOM 
  elements, this must be set up by JavaScript in `demo.js`. A fixed size chart
  is better defined with the `chart.width` option.
- Don't use global variables. ESLint should raise an error on this on pre-commit.
  If several of the tests in the same `demo.js` share a function or variables,
  wrap it all in an IIFE.
- All the tests run on one Highcharts instance. When running `Highcharts.setOptions()`,
  make sure to unset the changed options, otherwise it may break tests
  downstream.
