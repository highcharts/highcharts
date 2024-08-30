QUnit.test('Label position after redraw (#4133)', function (assert) {
    const chart = Highcharts.chart('container', {
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
        xAxis: {
            min: 3
        },
        series: [{
            type: 'errorbar',
            cropThreshold: 1,
            data: [
                [0, 19.6, 28.2],
                [1, 18.1, 28.2],
                [4, 10.8, 19.2]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].data[0],
        void 0,
        `First element should be undefined (empty) and there shouldn't be any
        error in the console while cropped data have empty elements in array
        (#20097).`
    );

    chart.xAxis[0].update({
        min: void 0
    }, false);

    chart.series[0].setData([
        [48, 81],
        [68, 123],
        [52, 110]
    ]);

    const oldY = chart.series[0].points[1].dataLabelUpper.y;

    chart.setSize(300, 400);

    assert.strictEqual(
        oldY,
        chart.series[0].points[1].dataLabelUpper.y,
        'Upper data label has not changed position'
    );
});
