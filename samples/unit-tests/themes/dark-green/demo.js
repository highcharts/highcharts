QUnit.test('Check if Dark Green load', function (assert) {
    assert.strictEqual(
        typeof Highcharts.theme,
        'object',
        'Highcharts.theme is set'
    );
});