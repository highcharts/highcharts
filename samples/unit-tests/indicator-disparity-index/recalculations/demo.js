QUnit.test(
    'Testing Desparity Index indicator (values, params and updates), #15139.',
    assert => {
        const chart = Highcharts.stockChart('container', {
                yAxis: [{
                    height: '60%'
                }, {
                    height: '40%',
                    top: '60%'
                }],
                series: [{
                    id: 'main',
                    type: 'ohlc',
                    data: [
                        [1552311000000, 43.87, 44.78, 43.84, 44.72],
                        [1552397400000, 45.00, 45.67, 44.84, 45.23],
                        [1552483800000, 45.56, 45.83, 45.23, 45.43],
                        [1552570200000, 45.97, 46.03, 45.64, 45.93],
                        [1552656600000, 46.21, 46.83, 45.94, 46.53],
                        [1552915800000, 46.45, 47.1, 46.45, 47.01],
                        [1553002200000, 47.09, 47.25, 46.48, 46.63],
                        [1553088600000, 46.56, 47.37, 46.18, 47.04],
                        [1553175000000, 47.51, 49.08, 47.45, 48.77],
                        [1553261400000, 48.83, 49.42, 47.69, 47.76],
                        [1553520600000, 47.88, 47.99, 46.65, 47.19],
                        [1553607000000, 47.92, 48.22, 46.15, 46.7],
                        [1553693400000, 47.19, 47.44, 46.64, 47.12],
                        [1553779800000, 47.24, 47.39, 46.88, 47.18],
                        [1553866200000, 47.46, 47.52, 47.13, 47.49],
                        [1554125400000, 47.91, 47.92, 47.1, 47.81],
                        [1554211800000, 47.77, 48.62, 47.76, 48.51],
                        [1554298200000, 48.31, 49.13, 48.29, 48.84],
                        [1554384600000, 48.7, 49.09, 48.28, 48.92],
                        [1554471000000, 49.11, 49.28, 48.98, 49.25],
                        [1554730200000, 49.1, 50.06, 49.08, 50.03],
                        [1554816600000, 50.08, 50.71, 49.81, 49.88],
                        [1554903000000, 49.67, 50.19, 49.54, 50.15],
                        [1554989400000, 50.21, 50.25, 49.61, 49.74],
                        [1555075800000, 49.8, 50.03, 49.05, 49.72]
                    ]
                }, {
                    type: 'disparityindex',
                    linkedTo: 'main',
                    yAxis: 1
                }]
            }),
            baseSeries = chart.series[0],
            disparityIndexIndicator = chart.series[1];

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            disparityIndexIndicator.options.params.period - 1,
            `The number of the initial Disparity Index points should
            be equal to the number of the main series' points plus period - 1.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                1.1144449207029574,
                1.3490648008414567,
                1.6322750117675797,
                2.6402889657985704,
                2.8860332841794816,
                2.6852781984196885,
                3.0319331749375835,
                4.1346396871887725,
                3.3858908875563842,
                3.7335815492812077,
                2.5854068148671345,
                2.163383919922417
            ],
            'The Disparity Index values should be correct.'
        );

        baseSeries.addPoint([1555335000000, 49.65, 49.96, 49.5, 49.81]);

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            disparityIndexIndicator.options.params.period - 1,
            `After addPoint: the number of Disparity Index points should
            be equal to the number of the main series' points plus period - 1.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                1.1144449207029574,
                1.3490648008414567,
                1.6322750117675797,
                2.6402889657985704,
                2.8860332841794816,
                2.6852781984196885,
                3.0319331749375835,
                4.1346396871887725,
                3.3858908875563842,
                3.7335815492812077,
                2.5854068148671345,
                2.163383919922417,
                1.8832639345459739
            ],
            'After addPoint: the Disparity Index values should be correct.'
        );

        baseSeries.setData([
            [0, 5, 30.1983, 29.4072, 29.8720],
            [1, 5, 30.2776, 29.3182, 30.2381],
            [2, 5, 30.4458, 29.9611, 30.0996],
            [3, 5, 29.3478, 28.7443, 28.9028],
            [4, 5, 29.3477, 28.5566, 28.9225],
            [5, 5, 29.2886, 28.4081, 28.4775],
            [6, 5, 28.8334, 28.0818, 28.5566],
            [7, 5, 28.7346, 27.4289, 27.5576],
            [8, 5, 28.6654, 27.6565, 28.4675],
            [9, 5, 28.8532, 27.8345, 28.2796],
            [10, 5, 28.6356, 27.3992, 27.4882],
            [11, 5, 27.6761, 27.0927, 27.2310],
            [12, 5, 27.2112, 26.1826, 26.3507],
            [13, 5, 26.8651, 26.1332, 26.3309],
            [14, 5, 27.4090, 26.6277, 27.0333],
            [15, 5, 26.9441, 26.1332, 26.2221],
            [16, 5, 26.5189, 25.4307, 26.0144],
            [17, 5, 26.5189, 25.3518, 25.4605],
            [18, 5, 27.0927, 25.8760, 27.0333],
            [19, 5, 27.6860, 26.9640, 27.4487]
        ]);

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            disparityIndexIndicator.options.params.period - 1,
            `After setData: the number of Disparity Index points should be equal
            to the number of the main series' points plus period - 1.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                -7.092691921307613,
                -3.9269586752566594,
                -5.8500476636354275,
                -5.606831111872415,
                -6.785019785958244,
                -0.5353437237847145,
                1.2668575271480607
            ],
            'After setData: the Disparity Index values should be correct.'
        );


        disparityIndexIndicator.update({
            params: {
                period: 9,
                average: 'dema'
            }
        });

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            2 * disparityIndexIndicator.options.params.period - 2,
            `After period and average type update: the number of
            Disparity Index points should be equal to the number
            of the main series' points plus doubled period - 2.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                0.1254026201375433,
                -0.6706594647717171,
                4.10189870982814,
                4.070431440521995
            ],
            'After period update: the Disparity Index values should be correct.'
        );

        baseSeries.points[baseSeries.points.length - 1].remove();

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            2 * disparityIndexIndicator.options.params.period - 2,
            `After point remove: the number of Disparity Index points
            should be equal to the number of the main series' points
            plus doubled period - 2.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                0.1254026201375433,
                -0.6706594647717171,
                4.10189870982814
            ],
            'After point remove: the Disparity Index values should be correct.'
        );

        disparityIndexIndicator.update({
            params: {
                index: 2
            }
        });

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                -0.9115961290560005,
                -0.1503205703016479,
                1.8686054467028232
            ],
            `After params.index update:
            the Disparity Index values should be correct.`
        );

        baseSeries.update({
            type: 'line',
            data: [4, 2, 3, 5, 7, 4, 6, 4, 5, 4]
        }, false);

        disparityIndexIndicator.update({
            params: {
                period: 3
            }
        });

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            2 * disparityIndexIndicator.options.params.period - 2,
            `After setData: the number of Disparity Index points should be equal
            to the number of the main series' points plus doubled period - 2.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                2.439024390244402,
                -20.661157024793912,
                2.8571428571434447,
                -12.528473804100868,
                2.783725910064944,
                -5.243676742752136
            ],
            `After setting one dimension data:
            the Disparity Index values should be correct.`
        );

        disparityIndexIndicator.update({
            params: {
                average: 'tema'
            }
        });

        assert.strictEqual(
            baseSeries.points.length,
            disparityIndexIndicator.points.length +
            3 * disparityIndexIndicator.options.params.period - 3,
            `After average type update: the number of Disparity Index points
            should be equal to the number of the main series' points
            trippled doubled period - 3.`
        );

        assert.deepEqual(
            disparityIndexIndicator.yData,
            [
                1.886792452831727,
                -7.283702213281587,
                4.102656786555333,
                -1.9574468085127743
            ],
            `After setting one dimension data:
            the Disparity Index values should be correct.`
        );
    });
