QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [
                {
                    id: 'main',
                    data: [
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15,
                        13,
                        14,
                        15
                    ]
                },
                {
                    type: 'sma',
                    linkedTo: 'main'
                }
            ],
            scrollbar: {
                buttonsEnabled: true,
                height: 14
            }
        }),
        pointsValue = [],
        secondChart,
        secondSeries;

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.period -
            1,
        'Initial number of SMA points is correct'
    );

    chart.series[0].addPoint(13);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.period -
            1,
        'After addPoint number of SMA points is correct'
    );

    chart.series[0].setData([11, 12, 13, 14, 15, 16, 17], false);
    chart.series[1].update({
        color: 'red',
        params: {
            period: 5
        }
    });

    assert.deepEqual(chart.series[1].yData, [13, 14, 15], 'Correct values');

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
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15,
            13,
            14,
            15
        ]
    });

    chart.addSeries({
        type: 'sma',
        linkedTo: 'second'
    });

    chart.xAxis[0].setExtremes(25, 30);

    secondSeries.points[secondSeries.points.length - 1].update(100);

    assert.ok('No errors after updating point in a cropped dataset (#8968)');

    chart.xAxis[0].setExtremes(0, 30);
    const yBefore = chart.series[1].points[0].y;

    chart.series[1].update(
        { name: 'TEST', dataGrouping: { } },
        false
    );

    chart.series[0].update(
        {
            type: 'ohlc',
            data: [
                [20, 30, 10, 125],
                [20, 30, 10, 123],
                [20, 30, 10, 121],
                [20, 30, 10, 125],
                [20, 30, 10, 126],
                [20, 30, 10, 123],
                [20, 30, 10, 127],
                [20, 30, 10, 122],
                [20, 30, 10, 122],
                [20, 30, 10, 123],
                [20, 30, 10, 125],
                [20, 30, 10, 126]
            ]
        },
        false
    );

    assert.ok(
        true,
        '#16670: Update without redraw should not throw errors.'
    );

    chart.redraw();

    assert.notStrictEqual(
        chart.series[1].points[0].y,
        yBefore,
        '#15383: SMA indicator should have recalculated'
    );

    secondChart = Highcharts.stockChart('container', {
        xAxis: {
            minRange: 1
        },
        scrollbar: {
            buttonsEnabled: true,
            height: 14
        },
        rangeSelector: {
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1h',
                dataGrouping: {
                    units: [
                        ['hour', [1]]
                    ]
                }
            }]
        },
        series: [
            {
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
            },
            {
                type: 'sma',
                linkedTo: 'aapl',
                params: {
                    period: 5
                }
            }
        ]
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
        secondChart.series[1].processedXData[
            secondChart.series[1].processedXData.length - 1
        ],
        'Correct last point position after addPoint() with shift parameter and cropped data (#8572)'
    );

    const lineSeriesPoints = secondChart.series[2].points;

    secondChart.addSeries({
        id: 'volume',
        data: [
            [lineSeriesPoints[0].x, 1500],
            [lineSeriesPoints[1].x, 2000]
        ]
    });

    secondChart.addSeries({
        linkedTo: 'aapl',
        type: 'obv',
        params: {
            volumeSeriesID: 'volume'
        },
        yAxis: 0
    });

    secondChart.rangeSelector.clickButton(0);

    assert.ok(
        true,
        'No volumeSeriesID error when cliked rangeSelector button, #18643'
    );
});

QUnit.test('Order of series and indicators, #15892.', function (assert) {
    const chart = Highcharts.stockChart('container', {
        navigator: {
            enabled: false
        },
        scrollbar: {
            buttonsEnabled: true,
            height: 14
        },
        series: [{
            type: 'sma',
            id: 'sma',
            linkedTo: 'main',
            params: {
                period: 4
            }
        }, {
            id: 'main',
            data: [13, 14, 15, 13, 14, 15, 13, 14, 15]
        }]
    });

    assert.strictEqual(
        chart.series.length,
        2, // main, sma
        `When an indicator is declared before the main series,
        both should be initialized.`
    );
    assert.ok(
        chart.series[0].processedXData.length,
        `When an indicator is declared before the main series,
        indicator data should be procesed.`
    );

    chart.addSeries({
        type: 'sma',
        linkedTo: 'sma',
        params: {
            period: 4
        }
    });

    chart.series[1].addPoint(16);

    assert.strictEqual(
        chart.series[2].points.length,
        chart.series[0].points.length -
            chart.series[2].options.params.period + 1,
        `Indicator linked to another indicator should be recalculated after
        adding a point to the main series #17190.`
    );

    chart.series[1].addPoint(5);
    chart.series[1].addPoint(10);

    assert.strictEqual(
        chart.series[2].points.length,
        6,
        `After adding two points to the main series, indicator linked to another
        indicator should also update its data #18689.`
    );
});