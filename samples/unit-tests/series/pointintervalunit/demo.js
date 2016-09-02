$(function () {

    QUnit.test('Point interval unit beyond turboThreshold (#5568)', function (assert) {


        var data = [];
        for (var i = 0; i < 6; i++) {
            data.push(i);
        }

        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },

            plotOptions: {
                series: {
                    pointStart: Date.UTC(2016, 0, 1),
                    pointIntervalUnit: 'day',
                    turboThreshold: 5
                }
            },
            series: [{
                data: data
            }]
        });

        assert.strictEqual(
            chart.series[0].points[0].x,
            Date.UTC(2016, 0, 1),
            'Date start'
        );

        assert.strictEqual(
            chart.series[0].points[5].x,
            Date.UTC(2016, 0, 6),
            'Date end'
        );
    });
});