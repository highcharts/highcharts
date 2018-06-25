QUnit.test('Check if Grid Light load', function (assert) {
    assert.strictEqual(
        typeof Highcharts.theme,
        'object',
        'Highcharts.theme is set'
    );
});