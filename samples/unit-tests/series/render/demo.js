QUnit.test(
    'Should not draw destroyed condemned points',
    function (assert) {
        const done = assert.async(),
            animDuration = 10,
            chart = Highcharts.chart('container', {
                chart: {
                    animation: {
                        duration: animDuration
                    }
                },
                series: [{
                    data: [1, 2]
                }]
            }),
            series = chart.series[0];

        chart.renderer.globalAnimation = {
            duration: animDuration
        };

        series.removePoint(0, false);

        setTimeout(function () {
            let error;

            try {
                series.render();
            } catch (e) {
                error = e;
            }

            assert.ok(
                !error,
                'Chart renders without trying to draw the destroyed point'
            );

            assert.strictEqual(
                series.condemnedPoints[0].graphic,
                undefined,
                'Do not add graphic during render to already destroyed point'
            );

            done();
        }, animDuration * 2);
    }
);
