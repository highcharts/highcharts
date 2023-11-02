QUnit.test('Managing tech indicators in Stock Tools', function (assert) {
    const chart = Highcharts.stockChart('container', {
        chart: {
            width: 800
        },
        yAxis: {
            labels: {
                align: 'left'
            }
        },
        series: [
            {
                type: 'ohlc',
                id: 'aapl',
                name: 'AAPL Stock Price',
                data: [
                    [0, 12, 15, 10, 13],
                    [1, 13, 91, 11, 15],
                    [2, 15, 15, 11, 12],
                    [3, 12, 12, 11, 12],
                    [4, 12, 15, 12, 15],
                    [5, 11, 11, 10, 10],
                    [6, 10, 16, 10, 12],
                    [7, 12, 17, 12, 17],
                    [8, 17, 18, 15, 15],
                    [9, 15, 19, 12, 12]
                ]
            },
            {
                type: 'column',
                id: 'column-1',
                data: [
                    [0, 10],
                    [1, 11],
                    [2, 12],
                    [3, 13],
                    [4, 14],
                    [5, 15],
                    [6, 16],
                    [7, 17],
                    [8, 18],
                    [9, 19]
                ]
            }
        ]
    });

    // Test yAxis resizers and adding indicators:
    chart.navigationBindings.selectedButtonElement = document
        .getElementsByClassName('highcharts-indicators')[0];
    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        // Existing axis has 100% height, and new axis has 20% height.
        // 100 / 1.2 scalles all of them back to 100%
        100 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Main Axis should have correct height after adding 1 indicator. Main axis -> 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.top),
        0,
        0.0001, // up to 0.0001% is fine
        'Main Axis should have correct top after adding 1 indicator. Main axis -> 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        20 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 1 indicator. Main axis -> 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        100 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 1 indicator. Main axis -> 100% height'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        100 / 1.4,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after adding 2 indicators. Main axis originally 100% height'
    );
    assert.close(
        parseFloat(chart.yAxis[0].options.top),
        0,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct top after adding 2 indicators. Main axis originally 100% height'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        20 / 1.4,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 2 indicators. Main axis originally 100% height'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        100 / 1.4,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 2 indicators. Main axis originally 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[2].options.height),
        20 / 1.4,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 2 indicators. Main axis originally 100% height'
    );
    assert.close(
        parseFloat(chart.yAxis[2].options.top),
        120 / 1.4,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 2 indicators. Main axis originally 100% height'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'remove',
            seriesId:
                chart.series[chart.series.length - 2]
                    .options.id
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        100 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after deleting 1 indicator. Main axis -> 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.top),
        0,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct top after deleting 1 indicator. Main axis -> 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        20 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after deleting 1 indicator. Main axis -> 100% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        100 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after deleting 1 indicator. Main axis -> 100% height'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'remove',
            seriesId:
                chart.series[chart.series.length - 2]
                    .options.id
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        100,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after deleting all indicators. Main axis -> 100% height'
    );

    chart.update({
        yAxis: {
            height: '60%',
            labels: {
                align: 'left'
            }
        }
    });

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        60,
        0.0001, // up to 0.0001% is fine
        'Main Axis should have correct height after adding 1 indicator. Main axis originally 60% height'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        20,
        0.0001, // up to 0.0001% is fine
        'Indicator Axis should have correct height after axis after adding 1 indicator. Main axis originally 60% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        60,
        0.0001, // up to 0.0001% is fine
        'Indicator Axis should have correct top after adding 1 indicators. Main axis originally 100% height'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        60,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after adding 1 indicator. Main axis originally 60% height'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        20,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 1 indicator. Main axis originally 60% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        60,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 2 indicators. Main axis originally 60% height'
    );
    assert.close(
        parseFloat(chart.yAxis[2].options.height),
        20,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 2 indicators. Main axis originally 60% height'
    );

    assert.close(
        parseFloat(chart.yAxis[2].options.top),
        80,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 2 indicators. Main axis originally 60% height'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'remove',
            seriesId:
                chart.series[chart.series.length - 2]
                    .options.id
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        75,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after deleting 1 indicator. Main axis originally 60% height'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        25,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after deleting 1 indicator. Main axis originally 60% height'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        75,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after deleting 1 indicator. Main axis originally 60% height'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'remove',
            seriesId:
                chart.series[chart.series.length - 2]
                    .options.id
        }
    );

    chart.yAxis[0].update({
        height: '60%',
        labels: {
            align: 'left'
        }
    }, false);

    chart.addAxis(
        {
            height: '60%',
            top: '20%'
        },
        false
    );

    chart.series[1].update({ yAxis: 1 });

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        60,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after adding 1 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.top),
        0,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct top after adding 1 indicators. Mixed axis heights'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        60,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height 1xis after adding 1 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        20,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height top after adding 1 indicators. Mixed axis heights'
    );
    assert.close(
        parseFloat(chart.yAxis[2].options.height),
        20,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height axis after adding 1 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[2].options.top),
        80,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top 1xis after adding 1 indicator. Mixed axis heights'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        60 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after adding 2 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.top),
        0,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct top after adding 2 indicators. Mixed axis heights'
    );

    // if we are adding after initial creation of the chart, the yAxis with index 1 is navigator axis
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        60 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 2 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[1].options.top),
        20 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 2 indicators. Mixed axis heights'
    );
    assert.close(
        parseFloat(chart.yAxis[2].options.height),
        20 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height axis after adding 2 indicators. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[2].options.top),
        80 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top 1xis after adding 2 indicators. Mixed axis heights'
    );
    assert.close(
        parseFloat(chart.yAxis[2].options.height),
        20 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height axis after adding 2 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[2].options.top),
        80 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top after adding 2 indicators. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[3].options.height),
        20 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct height after adding 2 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[3].options.top),
        100 / 1.2,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct top axis after adding 2 indicators. Mixed axis heights'
    );

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'remove',
            seriesId:
                chart.series[chart.series.length - 2]
                    .options.id
        }
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.height),
        60,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct height after deleting 1 indicator. Mixed axis heights'
    );

    assert.close(
        parseFloat(chart.yAxis[0].options.top),
        0,
        0.0001, // up to 0.0001% is fine
        'Main axis should have correct top after adding 1 indicator. Mixed axis heights'
    );
    assert.close(
        parseFloat(chart.yAxis[1].options.height),
        60,
        0.0001, // up to 0.0001% is fine
        'Indicator axis should have correct Height after adding 1 indicator. Mixed axis heights'
    );

    chart.update({
        chart: {
            width: 800
        },
        yAxis: [
            {
                height: '60%',
                labels: {
                    align: 'left'
                }
            },
            {
                height: '60%',
                top: '20%'
            }
        ],
        series: [
            {
                type: 'ohlc',
                id: 'aapl',
                name: 'AAPL Stock Price',
                data: [
                    [0, 12, 15, 10, 13],
                    [1, 13, 91, 11, 15],
                    [2, 15, 15, 11, 12],
                    [3, 12, 12, 11, 12],
                    [4, 12, 15, 12, 15],
                    [5, 11, 11, 10, 10],
                    [6, 10, 16, 10, 12],
                    [7, 12, 17, 12, 17],
                    [8, 17, 18, 15, 15],
                    [9, 15, 19, 12, 12]
                ]
            },
            {
                yAxis: 1,
                type: 'column',
                id: 'column-1',
                data: [
                    [0, 10],
                    [1, 11],
                    [2, 12],
                    [3, 13],
                    [4, 14],
                    [5, 15],
                    [6, 16],
                    [7, 17],
                    [8, 18],
                    [9, 19]
                ]
            }
        ]
    });

    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'aapl',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'atr'
        }
    );

    assert.strictEqual(
        chart.series[2].getDGApproximation(),
        chart.series[chart.series.length - 1].options
            .dataGrouping.approximation,
        'Indicator on column series should use the same DG approximation (#13950).'
    );
});
