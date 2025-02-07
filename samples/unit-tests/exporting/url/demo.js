QUnit.test('Exporting module is compatible with https', function (assert) {
    var defaultOptions = Highcharts.getOptions();
    assert.strictEqual(
        defaultOptions.exporting.url,
        `https://export-svg.highcharts.com?v=${Highcharts.version}`,
        `exporting.url default value is https://export-svg.highcharts.com?v=${Highcharts.version}`
    );
});
