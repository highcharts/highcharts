QUnit.test('Mouse wheel zoom on chart(#19976)', function (assert) {

    const chart = Highcharts.chart('container', {
        chart: {
            zooming: {
                type: 'x'
            }
        },
        series: [{
            type: 'column',
            data: Array.from(Array(30)).map(() => Math.random() * 10)
        }]
    });

    const controller = new TestController(chart);

    controller.mouseWheel(200, 100, -1000, true);
    const actualMin = chart.series[0].xAxis.min;

    assert.close(
        actualMin,
        3.7,
        1,
        'Should zoom to retract xAxis to this extreme.'
    );
});
