QUnit.test('#13277: Event listener memory leak', assert => {
    Object.keys(Highcharts.Series.types).forEach(type => {
        if (
            !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&
            type !== 'scatter3d' &&
            type !== 'map' &&
            type !== 'mapline' && // Transform error on redraw
            type !== 'contour' // WebGPU not available in Playwright?
        ) {
            const chart = Highcharts.chart('container', {
                chart: {
                    type: type
                },
                series: [
                    {
                        name: 'Test series'
                    }
                ]
            });
            const eventCount = el => {
                let count = 0;
                // eslint-disable-next-line
                for (const t in el.hcEvents) {
                    count += el.hcEvents[t].length;
                }
                return count;
            };

            const before = eventCount(chart.series[0]);
            const beforeChart = eventCount(chart);

            chart.series[0].update({
                data: []
            });

            assert.strictEqual(
                eventCount(chart.series[0]),
                before,
                `${type} update() should not leak into series.hcEvents`
            );
            assert.strictEqual(
                eventCount(chart),
                beforeChart,
                `${type} update() should not leak into chart.hcEvents`
            );
        }
    });
});
