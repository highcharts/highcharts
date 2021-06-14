QUnit.test('Test current and last price indicator.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [
            {
                type: 'line',
                data: [10, 5, 30, 10, 20, 15, 20, 20, 1, 2, 30, 12, 22],
                lastPrice: {
                    enabled: true,
                    color: 'red'
                },
                lastVisiblePrice: {
                    enabled: true,
                    label: {
                        enabled: true
                    }
                }
            }, {
                data: [0],
                lastVisiblePrice: {
                    enabled: true,
                    label: {
                        enabled: true
                    }
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].lastPrice.y && chart.series[0].lastVisiblePrice.y,
        22,
        'The last label and line are correct.'
    );

    chart.xAxis[0].setExtremes(0, 2);

    assert.strictEqual(
        chart.series[0].lastPrice.y,
        22,
        'The last price is correct.'
    );

    assert.strictEqual(
        chart.series[0].lastVisiblePrice.y,
        15,
        'The last visible price is correct.'
    );

    assert.ok(
        chart.series[1].crossLabel.hasClass('highcharts-color-1'),
        '#15706: Second lastVisiblePrice label should have correct color class'
    );
});

QUnit.test(
    'Test label background colors with lastVisiblePrice in use.',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1],
                    lastVisiblePrice: {
                        enabled: true,
                        label: {
                            enabled: true,
                            backgroundColor: 'orange'
                        }
                    }
                }
            ],
            yAxis: {
                crosshair: {
                    color: 'green',
                    label: {
                        enabled: true,
                        backgroundColor: 'blue'
                    }
                }
            }
        });

        var actualColor = chart.series[0].yAxis.crosshair.label.backgroundColor;

        assert.strictEqual(
            actualColor,
            'blue',
            'Crosshair label must not be overwritten.'
        );
    }
);

QUnit.test('The currentPriceIndicator label should be visible, #14879.',
    function (assert) {
        const chart = Highcharts.stockChart('container', {
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: [
                        "currentPriceIndicator"
                    ]
                }
            },
            series: [{
                compare: 'percent',
                data: [100, 1, 1, 10, 1],
                lastPrice: {
                    enabled: true,
                    color: 'red'
                },
                // label
                lastVisiblePrice: {
                    enabled: true,
                    label: {
                        enabled: true
                    }
                }
            }]
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-crosshair-label').attributes.visibility.value,
            'visible',
            'Crosshair label should be visible.'
        );
    }
);
