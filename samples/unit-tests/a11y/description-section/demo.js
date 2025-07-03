QUnit.test('Section elements', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.ok(
        chart,
        'Placeholder'
    );
});
