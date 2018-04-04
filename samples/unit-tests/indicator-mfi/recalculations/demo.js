QUnit.test('Test MFI calculations on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '33%'
        }, {
            height: '33%',
            top: '33%'
        }, {
            height: '33%',
            top: '66%'
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
            id: 'volume',
            type: 'column',
            yAxis: 1,
            data: [
                [0, 100000],
                [1, 200000],
                [2, 300000],
                [3, 400000]
            ]
        }, {
            type: 'mfi',
            yAxis: 2,
            linkedTo: 'main',
            params: {
                period: 3,
                decimals: 6
            }
        }]
    });

    // RSI needs 15 points to calculate period=14 etc.
    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[2].points.length + chart.series[2].options.params.period,
        'Initial number of MFI points is correct'
    );

    chart.series[0].addPoint([4, 17, 18, 10, 17]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[2].points.length + chart.series[2].options.params.period,
        'After addPoint number of MFI points is correct'
    );

    chart.series[0].setData([
        [Date.UTC(2010, 11, 3), 24.8000, 24.8283, 24.3205, 24.7486],
        [Date.UTC(2010, 11, 6), 24.8000, 24.7586, 24.5993, 24.7088],
        [Date.UTC(2010, 11, 7), 24.8000, 25.1568, 24.7785, 25.0373],
        [Date.UTC(2010, 11, 08), 24.8000, 25.5848, 24.9477, 25.5450],
        [Date.UTC(2010, 11, 09), 24.8000, 25.6844, 24.8083, 25.0672],
        [Date.UTC(2010, 11, 10), 24.8000, 25.3360, 25.0572, 25.1070],
        [Date.UTC(2010, 11, 13), 24.8000, 25.2862, 24.8482, 24.8880],
        [Date.UTC(2010, 11, 14), 24.8000, 25.1269, 24.7496, 24.9975],
        [Date.UTC(2010, 11, 15), 24.8000, 25.2762, 24.9278, 25.0473],
        [Date.UTC(2010, 11, 16), 24.8000, 25.3857, 25.0274, 25.3360],
        [Date.UTC(2010, 11, 17), 24.8000, 25.5351, 25.0473, 25.0572],
        [Date.UTC(2010, 11, 20), 24.8000, 25.6048, 25.0622, 25.4455],
        [Date.UTC(2010, 11, 21), 24.8000, 25.7441, 25.5351, 25.5649],
        [Date.UTC(2010, 11, 22), 24.8000, 25.7242, 25.4554, 25.5550],
        [Date.UTC(2010, 11, 23), 24.8000, 25.6744, 25.2862, 25.4057],
        [Date.UTC(2010, 11, 27), 24.8000, 25.4455, 25.1667, 25.3658],
        [Date.UTC(2010, 11, 28), 24.8000, 25.3161, 24.9178, 25.0373],
        [Date.UTC(2010, 11, 29), 24.8000, 25.2563, 24.9079, 24.9178],
        [Date.UTC(2010, 11, 30), 24.8000, 25.0373, 24.8283, 24.8780],
        [Date.UTC(2010, 11, 31), 24.8000, 25.0074, 24.7088, 24.9676],
        [Date.UTC(2011, 0, 3), 24.8000, 25.3061, 25.0274, 25.0473],
        [Date.UTC(2011, 0, 4), 24.8000, 25.1170, 24.3404, 24.4500],
        [Date.UTC(2011, 0, 5), 24.8000, 24.6889, 24.2708, 24.5694],
        [Date.UTC(2011, 0, 6), 24.8000, 24.5495, 23.8925, 24.0219],
        [Date.UTC(2011, 0, 7), 24.8000, 24.2708, 23.7780, 23.8825],
        [Date.UTC(2011, 0, 10), 24.8000, 24.2708, 23.7232, 24.2011],
        [Date.UTC(2011, 0, 11), 24.8000, 24.5993, 24.2011, 24.2807],
        [Date.UTC(2011, 0, 12), 24.8000, 24.4798, 24.2409, 24.3305],
        [Date.UTC(2011, 0, 13), 24.8000, 24.5595, 23.4345, 24.4400],
        [Date.UTC(2011, 0, 14), 24.8000, 25.1600, 24.2700, 25.0000]
    ], false);

    chart.series[1].setData([
        [Date.UTC(2010, 11, 3), 18730.144],
        [Date.UTC(2010, 11, 6), 12271.740],
        [Date.UTC(2010, 11, 7), 24691.414],
        [Date.UTC(2010, 11, 8), 18357.606],
        [Date.UTC(2010, 11, 9), 22964.080],
        [Date.UTC(2010, 11, 10), 15918.948],
        [Date.UTC(2010, 11, 13), 16067.044],
        [Date.UTC(2010, 11, 14), 16568.487],
        [Date.UTC(2010, 11, 15), 16018.729],
        [Date.UTC(2010, 11, 16), 9773.569],
        [Date.UTC(2010, 11, 17), 22572.712],
        [Date.UTC(2010, 11, 20), 12986.669],
        [Date.UTC(2010, 11, 21), 10906.659],
        [Date.UTC(2010, 11, 22), 5799.259],
        [Date.UTC(2010, 11, 23), 7395.274],
        [Date.UTC(2010, 11, 27), 5818.162],
        [Date.UTC(2010, 11, 28), 7164.726],
        [Date.UTC(2010, 11, 29), 5672.914],
        [Date.UTC(2010, 11, 30), 5624.742],
        [Date.UTC(2010, 11, 31), 5023.469],
        [Date.UTC(2011, 0, 3), 7457.091],
        [Date.UTC(2011, 0, 4), 11798.009],
        [Date.UTC(2011, 0, 5), 12366.132],
        [Date.UTC(2011, 0, 6), 13294.865],
        [Date.UTC(2011, 0, 7), 9256.870],
        [Date.UTC(2011, 0, 10), 9690.604],
        [Date.UTC(2011, 0, 11), 8870.318],
        [Date.UTC(2011, 0, 12), 7168.965],
        [Date.UTC(2011, 0, 13), 11356.180],
        [Date.UTC(2011, 0, 14), 13379.374]
    ], false);

    chart.series[2].update({
        color: 'red',
        params: {
            period: 14
        }
    });

    assert.deepEqual(
        chart.series[2].yData,
        [
            49.466311,
            45.109745,
            36.272154,
            28.406647,
            31.528057,
            33.868151,
            41.300101,
            42.803371,
            31.830483,
            23.760120,
            26.506181,
            24.072661,
            22.383292,
            22.178746,
            21.534050,
            30.836184
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[2].graph.attr('stroke'),
        'red',
        'Line color changed'
    );
    chart.series[0].points[chart.series[0].points.length - 1].remove();
    chart.series[1].points[chart.series[1].points.length - 1].remove();

    assert.deepEqual(
        chart.series[2].yData,
        [
            49.466311,
            45.109745,
            36.272154,
            28.406647,
            31.528057,
            33.868151,
            41.300101,
            42.803371,
            31.830483,
            23.760120,
            26.506181,
            24.072661,
            22.383292,
            22.178746,
            21.534050
        ],
        'Correct values after point.remove()'
    );
});
