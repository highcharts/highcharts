QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
            series: [{
                id: 'main',
                data: [
                    13, 14, 15, 13, 14, 15,
                    13, 14, 15, 13, 14, 15,
                    13, 14, 15, 13, 14, 15,
                    13, 14, 15, 13, 14, 15,
                    13, 14, 15, 13, 14, 15
                ]
            }, {
                type: 'sma',
                linkedTo: 'main'
            }]
        }),
        pointsValue = [],
        secondChart,
        secondSeries;

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'Initial number of SMA points is correct'
    );

    chart.series[0].addPoint(13);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
        'After addPoint number of SMA points is correct'
    );

    chart.series[0].setData([11, 12, 13, 14, 15, 16, 17], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 5
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [13, 14, 15],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    chart.series[0].points[6].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [13, 14],
        'Correct values after point.remove()'
    );

    chart.series[0].addPoint([6, 13], true, true);

    assert.strictEqual(
        chart.series[1].points[chart.series[1].points.length - 1].x,
        chart.series[0].points[chart.series[0].points.length - 1].x,
        'Correct last point position after addPoint() with shift parameter (#8572)'
    );

    secondSeries = chart.addSeries({
        id: 'second',
        showInNavigator: true,
        cropThreshold: 2,
        pointStart: 1,
        data: [
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15,
            13, 14, 15, 13, 14, 15
        ]
    });

    chart.addSeries({
        type: 'sma',
        linkedTo: 'second'
    });

    chart.xAxis[0].setExtremes(25, 30);

    secondSeries.points[secondSeries.points.length - 1].update(100);

    assert.ok(
        'No errors after updating point in a cropped dataset (#8968)'
    );

    secondChart = Highcharts.stockChart('container', {
        xAxis: {
            minRange: 1
        },
        series: [{
            id: 'aapl',
            pointStart: 1486166400000,
            pointInterval: 24 * 3600 * 1000,
            data: [
                221.85,
                220.95,
                218.01,
                224.94,
                223.52,
                225.75,
                222.15,
                217.79,
                218.5,
                220.91
            ]
        }, {
            type: 'sma',
            linkedTo: 'aapl',
            params: {
                period: 5
            }
        }]
    });

    // Update issues with cropped data (#8572, #9493)
    secondChart.series[0].setData([
        211.85,
        215.95,
        212.01,
        211.94,
        210.52,
        213.75,
        212.15,
        212.79,
        218.5,
        214.91,
        215.01,
        211.78
    ]);

    secondChart.series[1].points.forEach(function (point) {
        pointsValue.push(point.y);
    });

    assert.deepEqual(
        pointsValue,
        secondChart.series[1].processedYData,
        'Correct points after setData() (#9493)'
    );

    pointsValue.length = 0;
    secondChart.xAxis[0].setExtremes(1486771200000, 1487116800000);

    secondChart.series[0].update({
        data: [
            211.85,
            215.95,
            212.01,
            211.94,
            210.52,
            213.75,
            212.15,
            212.79,
            218.5,
            214.91,
            223.01, // changed value
            211.78
        ]
    });

    secondChart.series[1].points.forEach(function (point) {
        pointsValue.push(point.y);
    });

    assert.deepEqual(
        pointsValue,
        [
            212.074,
            212.23000000000002,
            213.542,
            214.42000000000002,
            216.27200000000002,
            216.19800000000004
        ],
        'Correct points after update with cropped data - simulated draggable points (#9822)'
    );

    secondChart.series[0].addPoint(212.92, true, true);

    assert.strictEqual(
        secondChart.series[1].points[0].x,
        secondChart.series[1].processedXData[0],
        'Correct first point position after addPoint() with shift parameter and cropped data (#8572)'
    );

    assert.strictEqual(
        secondChart.series[1].points[secondChart.series[1].points.length - 1].x,
        secondChart.series[1].processedXData[secondChart.series[1].processedXData.length - 1],
        'Correct last point position after addPoint() with shift parameter and cropped data (#8572)'
    );
});
