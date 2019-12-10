QUnit.test(
    'Test Slow Stochastic calculations on data updates.',
    assert => {
        const chart = Highcharts.stockChart('container', {
                yAxis: [{
                    height: '48%'
                }, {
                    height: '48%',
                    top: '52%'
                }],
                series: [{
                    id: 'main',
                    type: 'candlestick',
                    pointInterval: 24 * 3600 * 1000,
                    // Simplified dataset:
                    // [(95 – 60 ) / (100 – 60)] * 100 = 87.5%
                    data: [
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95], // 14th
                        [100, 100, 60, 95],
                        [100, 100, 60, 95],
                        [100, 100, 60, 95], // %D
                        [100, 100, 60, 95]
                    ]
                }, {
                    type: 'slowstochastic',
                    yAxis: 1,
                    linkedTo: 'main'
                }]
            }),
            series = chart.series,
            periods = series[1].options.params.periods;

        assert.strictEqual(
            series[1].points.length,
            series[0].points.length - periods[0] - 1,
            'Initial number of Slow Stochastic points is correct'
        );

        assert.deepEqual(
            series[1].yData,
            [
                [87.5, null], // FAST %D/SLOW %K
                [87.5, null], // FAST %D/SLOW %K
                [87.5, 87.5]  // SLOW %D (period=3)
            ],
            'Correctly calculated points for Slow Stochastic'
        );

        series[0].addPoint([100, 100, 60, 95]);

        assert.strictEqual(
            series[1].points.length,
            series[0].points.length - periods[0] - 1,
            'After addPoint number of Slow Stochastic points is correct'
        );
    }
);
