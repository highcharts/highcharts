/* eslint func-style:0 */

QUnit.test('Animation', function (assert) {

    var clock = null;

    try {

        clock = TestUtilities.lolexInstall();

        var maxColor = 'rgb(255,255,255)',
            chart = Highcharts
                .chart('container', {

                    chart: {
                        animation: {
                            duration: 1000
                        }
                    },

                    colorAxis: {
                        minColor: 'rgb(0,0,0)',
                        maxColor: maxColor
                    },

                    series: [{
                        type: 'heatmap',
                        data: [
                            [0, 0, 1],
                            [0, 1, 10]
                        ]
                    }]

                }),
            point = chart.series[0].points[0],
            initialColor = Highcharts.Color(
                point.graphic.attr('fill')
            ).get(),
            currentColor,
            done = assert.async();

        chart.series[0].setData([
            { value: 100 },
            { value: 10 }
        ]);

        setTimeout(function () {
            currentColor = Highcharts.Color(
                point.graphic.attr('fill')
            ).get();

            assert.notEqual(
                currentColor,
                initialColor,
                'Time 500 - color SHOULD NOT be the same as initial one (#11239)'
            );

            assert.notEqual(
                currentColor,
                maxColor,
                'Time 500 - color SHOULD NOT be the same as MAXCOLOR color (#11239)'
            );
        }, 500);

        setTimeout(function () {
            currentColor = Highcharts.Color(
                point.graphic.attr('fill')
            ).get();

            assert.strictEqual(
                currentColor,
                maxColor,
                'Time 1200 - color SHOULD be the same as MAXCOLOR (#11239)'
            );

            done();
        }, 1200);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});