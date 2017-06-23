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
                data: usdeur
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