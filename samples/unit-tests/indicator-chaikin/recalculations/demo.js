QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '30%'
        }, {
            top: '40%',
            height: '20%'
        }, {
            top: '80%',
            height: '20%'
        }],
        series: [{
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
        }, {
            yAxis: 1,
            name: 'Volume',
            id: 'volume',
            type: 'column',
            data: [
                [1474378200000, 7849],
                [1474464600000, 11692],
                [1474551000000, 10575],
                [1474637400000, 13059],
                [1474896600000, 20734],
                [1474983000000, 11234],
                [1475069400000, 34342],
                [1475155800000, 11223],
                [1475242200000, 12345],
                [1475501400000, 42112],
                [1475587800000, 10332]
            ]
        }, {
            type: 'chaikin',
            linkedTo: 'main',
            yAxis: 2,
            params: {
                period: 0,
                volumeSeriesID: 'volume',
                periods: [3, 7]
            }
        }]
    });

    var mainSeries = chart.series[0],
        volumeSeries = chart.series[1],
        chaikinSeries = chart.series[2];

    function toFastChaikinWithRound(arr) {
        return Highcharts.map(arr, function (point) {
            return parseFloat(point.toFixed(4));
        });
    }

    assert.strictEqual(
        mainSeries.points.length,
        chaikinSeries.points.length + chaikinSeries.options.params.periods[1] - 1,
        'Initial number of Chaikin points is correct'
    );

    mainSeries.addPoint([112.06, 113.31, 112.43, 112.95], false);
    volumeSeries.addPoint(21333);

    assert.strictEqual(
        mainSeries.points.length,
        chaikinSeries.points.length + chaikinSeries.options.params.periods[1] - 1,
        'After addPoint number of Chaikin points is correct'
    );

    mainSeries.setData([
        [1133391600000, 81.22, 80.92, 81.78, 81.59],
        [1133478000000, 80.99, 80.76, 81.22, 81.06],
        [1133564400000, 81.11, 81.01, 82.87, 82.87],
        [1133650800000, 82.22, 81.97, 83.12, 83.00],
        [1133910000000, 83.22, 83.01, 83.78, 83.61],
        [1133996400000, 82.99, 82.57, 83.66, 83.15],
        [1134082800000, 83.11, 82.11, 84.01, 82.84],
        [1134169200000, 84.05, 83.88, 84.10, 83.99],
        [1134255600000, 84.33, 84.04, 85.01, 84.55],
        [1134514800000, 84.22, 84.03, 84.78, 84.36],
        [1134601200000, 84.78, 84.22, 85.74, 85.53],
        [1134687600000, 86.01, 85.79, 86.81, 86.54],
        [1134774000000, 86.44, 86.09, 87.01, 86.89],
        [1134860400000, 86.99, 86.87, 87.98, 87.77],
        [1135119600000, 86.78, 86.57, 87.34, 87.29]
    ], false);

    volumeSeries.setData([
        [1133391600000, 7849],
        [1133478000000, 11692],
        [1133564400000, 10575],
        [1133650800000, 13059],
        [1133910000000, 20734],
        [1133996400000, 11234],
        [1134082800000, 34342],
        [1134169200000, 11223],
        [1134255600000, 12345],
        [1134514800000, 22112],
        [1134601200000, 10332],
        [1134687600000, 17881],
        [1134774000000, 12233],
        [1134860400000, 31009],
        [1135119600000, 21911]
    ], true);

    assert.strictEqual(
        mainSeries.points.length,
        chaikinSeries.points.length + chaikinSeries.options.params.periods[1] - 1,
        'After setData number of Chaikin points is correct'
    );

    chaikinSeries.update({
        color: '#555',
        params: {
            index: 3,
            periods: [2, 5]
        }
    });

    assert.deepEqual(
        toFastChaikinWithRound(chaikinSeries.yData),
        [
            -14939.5329,
            -12021.9458,
            -6051.0882,
            -3379.5447,
            -2246.9718,
            -611.4819,
            -2604.5232,
            -5273.5011,
            -7708.6457,
            -12962.0449,
            -17604.1510
        ],
        'Correct values'
    );

    assert.strictEqual(
        chaikinSeries.graph.attr('stroke'),
        '#555',
        'Line color changed'
    );

    mainSeries.points[mainSeries.points.length - 1].remove();
    volumeSeries.points[volumeSeries.points.length - 1].remove();

    assert.deepEqual(
        toFastChaikinWithRound(chaikinSeries.yData),
        [
            -14939.5329,
            -12021.9458,
            -6051.0882,
            -3379.5447,
            -2246.9718,
            -611.4819,
            -2604.5232,
            -5273.5011,
            -7708.6457,
            -12962.0449
        ],
        'Correct values after point.remove()'
    );
});
