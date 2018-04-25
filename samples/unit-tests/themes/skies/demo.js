QUnit.test('Check if Skies load', function (assert) {
    assert.strictEqual(
        typeof Highcharts.theme,
        'object',
        'Highcharts.theme is set'
    );
});