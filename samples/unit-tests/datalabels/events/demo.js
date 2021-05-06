QUnit.test('Datalabel click', assert => {
    let clicked = false;

    const chart = Highcharts.chart('container', {
        series: [{
            type: 'line',
            data: [1, 2, 3],
            dataLabels: {
                enabled: true
            },
            events: {
                click: () => {
                    clicked = true;
                }
            }
        }]
    });

    const controller = new TestController(chart);
    const label = chart.series[0].points[0].dataLabel;
    const x = chart.plotLeft + label.x + label.width / 2;
    const y = chart.plotTop + label.y + label.height / 2;

    controller.moveTo(x, y);
    controller.click();

    assert.ok(
        clicked,
        '#15525: Clicking data label should fire series click event'
    );
});
