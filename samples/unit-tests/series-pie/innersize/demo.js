
QUnit.test('Percentage inner size', function (assert) {

    Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        plotOptions: {
            pie: {
                innerSize: '50%'
            }
        },
        series: [{
            data: [['Firefox', 44.2], ['IE7', 26.6], ['IE6', 20], ['Chrome', 3.1], ['Other', 5.4]]
        }]
    });

    var series = Highcharts.charts[0].series[0],
        innerSize = series.options.innerSize;

    assert.equal(
        series.center[3],
        series.center[2] * parseInt(innerSize, 10) / 100,
        'Inner size should be 50% of outer size'
    );

});
