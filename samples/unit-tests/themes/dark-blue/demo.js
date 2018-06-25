QUnit.test('Check if Dark Blue load', function (assert) {
    assert.strictEqual(
        typeof Highcharts.theme,
        'object',
        'Highcharts.theme is set'
    );
});