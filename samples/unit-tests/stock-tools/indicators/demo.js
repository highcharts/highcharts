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
                    [1, 13, 16, 91, 15],
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
        ],
        stockTools: {
            gui: {
                enabled: true
            }
        }
    });
    let i;

    // Test yAxis resizers and adding indicators:
    for (i = 0; i < 9; i++) {
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
            i < 4 ? 100 - (i + 1) * 20 : 100 / (i + 2),
            0.0001, // up to 0.0001% is fine
            'Correct height for MAIN yAxis (' +
                (i + 2) +
                ' panes - indicator.add).'
        );
        assert.close(
            parseFloat(chart.yAxis[i + 2].options.height),
            i < 4 ? 20 : 100 / (i + 2),
            0.0001, // up to 0.0001% is fine
            'Correct height for LAST yAxis (' +
                (i + 2) +
                ' panes - indicator.add).'
        );
    }

    for (i = 9; i > 0; i--) {
        chart.navigationBindings.selectedButtonElement = document
            .getElementsByClassName('highcharts-indicators')[0];
        chart.navigationBindings.utils.manageIndicators.call(
            chart.navigationBindings,
            {
                actionType: 'remove',
                seriesId: chart.series[chart.series.length - 2].options.id
            }
        );

        assert.close(
            parseFloat(chart.yAxis[0].options.height),
            i < 6 ? 100 - (i - 1) * 20 : 100 / i,
            0.005, // up to 0.5% is fine
            'Correct height for main yAxis (' +
                (i + 1) +
                ' pane(s) - indicator.remove).'
        );
    }

    chart.navigationBindings.selectedButtonElement = document
        .getElementsByClassName('highcharts-indicators')[0];
    chart.navigationBindings.utils.manageIndicators.call(
        chart.navigationBindings,
        {
            actionType: 'add',
            linkedTo: 'column-1',
            fields: {
                'params.index': '0',
                'params.period': '5'
            },
            type: 'sma'
        }
    );

    assert.strictEqual(
        chart.series[1].getDGApproximation(),
        chart.series[chart.series.length - 2].options.dataGrouping
            .approximation,
        'Indicator on column series should use the same DG approximation (#13950).'
    );
});
