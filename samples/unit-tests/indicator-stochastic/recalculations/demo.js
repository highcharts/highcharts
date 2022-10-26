QUnit.test('Test Stochastic calculations on data updates.', function (assert) {
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
                type: 'candlestick',
                data: [
                    [0, 5, 6, 3, 4],
                    [1, 5, 6, 3, 4],
                    [2, 5, 6, 3, 4],
                    [3, 5, 6, 3, 4]
                ]
            },
            {
                type: 'stochastic',
                yAxis: 1,
                linkedTo: 'main',
                params: {
                    periods: [3, 3]
                }
            }
        ]
    });

    function toFastStochasticWithRound(arr, index) {
        return arr.map(point =>
            (point[index] ? parseFloat(point[index].toFixed(5)) : point[index])
        );
    }

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.periods[0] -
            1,
        'Initial number of Stochastic points is correct'
    );

    chart.series[0].addPoint([4, 17, 18, 10, 17]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.periods[0] -
            1,
        'After addPoint number of Stochastic points is correct'
    );

    chart.series[0].setData(
        [
            [0, 126, 127.009, 125.3574, 126],
            [1, 127, 127.6159, 126.1633, 127],
            [2, 126, 126.5911, 124.9296, 126],
            [3, 127, 127.3472, 126.0937, 127],
            [4, 128, 128.173, 126.8199, 128],
            [5, 128, 128.4317, 126.4817, 128],
            [6, 127, 127.3671, 126.034, 127],
            [7, 126, 126.422, 124.8301, 126],
            [8, 126, 126.8995, 126.3921, 126],
            [9, 126, 126.8498, 125.7156, 126],
            [10, 125, 125.646, 124.5615, 125],
            [11, 125, 125.7156, 124.5715, 125],
            [12, 127, 127.1582, 125.0689, 127],
            [13, 127, 127.7154, 126.8597, 127.2876],
            [14, 127, 127.6855, 126.6309, 127.1781],
            [15, 128, 128.2228, 126.8001, 128.0138],
            [16, 128, 128.2725, 126.7105, 127.1085],
            [17, 128, 128.0934, 126.8001, 127.7253],
            [18, 128, 128.2725, 126.1335, 127.0587],
            [19, 127, 127.7353, 125.9245, 127.3273],
            [20, 128, 128.77, 126.9891, 128.7103],
            [21, 129, 129.2873, 127.8148, 127.8745],
            [22, 130, 130.0633, 128.4715, 128.5809],
            [23, 129, 129.1182, 128.0641, 128.6008],
            [24, 129, 129.2873, 127.6059, 127.9342],
            [25, 128, 128.4715, 127.596, 128.1133],
            [26, 128, 128.0934, 126.999, 127.596],
            [27, 128, 128.6506, 126.8995, 127.596],
            [28, 129, 129.1381, 127.4865, 128.6904],
            [29, 128, 128.6406, 127.397, 128.2725]
        ],
        false
    );

    chart.series[1].update({
        color: 'red',
        smoothedLine: {
            styles: {
                lineColor: 'red'
            }
        },
        params: {
            periods: [14, 3]
        }
    });

    assert.deepEqual(
        toFastStochasticWithRound(chart.series[1].yData, 0),
        [
            70.43822,
            67.60891,
            89.20211,
            65.81055,
            81.74771,
            64.5238,
            74.52978,
            98.58144,
            70.10453,
            73.05609,
            73.41779,
            61.23129,
            60.95627,
            40.3861,
            40.3861,
            66.82855,
            56.73142
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );
    chart.series[0].points[chart.series[0].points.length - 1].remove();

    assert.deepEqual(
        toFastStochasticWithRound(chart.series[1].yData, 0),
        [
            70.43822,
            67.60891,
            89.20211,
            65.81055,
            81.74771,
            64.5238,
            74.52978,
            98.58144,
            70.10453,
            73.05609,
            73.41779,
            61.23129,
            60.95627,
            40.3861,
            40.3861,
            66.82855
        ],
        'Correct values after point.remove()'
    );

    assert.deepEqual(
        toFastStochasticWithRound(chart.series[1].yData, 1),
        [
            null,
            null,
            75.74975,
            74.20719,
            78.92012,
            70.69402,
            73.60043,
            79.21167,
            81.07192,
            80.58069,
            72.1928,
            69.23506,
            65.20178,
            54.19122,
            47.24283,
            49.20025
        ],
        'Correct %D values.'
    );
});
