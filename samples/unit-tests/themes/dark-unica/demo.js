QUnit.test('Check if Dark Unica load', function (assert) {
    assert.strictEqual(
        typeof Highcharts.theme,
        'object',
        'Highcharts.theme is set'
    );
});