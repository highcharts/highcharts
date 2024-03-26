QUnit.test('#20529: Chart-stockChart-constructor rangeselector first-load comparison.', function (assert) {

    const done = assert.async();
    fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/aapl-c.json')
        .then(response => response.json())
        .then(aaplCJson => {
            const options = {
                rangeSelector: {
                    enabled: true,
                    selected: 1 // 3 months
                },
                series: [
                    {
                        data: aaplCJson
                    }
                ]
            };

            let chart = Highcharts.chart('container', options),
                chartInfo = {
                    min: chart.xAxis[0].min,
                    max: chart.xAxis[0].max,
                    rangeSelectorSelected: chart.rangeSelector.selected
                },
                stockChart = Highcharts.stockChart('container', options);

            /**
             * Test stockChart and chart constructor selects proper range.
             * (also) Check if rangeselector works without axis options defined
             *        for both stockChart and chart.
             */
            assert.strictEqual(
                stockChart.xAxis[0].min,
                chartInfo.min,
                'xAxis min should be the same even without axis options.'
            );
            assert.strictEqual(
                stockChart.xAxis[0].max,
                chartInfo.max,
                'xAxis max should be the same even without axis options.'
            );
            assert.strictEqual(
                stockChart.rangeSelector.selected,
                chartInfo.rangeSelectorSelected,
                'rangeSelector.selected should be the same even without axis options.'
            );

            // Add in x-axis options to user options.
            options.xAxis = {
                type: 'datetime'
            };
            chart = Highcharts.chart('container', options);
            chartInfo = {
                min: chart.xAxis[0].min,
                max: chart.xAxis[0].max,
                rangeSelectorSelected: chart.rangeSelector.selected
            };
            stockChart = Highcharts.stockChart('container', options);

            /**
             * Test stockChart and chart constructor selects proper range.
             * (also) Check if rangeselector works with axis options defined
             *        for both stockChart and chart.
             */
            assert.strictEqual(
                stockChart.xAxis[0].min,
                chartInfo.min,
                'xAxis min should be the same.'
            );
            assert.strictEqual(
                stockChart.xAxis[0].max,
                chartInfo.max,
                'xAxis max should be the same.'
            );
            assert.strictEqual(
                stockChart.rangeSelector.selected,
                chartInfo.rangeSelectorSelected,
                'rangeSelector.selected should be the same.'
            );

            done();
        })
        .catch(error => {
            assert.ok(false, 'Error downloading or processing data: ' + error);
            done();
        });
});
