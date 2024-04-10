QUnit.test('Test PSAR calculations on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
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
                type: 'psar',
                linkedTo: 'main',
                params: {
                    index: 2,
                    decimals: 6
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.index,
        'Initial number of PSAR points is correct'
    );

    chart.series[0].addPoint([4, 17, 18, 10, 17]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.index,
        'After addPoint number of PSAR points is correct'
    );

    chart.series[0].setData(
        [
            [Date.UTC(1983, 8, 13), 10.3, 10.33, 10.11, 10.16],
            [Date.UTC(1983, 8, 14), 9.95, 9.98, 9.76, 9.8],
            [Date.UTC(1983, 8, 15), 9.75, 9.83, 9.64, 9.76],
            [Date.UTC(1983, 8, 16), 9.55, 9.6, 9.35, 9.41],
            [Date.UTC(1983, 8, 19), 9.55, 9.85, 9.51, 9.85],
            [Date.UTC(1983, 8, 20), 9.77, 9.8, 9.25, 9.33],
            [Date.UTC(1983, 8, 21), 9.09, 9.19, 9.0, 9.06],
            [Date.UTC(1983, 8, 22), 9.16, 9.41, 9.16, 9.4],
            [Date.UTC(1983, 8, 23), 9.4, 9.47, 9.08, 9.22],
            [Date.UTC(1983, 8, 26), 8.95, 9.32, 8.95, 9.31],
            [Date.UTC(1983, 8, 27), 9.64, 9.94, 9.55, 9.76],
            [Date.UTC(1983, 8, 28), 9.83, 10.23, 9.83, 10.0],
            [Date.UTC(1983, 8, 29), 10.0, 10.11, 9.56, 9.59],
            [Date.UTC(1983, 8, 30), 9.46, 10.5, 9.46, 10.4],
            [Date.UTC(1983, 9, 3), 10.88, 11.25, 10.82, 11.23],
            [Date.UTC(1983, 9, 4), 11.3, 11.57, 11.3, 11.44],
            [Date.UTC(1983, 9, 5), 11.49, 11.55, 11.21, 11.44],
            [Date.UTC(1983, 9, 6), 11.42, 11.8, 11.29, 11.78],
            [Date.UTC(1983, 9, 7), 11.78, 11.9, 11.67, 11.88],
            [Date.UTC(1983, 9, 10), 11.85, 11.94, 11.62, 11.67],
            [Date.UTC(1983, 9, 11), 11.5, 11.59, 11.32, 11.33],
            [Date.UTC(1983, 9, 12), 11.22, 11.43, 11.05, 11.05],
            [Date.UTC(1983, 9, 13), 10.95, 11.23, 10.87, 11.09],
            [Date.UTC(1983, 9, 14), 11.22, 11.37, 11.11, 11.35],
            [Date.UTC(1983, 9, 17), 11.2, 11.34, 11.12, 11.27],
            [Date.UTC(1983, 9, 18), 11.08, 11.27, 10.96, 11.0],
            [Date.UTC(1983, 9, 19), 10.86, 10.94, 10.75, 10.76],
            [Date.UTC(1983, 9, 20), 10.68, 10.76, 10.53, 10.54],
            [Date.UTC(1983, 9, 21), 10.62, 10.69, 10.55, 10.68],
            [Date.UTC(1983, 9, 24), 10.66, 10.78, 10.05, 10.09],
            [Date.UTC(1983, 9, 25), 9.95, 10.02, 9.77, 9.89],
            [Date.UTC(1983, 9, 26), 9.95, 10.06, 9.82, 10.04],
            [Date.UTC(1983, 9, 27), 9.75, 9.8, 9.48, 9.63],
            [Date.UTC(1983, 9, 28), 9.68, 9.75, 9.64, 9.66],
            [Date.UTC(1983, 9, 31), 9.42, 9.5, 9.33, 9.36],
            [Date.UTC(1983, 10, 1), 9.28, 9.39, 9.13, 9.37],
            [Date.UTC(1983, 10, 2), 9.4, 9.54, 9.06, 9.1],
            [Date.UTC(1983, 10, 3), 8.97, 9.45, 8.97, 9.43],
            [Date.UTC(1983, 10, 4), 9.37, 9.65, 9.27, 9.52],
            [Date.UTC(1983, 10, 7), 9.78, 9.96, 9.76, 9.81],
            [Date.UTC(1983, 10, 8), 9.96, 10.02, 9.87, 9.91],
            [Date.UTC(1983, 10, 9), 9.65, 9.82, 9.62, 9.76],
            [Date.UTC(1983, 10, 10), 9.66, 10.08, 9.66, 9.96],
            [Date.UTC(1983, 10, 11), 9.98, 10.04, 9.25, 9.26],
            [Date.UTC(1983, 10, 14), 9.13, 9.4, 9.13, 9.4],
            [Date.UTC(1983, 10, 15), 9.3, 9.47, 9.2, 9.22],
            [Date.UTC(1983, 10, 16), 9.19, 9.34, 9.12, 9.2],
            [Date.UTC(1983, 10, 17), 9.05, 9.4, 8.82, 9.37],
            [Date.UTC(1983, 10, 18), 9.32, 9.45, 9.28, 9.35],
            [Date.UTC(1983, 10, 21), 9.27, 10.1, 9.27, 10.08]
        ],
        false
    );

    chart.series[1].update({
        color: 'red',
        params: {
            index: 4,
            decimals: 3
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [
            9.35,
            9.35,
            10.33,
            10.277,
            10.226,
            10.177,
            10.103,
            10.034,
            8.95,
            8.996,
            9.087,
            9.26,
            9.491,
            9.699,
            9.951,
            10.224,
            10.498,
            10.729,
            10.923,
            11.94,
            11.907,
            11.875,
            11.82,
            11.734,
            11.614,
            11.506,
            11.331,
            11.112,
            10.924,
            10.693,
            10.499,
            10.289,
            10.057,
            9.858,
            9.68,
            9.65,
            8.97,
            9.012,
            9.052,
            9.114,
            9.172,
            10.08,
            10.045,
            9.989,
            9.896,
            9.81
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Marker color changed'
    );
    chart.series[0].points[chart.series[0].points.length - 1].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [
            9.35,
            9.35,
            10.33,
            10.277,
            10.226,
            10.177,
            10.103,
            10.034,
            8.95,
            8.996,
            9.087,
            9.26,
            9.491,
            9.699,
            9.951,
            10.224,
            10.498,
            10.729,
            10.923,
            11.94,
            11.907,
            11.875,
            11.82,
            11.734,
            11.614,
            11.506,
            11.331,
            11.112,
            10.924,
            10.693,
            10.499,
            10.289,
            10.057,
            9.858,
            9.68,
            9.65,
            8.97,
            9.012,
            9.052,
            9.114,
            9.172,
            10.08,
            10.045,
            9.989,
            9.896
        ],
        'Correct values after point.remove()'
    );

    Highcharts.Series.types.psar.prototype.getValues(
        {
            xData: [0, 1, 2, 3, 4, 5],
            yData: [
                [10, 15, 5, 10],
                [10, 15, 5, 10],
                [10, 15, 5, 10],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [10, 15, 5, 10],
                [10, 15, 5, 10]
            ]
        },
        Highcharts.getOptions().plotOptions.psar.params
    );
    assert.ok(true, 'No errors when data contains multiple null points.');

    Highcharts.Series.types.psar.prototype.getValues(
        {
            xData: [0],
            yData: [1]
        },
        Highcharts.getOptions().plotOptions.psar.params
    );

    assert.ok(true, 'No error when index is greater than data length (#8376).');
});
