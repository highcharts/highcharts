QUnit.test('Pinching to zoom on chart(#19976)', function (assert) {

    const chart = Highcharts.chart('container', {
        chart: {
            inverted: true, // Hack to zoom on x with pinch
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
    controller.pinch(100, 100, 50);
    const actualMin = chart.series[0].xAxis.min;

    assert.close(
        actualMin,
        3.3,
        1,
        'Should zoom to retract xAxis to this extreme.'
    );
});
