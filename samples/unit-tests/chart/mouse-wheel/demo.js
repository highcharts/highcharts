QUnit.test('Mouse wheel zoom on chart(#19976)', function (assert) {

    const chart = Highcharts.stockChart('container', {
        chart: {
            zooming: {
                type: 'x'
            }
        },
        navigator: {
            enabled: false
        },
        series: [{
            pointInterval: 1000,
            type: 'column',
            data: Array.from(Array(30)).map(() => Math.random() * 10)
        }]
    });

    const controller = new TestController(chart);

    controller.mouseWheel(200, 100, -1000);
    const min = chart.series[0].xAxis.min;

    assert.close(
        min,
        5112,
        1,
        'Should zoom to retract xAxis to this extreme.'
    );

    // Recreate #20430
    chart.update({
        xAxis: {
            overscroll: 10 * 1000
        },
        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }],
            inputEnabled: false,
            selected: 0
        }
    });

    controller.mouseWheel(200, 100, -100);
    const differentMin = chart.series[0].xAxis.min;

    assert.notEqual(
        differentMin,
        min,
        'Should zoom with overscroll (#20430).'
    );
});
