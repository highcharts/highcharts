QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        bubble = options.plotOptions.bubble;
    // stickyTracking is true to avoid hiding the tooltip when follow pointer is true.
    assert.strictEqual(
        bubble.stickyTracking,
        true,
        'stickyTracking should default to true.'
    );
});