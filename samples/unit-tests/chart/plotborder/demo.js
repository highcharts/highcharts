QUnit.test('Plot border', function (assert) {

    var clock = TestUtilities.lolexInstall();

    try {

        var done = assert.async();

        var chart = Highcharts.chart('container', {
            chart: {
                plotBorderWidth: 1,
                width: 400
            },
            series: [{
                data: [1, 3, 2, 4]
            }]
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-plot-border')
                .getAttribute('stroke-width'),
            '1',
            'Stroke width should be 1'
        );

        var width = chart.container.querySelector('.highcharts-plot-border')
                .getAttribute('width');
        chart.setSize(500, undefined, { duration: 50 });

        setTimeout(function () {
            assert.notEqual(
                chart.container.querySelector('.highcharts-plot-border')
                    .getAttribute('width'),
                width,
                'Plot border rectanble width should change after redraw'
            );
            done();
        }, 60);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});