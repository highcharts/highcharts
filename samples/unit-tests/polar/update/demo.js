QUnit.test('#13490: Hovering after disabling polar', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            polar: true
        },
        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            tickWidth: 1,
            tickmarkPlacement: 'on'
        },
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
                135.6, 148.5, 216.4, 194.1, 95.6, 54.4
            ]
        }],
        tooltip: {
            hideDelay: 0
        }
    });

    const point = chart.series[0].points[0];

    const controller = new TestController(chart);
    controller.moveTo(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY
    );

    chart.update({ chart: { polar: false } }, true, true);

    controller.moveTo(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY
    );

    assert.strictEqual(
        chart.tooltip.isHidden,
        false,
        'First point tooltip should be visible'
    );
});