QUnit.test(
    '#20529 Chart-stockChart rangeselector first-load comparison.',
    function (assert) {
        const options = {
            rangeSelector: {
                enabled: true,
                selected: 1 // 3 months
            },
            series: [
                {
                    // 12 points spanning 1 year
                    data: [
                        [1680943005882, 0.35], [1683535005882, 1.01],
                        [1686127005882, 3.6], [1688719005882, 7.69],
                        [1691311005882, 1.66], [1693903005882, 3.94],
                        [1696495005882, 7.66], [1699087005882, 2.77],
                        [1701679005882, 5.68], [1704271005882, 5.14],
                        [1706863005882, 2.63], [1709455005882, 0.9]
                    ]
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
            'xAxis min should be the same without axis options.'
        );
        assert.strictEqual(
            stockChart.xAxis[0].max,
            chartInfo.max,
            'xAxis max should be the same without axis options.'
        );
        assert.strictEqual(
            stockChart.rangeSelector.selected,
            chartInfo.rangeSelectorSelected,
            'rangeSelector.selected should be the same without axis options.'
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
    }
);
