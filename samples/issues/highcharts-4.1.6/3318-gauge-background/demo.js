$(function () {
    QUnit.test('Gauge background', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: "gauge"
            },
            "series": [{
                data: [10]
            }]
        });
        Highcharts.chart('container', {
            id: 'LINE',
            chart: {
                polar: true,
                type: 'line'
            },
            series: [{
                data: [1, 1, 1, 1]
            }]
        });

        assert.strictEqual(
            chart.xAxis[0].plotLinesAndBands.length,
            0,
            'No plot bands exist'
        );

    });

});
