QUnit.test('Negative or positive minPointLength', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                minPointLength: 10
            }
        },
        series: [{
            data: [100]
        }, {
            data: [0, 0]
        }]
    });

    assert.strictEqual(
        chart.series[1].points[0].graphic.attr('y') + 5 < chart.plotHeight,
        true,
        'Not negative is there is no space in the yAxis (#7311)'
    );
});