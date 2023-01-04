QUnit.test(
    'Test Percentage Price Oscillator calculations on data updates.',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            yAxis: [
                {
                    height: '48%'
                },
                {
                    height: '48%',
                    top: '52%'
                }
            ],
            series: [
                {
                    id: 'main',
                    type: 'ohlc',
                    data: [
                        [1474378200000, 113.05, 114.12, 112.51, 113.57],
                        [1474464600000, 113.85, 113.99, 112.44, 113.55],
                        [1474551000000, 114.35, 114.94, 114, 114.62],
                        [1474637400000, 114.42, 114.79, 111.55, 112.71],
                        [1474896600000, 111.64, 113.39, 111.55, 112.88],
                        [1474983000000, 113, 113.18, 112.34, 113.09],
                        [1475069400000, 113.69, 114.64, 113.43, 113.95],
                        [1475155800000, 113.16, 113.8, 111.8, 112.18],
                        [1475242200000, 112.46, 113.37, 111.8, 113.05],
                        [1475501400000, 112.71, 113.05, 112.28, 112.52],
                        [1475587800000, 113.06, 114.31, 112.63, 113]
                    ]
                },
                {
                    yAxis: 1,
                    type: 'ppo',
                    linkedTo: 'main',
                    color: '#cc5555',
                    lineWidth: 1,
                    params: {
                        index: 3,
                        periods: [3, 8]
                    }
                }
            ]
        });

        function toFastPPOWithRound(arr) {
            return arr.map(point => parseFloat(point.toFixed(4)));
        }

        assert.strictEqual(
            chart.series[0].points.length,
            chart.series[1].points.length +
                chart.series[1].options.params.periods[1] -
                1,
            'Initial number of Percentage Price Oscillator points is correct'
        );

        chart.series[0].addPoint([
            1475617400000,
            112.06,
            113.31,
            112.43,
            112.95
        ]);

        assert.strictEqual(
            chart.series[0].points.length,
            chart.series[1].points.length +
                chart.series[1].options.params.periods[1] -
                1,
            'After addPoint number of Percentage Price Oscillator points is correct'
        );

        chart.series[0].setData(
            [
                [1133391600000, 81.22, 80.92, 81.78, 81.59],
                [1133478000000, 80.99, 80.76, 81.22, 81.06],
                [1133564400000, 81.11, 81.01, 82.87, 82.87],
                [1133650800000, 82.22, 81.97, 83.12, 83.0],
                [1133910000000, 83.22, 83.01, 83.78, 83.61],
                [1133996400000, 82.99, 82.57, 83.66, 83.15],
                [1134082800000, 83.11, 82.11, 84.01, 82.84],
                [1134169200000, 84.05, 83.88, 84.1, 83.99],
                [1134255600000, 84.33, 84.04, 85.01, 84.55],
                [1134514800000, 84.22, 84.03, 84.78, 84.36],
                [1134601200000, 84.78, 84.22, 85.74, 85.53],
                [1134687600000, 86.01, 85.79, 86.81, 86.54],
                [1134774000000, 86.44, 86.09, 87.01, 86.89],
                [1134860400000, 86.99, 86.87, 87.98, 87.77],
                [1135119600000, 86.78, 86.57, 87.34, 87.29]
            ],
            true
        );

        assert.strictEqual(
            chart.series[0].data.length,
            chart.series[1].data.length +
                chart.series[1].options.params.periods[1] -
                1,
            'After setData number of Percentage Price Oscillator points is correct'
        );

        chart.series[1].update({
            color: '#001e84',
            params: {
                index: 3,
                periods: [2, 5]
            }
        });

        assert.deepEqual(
            toFastPPOWithRound(chart.series[1].yData),
            [
                1.1028,
                0.6585,
                0.2889,
                0.603,
                0.7594,
                0.5487,
                0.84,
                1.1083,
                1.053,
                1.1415,
                0.7217
            ],
            'Correct values'
        );

        assert.strictEqual(
            chart.series[1].graph.attr('stroke'),
            '#001e84',
            'Line color changed'
        );

        chart.series[0].points[chart.series[0].points.length - 1].remove();

        assert.deepEqual(
            toFastPPOWithRound(chart.series[1].yData),
            [
                1.1028,
                0.6585,
                0.2889,
                0.603,
                0.7594,
                0.5487,
                0.84,
                1.1083,
                1.053,
                1.1415
            ],
            'Correct values after point.remove()'
        );
    }
);
