
QUnit.test('Test Stochastic calculations on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '48%'
        }, {
            height: '48%',
            top: '52%'
        }],
        series: [{
            id: 'main',
            type: 'candlestick',
            data: [
                [0, 5, 6, 3, 4],
                [1, 5, 6, 3, 4],
                [2, 5, 6, 3, 4],
                [3, 5, 6, 3, 4]
            ]
        }, {
            type: 'stochastic',
            yAxis: 1,
            linkedTo: 'main',
            params: {
                periods: [3, 3]
            }
        }]
    });

    function toFastStochasticWithRound(arr, index) {
        return Highcharts.map(arr, function (point) {
            return point[index] ? parseFloat(point[index].toFixed(5)) : point[index];
        });
    }

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.periods[0] - 1,
        'Initial number of Stochastic points is correct'
    );

    chart.series[0].addPoint([4, 17, 18, 10, 17]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.periods[0] - 1,
        'After addPoint number of Stochastic points is correct'
    );

    chart.series[0].setData([
        [0, 126, 127.00900, 125.35740, 126],
        [1, 127, 127.61590, 126.16330, 127],
        [2, 126, 126.59110, 124.92960, 126],
        [3, 127, 127.34720, 126.09370, 127],
        [4, 128, 128.17300, 126.81990, 128],
        [5, 128, 128.43170, 126.48170, 128],
        [6, 127, 127.36710, 126.03400, 127],
        [7, 126, 126.42200, 124.83010, 126],
        [8, 126, 126.89950, 126.39210, 126],
        [9, 126, 126.84980, 125.71560, 126],
        [10, 125, 125.64600, 124.56150, 125],
        [11, 125, 125.71560, 124.57150, 125],
        [12, 127, 127.15820, 125.06890, 127],
        [13, 127, 127.71540, 126.85970, 127.28760],
        [14, 127, 127.68550, 126.63090, 127.17810],
        [15, 128, 128.22280, 126.80010, 128.01380],
        [16, 128, 128.27250, 126.71050, 127.10850],
        [17, 128, 128.09340, 126.80010, 127.72530],
        [18, 128, 128.27250, 126.13350, 127.05870],
        [19, 127, 127.73530, 125.92450, 127.32730],
        [20, 128, 128.77000, 126.98910, 128.71030],
        [21, 129, 129.28730, 127.81480, 127.87450],
        [22, 130, 130.06330, 128.47150, 128.58090],
        [23, 129, 129.11820, 128.06410, 128.60080],
        [24, 129, 129.28730, 127.60590, 127.93420],
        [25, 128, 128.47150, 127.59600, 128.11330],
        [26, 128, 128.09340, 126.99900, 127.59600],
        [27, 128, 128.65060, 126.89950, 127.59600],
        [28, 129, 129.13810, 127.48650, 128.69040],
        [29, 128, 128.64060, 127.39700, 128.27250]
    ], false);

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
            64.52380,
            74.52978,
            98.58144,
            70.10453,
            73.05609,
            73.41779,
            61.23129,
            60.95627,
            40.38610,
            40.38610,
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
            64.52380,
            74.52978,
            98.58144,
            70.10453,
            73.05609,
            73.41779,
            61.23129,
            60.95627,
            40.38610,
            40.38610,
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
