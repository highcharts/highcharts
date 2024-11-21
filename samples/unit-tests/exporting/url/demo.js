QUnit.test('Exporting module is compatible with https', function (assert) {
    var defaultOptions = Highcharts.getOptions();
    assert.strictEqual(
        defaultOptions.exporting.url,
        'https://export-svg.highcharts.com/',
        'exporting.url default value should be https://export-svg.highcharts.com/'
    );
});
