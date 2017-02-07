
QUnit.test('Label position after redraw (#4133)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                height: 400,
                animation: false
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                type: 'errorbar',
                data: [
                    [48, 81],
                    [68, 123],
                    [52, 110]
                ]
            }]
        }),
        oldY = chart.series[0].points[1].dataLabelUpper.y;

    chart.setSize(300, 400);

    assert.strictEqual(oldY, chart.series[0].points[1].dataLabelUpper.y, 'Upper data label has not changed position');
});
