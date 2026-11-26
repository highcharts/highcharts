QUnit.test(
    'Boosted scatter points keep their series index when zoomed (#23169)',
    function (assert) {
        const data = [];
        for (let i = 0; i < 10000; i++) {
            data.push([i, Math.random() * 100]);
        }

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter'
            },
            boost: {
                useGPUTranslations: true
            },
            series: [{
                boostThreshold: 1,
                data: data
            }]
        });

        const series = chart.series[0];

        assert.ok(
            series.boosted,
            'Series should be boosted.'
        );

        // Zoom in so that the first visible point is not the first in data
        chart.xAxis[0].setExtremes(5000, 5100);

        assert.ok(
            series.boosted,
            'Series should still be boosted after zoom.'
        );

        const points = series.points.map(
            mockup => series.boost.getPoint(mockup)
        );

        assert.ok(
            points.length > 0,
            'Visible points should be found after zoom.'
        );

        assert.ok(
            points.every(point => point.index === point.x),
            'Each visible point should have its index in the series data ' +
            'when zoomed.'
        );

        assert.strictEqual(
            points[0].index,
            5000,
            'First visible point should have index 5000, not 0.'
        );
    }
);

QUnit.test(
    'Boosted scatter points keep their series index when cropped on load (#23169)',
    function (assert) {
        const data = [];
        for (let i = 0; i < 10000; i++) {
            data.push([i, Math.random() * 100]);
        }

        // Crop on the first render, before the series enters boost mode
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter'
            },
            xAxis: {
                min: 5000,
                max: 5100
            },
            boost: {
                useGPUTranslations: true
            },
            series: [{
                boostThreshold: 1,
                data: data
            }]
        });

        const series = chart.series[0];

        assert.ok(
            series.boosted,
            'Series should be boosted on load.'
        );

        const points = series.points.map(
            mockup => series.boost.getPoint(mockup)
        );

        assert.ok(
            points.length > 0,
            'Visible points should be found on load.'
        );

        assert.ok(
            points.every(point => point.index === point.x),
            'Each visible point should have its index in the series data ' +
            'when cropped on load.'
        );

        assert.strictEqual(
            points[0].index,
            5000,
            'First visible point should have index 5000, not 0, on load.'
        );
    }
);
