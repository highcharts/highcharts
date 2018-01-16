QUnit.test('#6546 - stacking with gapSize', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                type: 'area'
            },
            rangeSelector: {
                selected: 1
            },
            plotOptions: {
                series: {
                    gapSize: 1,
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'USD to EUR',
                data: [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1],
                    [4, 1],
                    [7, 1],
                    [8, 1],
                    [9, 1],
                    [10, 1],
                    [11, 1]
                ]
            }]
        }),
        path = chart.series[0].graphPath;

    path.splice(0, 1);

    assert.strictEqual(
        Highcharts.inArray('M', path) > -1,
        true,
        'Line is broken'
    );
});

QUnit.test('Updating to null value (#7493)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'area',
            stacking: 'normal',
            data: [1, 2, 3, 4, 5]
        }]
    });

    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
        0,
        'Graph should not be broken initially'
    );

    chart.series[0].setData([4, 3, null, 2, 1]);
    assert.notEqual(
        chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
        0,
        'Graph should be broken after update with null'
    );

});