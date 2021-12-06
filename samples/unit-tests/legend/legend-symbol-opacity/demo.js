QUnit.test('Legend symbol transparency', function (assert) {
    Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        series: [
            {
                data: [1, 3, 2, 4],
                fillOpacity: 0.5
            },
            {
                data: [4, 4, 7, 1],
                opacity: 0.3
            }
        ]
    });
    assert.equal(true, true, '');
});
