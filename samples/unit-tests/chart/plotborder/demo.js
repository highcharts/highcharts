QUnit.test('Plot border', function (assert) {
    const clock = TestUtilities.lolexInstall();

    try {
        const done = assert.async();

        const chart = Highcharts.chart('container', {
            chart: {
                plotBorderWidth: 0.5,
                width: 400
            },
            series: [
                {
                    data: [0, 0, 0]
                }
            ],
            yAxis: {
                min: 0,
                max: 10
            }
        });

        assert.strictEqual(
            chart.clipBox.y,
            1,
            'Clip box\'s width for plotBorderWidth=0.5 should be adjusted by 1'
            // to avoid clipping the series plot that is drawn on the edge
        );

        assert.strictEqual(
            chart.container
                .querySelector('.highcharts-plot-border')
                .getAttribute('stroke-width'),
            '0.5',
            'Stroke width should be 0.5' // initial value
        );

        const width = chart.container
            .querySelector('.highcharts-plot-border')
            .getBBox()
            .width;
        chart.setSize(500, undefined, { duration: 50 });

        setTimeout(function () {
            assert.notEqual(
                chart.container
                    .querySelector('.highcharts-plot-border')
                    .getBBox()
                    .width,
                width,
                'Plot border rectangle width should change after redraw'
            );
            done();
        }, 60);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
