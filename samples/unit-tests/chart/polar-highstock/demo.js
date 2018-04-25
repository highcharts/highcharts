QUnit.test('Polar chart with correct clipPaths when using Highstock (#6057)', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                polar: true
            },
            xAxis: {
                maxPadding: 0,
                minPadding: 0
            },
            series: [{
                type: 'area',
                data: [1, 2, 3, 4]
            }]

        }),
        series = chart.series[0];

    assert.strictEqual(
        series.clipBox,
        undefined,
        'no Highstock clipping'
    );

});
