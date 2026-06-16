QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Boosted scatter reset zoom restores Y extremes (#24386)',
    function (assert) {
        const data = [];
        for (let i = 0; i < 1000000; i++) {
            data.push([
                Math.pow(Math.random(), 2) * 100,
                Math.pow(Math.random(), 2) * 100
            ]);
        }

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zooming: {
                    type: 'y'
                }
            },
            boost: {
                useGPUTranslations: true
            },
            series: [{
                boostThreshold: 1,
                data: data
            }]
        });

        const series = chart.series[0],
            yAxis = chart.yAxis[0],
            initialDataMin = yAxis.dataMin,
            initialDataMax = yAxis.dataMax;

        assert.ok(
            series.boosted,
            'Series should be boosted.'
        );

        // Zoom in on the Y axis
        yAxis.setExtremes(40, 60);

        assert.ok(
            yAxis.max - yAxis.min < initialDataMax - initialDataMin,
            'Y axis should be zoomed in.'
        );

        // Reset zoom
        yAxis.setExtremes(null, null);

        assert.strictEqual(
            yAxis.dataMin,
            initialDataMin,
            'yAxis dataMin should be restored after reset zoom.'
        );

        assert.strictEqual(
            yAxis.dataMax,
            initialDataMax,
            'yAxis dataMax should be restored after reset zoom.'
        );
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Boosted scatter reset zoom after a deep zoom disables boost (#24386)',
    function (assert) {
        const data = [];
        for (let i = 0; i < 1000000; i++) {
            data.push([
                Math.pow(Math.random(), 2) * 100,
                Math.pow(Math.random(), 2) * 100
            ]);
        }

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zooming: {
                    type: 'y'
                }
            },
            boost: {
                useGPUTranslations: true
            },
            series: [{
                data: data
            }]
        });

        const series = chart.series[0],
            yAxis = chart.yAxis[0],
            initialYDataMin = yAxis.dataMin,
            initialYDataMax = yAxis.dataMax;

        assert.ok(
            series.boosted,
            'Series should be boosted from the start.'
        );

        // Zoom into a tiny Y sector with few points to disable boost
        yAxis.setExtremes(995, 1000);

        assert.notOk(
            series.boosted,
            'Boost should be disabled when very few points are visible.'
        );

        // Reset zoom
        yAxis.setExtremes(null, null);

        assert.strictEqual(
            yAxis.dataMin,
            initialYDataMin,
            'yAxis dataMin should be restored after reset zoom.'
        );

        assert.strictEqual(
            yAxis.dataMax,
            initialYDataMax,
            'yAxis dataMax should be restored after reset zoom.'
        );

        assert.ok(
            series.boosted,
            'Boost should re-enable after reset zoom.'
        );
    }
);
