var correctFloat = Highcharts.correctFloat,
    getData = function () {
        var data = [],
            i;

        for (i = 0; i < 1000; i++) {
            data.push([
                +new Date() + i * 3600,
                153 + correctFloat(Math.random(0, 1), 2),
                153 + correctFloat(Math.random(0, 1), 2),
                153 + correctFloat(Math.random(0, 1), 2),
                153 + correctFloat(Math.random(0, 1), 2)
            ]);
        }

        return data;
    };

QUnit.test('Price indicator.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 1184663400000,
                max: 1284663400000
            },
            series: [
                {
                    lastPrice: {
                        enabled: true,
                        color: 'red'
                    },
                    lastVisiblePrice: {
                        enabled: true,
                        label: {
                            enabled: true
                        }
                    },
                    type: 'candlestick',
                    data: [
                        [1484663400000, 118.34, 120.24, 118.22, 120],
                        [1484749800000, 120, 120.5, 119.71, 119.99],
                        [1484836200000, 119.4, 120.09, 119.37, 119.78]
                    ]
                }
            ]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.points.length === 0 && series.lastPrice === undefined,
        true,
        'No errors when points are missing.'
    );

    chart.xAxis[0].setExtremes(1484663400000, 1484836200000, false);
    chart.series[0].update({
        lastVisiblePrice: {
            enabled: false
        },
        lastPrice: {
            label: {
                enabled: true
            }
        }
    });

    assert.ok(
        true,
        'There should be no error when the lastPrice label is enabled, #17522.'
    );
});

QUnit.test('Datagrouping and setExtremes.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            rangeSelector: {
                selected: 5
            },
            series: [
                {
                    type: 'candlestick',
                    dataGrouping: {
                        enabled: true
                    },
                    lastVisiblePrice: {
                        enabled: true,
                        label: {
                            enabled: true
                        }
                    },
                    lastPrice: {
                        enabled: true,
                        color: 'red'
                    },
                    data: getData()
                }
            ]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.points[series.points.length - 1].y,
        series.lastVisiblePrice.y,
        'Indicator should show the close value of the last grouped point.'
    );

    var min = chart.xAxis[0].min,
        max = min + 100 * 3600;

    chart.xAxis[0].setExtremes(min, max);

    assert.strictEqual(
        series.points[series.points.length - 1].y,
        series.lastVisiblePrice.y,
        'Indicator should show the close value of the last non-grouped point.'
    );
});

QUnit.test(
    'CurrentPriceIndicator && yAxis crosshair label #11480.',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            xAxis: {
                crosshair: {
                    snap: false,
                    label: {
                        enabled: true
                    }
                }
            },
            yAxis: {
                crosshair: {
                    snap: false,
                    label: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    lastVisiblePrice: {
                        enabled: true,
                        label: {
                            enabled: true
                        }
                    },
                    data: getData()
                }
            ]
        });

        var min = chart.xAxis[0].min,
            max = min + 100 * 3600,
            max1 = min + 200 * 3600,
            controller = new TestController(chart);

        controller.moveTo(300, 200);

        chart.xAxis[0].setExtremes(min, max);
        chart.xAxis[0].setExtremes(min, max1);

        assert.strictEqual(
            chart.series[0].lastVisiblePriceLabel.added,
            true,
            'Label shouldn\t be deleted #11480'
        );
    }
);

QUnit.test(`The currentPriceIndicator, lastPrice and axis crosshair
    didn't work properly with stockTools, #13876.`,
function (assert) {
    const chart = Highcharts.stockChart('container', {
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: ['currentPriceIndicator']
                }
            },
            yAxis: [{
                crosshair: {
                    color: '#0000ff',
                    label: {
                        padding: 6,
                        backgroundColor: '#0000ff',
                        enabled: true
                    }
                }
            }],
            series: [{
                data: [1, 2, 4, 6, 1, 4, 6, 4, 3, 2],
                lastVisiblePrice: {
                    color: '#00ff00',
                    label: {
                        enabled: true,
                        backgroundColor: '#00ff00'
                    }
                },
                lastPrice: {
                    color: '#ff0000'
                }
            }]
        }),
        controller = new TestController(chart),
        button = chart.stockTools.listWrapper.childNodes[0].childNodes[0];

    chart.stockTools.wrapper.style.display = 'none';

    // Show croshair with the label.
    controller.moveTo(200, 200);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.visibility,
        'inherit',
        'Axis cross label should be visible.'
    );
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.childNodes[0].getAttribute('fill'),
        '#0000ff',
        'Axis cross label fill color should be blue.'
    );

    // Hide croshair with the label.
    controller.moveTo(30, 20);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.visibility,
        'hidden',
        'Cross label should not be visible.'
    );

    // Show currentPriceIndicator with the label.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);
    assert.strictEqual(
        chart.series[0].lastVisiblePriceLabel.visibility,
        'inherit',
        'Series price indicator should be visible.'
    );
    assert.strictEqual(
        chart.series[0].lastVisiblePriceLabel.element.childNodes[0].getAttribute('fill'),
        '#00ff00',
        'Last visible price label fill color should be blue.'
    );

    // Show currentPriceIndicator together with axis crosshair.
    controller.moveTo(200, 200);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.visibility,
        'inherit',
        'Cross label should be visible.'
    );
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.childNodes[0].getAttribute('fill'),
        '#0000ff',
        'Cross label fill color should be blue.'
    );

    // Adjust extremes to show the lastPrice line.
    chart.xAxis[0].setExtremes(0, 4);
    assert.strictEqual(
        chart.series[0].lastVisiblePriceLabel.visibility,
        'inherit',
        'Series last price indicator should be visible.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice.attr('stroke'),
        '#ff0000',
        'Cross label fill color should be red.'
    );

    // Hide lastPrice and currentPriceIndicator.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);
    assert.notOk(
        chart.series[0].crossLabel,
        'Series price indicator should not exist.'
    );
    assert.notOk(
        chart.series[0].lastPrice,
        'Series last price indicator should not exist.'
    );

    // Show again the lastPrice and currentPriceIndicator.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.visibility,
        'inherit',
        'Cross label should be visible again.'
    );
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.childNodes[0].getAttribute('fill'),
        '#0000ff',
        'Cross label fill color should be blue again.'
    );
    assert.strictEqual(
        chart.series[0].lastVisiblePriceLabel.visibility,
        'inherit',
        'Series last price indicator should be visible again.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice.attr('stroke'),
        '#ff0000',
        'Cross label fill color should be red again.'
    );
});

QUnit.test('The lastPrice color, #15074.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: ['currentPriceIndicator']
                }
            },
            series: [{
                data: [1, 2, 4, 6, 1, 5, 2.5],
                lastPrice: {
                    enabled: true,
                    color: '#00ff00'
                }
            }]
        }),
        button = chart.stockTools.listWrapper.childNodes[0].childNodes[0];

    assert.strictEqual(
        chart.series[0].lastPrice.attr('stroke'),
        '#00ff00',
        'The lastPrice color should be as declared in the options.'
    );

    // Toggle the currentPriceIndicator button in the stock tools.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);

    assert.strictEqual(
        chart.series[0].lastPrice.attr('stroke'),
        '#00ff00',
        'The lastPrice color should remain the same after toggle.'
    );

    assert.ok(
        chart.series[0].lastPrice.element.classList
            .contains('highcharts-color-0'),
        'CSS class of highcharts-color-{x} ' +
            'should be added to lastPrice (#15222)'
    );
});

QUnit.test('The currentPriceIndicator for multiple series, #14888.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            yAxis: [{
                height: '60%'
            }, {
                top: '65%',
                height: '35%'
            }],
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: ['currentPriceIndicator']
                }
            },
            series: [{
                id: 'main',
                color: '#00ffff',
                data: [2, 6, 8, 6, 3, 1, 1, 3, 5, 6, 9, 9, 9, 7, 4, 2, 1, 9]
            }, {
                type: 'sma',
                linkedTo: 'main',
                color: '#ff00ff'
            }, {
                type: 'column',
                color: '#000000',
                yAxis: 1,
                data: [10, 2, 5, 6, 1, 3, 5, 1, 3, 5, 4, 1, 3, 5, 6, 4, 1, 4]
            }]
        }),
        button = chart.stockTools.listWrapper.childNodes[0].childNodes[0];

    // Click the currentPriceIndicator button in the stock tools.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init.call(
        chart.navigationBindings, button);

    chart.series.forEach(function (series) {
        if (series.options.id !== 'highcharts-navigator-series') {
            assert.strictEqual(
                series.lastPrice.attr('stroke'),
                series.color,
                'Each series\' lastPrice line should have color as series.'
            );
            assert.strictEqual(
                series.lastVisiblePriceLabel.attr('fill'),
                series.color,
                'Each series\' lastVisiblePrice label should have color as series.'
            );
        }
    });

    chart.series[0].update({
        lastPrice: {
            color: '#ff0000'
        }
    });
    assert.strictEqual(
        chart.series[0].lastPrice.attr('stroke'),
        '#ff0000',
        'Options declared for the lastPrice should overwrite the default one.'
    );
});

QUnit.test('The currentPriceIndicator in StockTools, #15029.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: ['currentPriceIndicator']
                }
            },
            series: [{
                data: [1, 2, 4, 6, 1, 5, 2.5],
                lastPrice: {
                    enabled: true,
                    color: '#00ff00'
                }
            }]
        }),
        button = chart.stockTools.listWrapper.childNodes[0].childNodes[0];

    assert.ok(
        chart.series[0].lastPrice,
        'When declared in options the lastPrice line should exist.'
    );
    assert.notOk(
        chart.series[0].lastVisiblePrice,
        'The lastVisiblePrice should not exist.'
    );
    assert.ok(
        button.childNodes[0].style['background-image'].indexOf('hide') !== -1,
        'When the chart initialized with the price indicator, the button should show an icon to hide.'
    );

    // Click the button in StockTools.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);

    assert.notOk(
        chart.series[0].lastPrice,
        'The lastPrice should not exist.'
    );
    assert.notOk(
        chart.series[0].lastVisiblePrice,
        'The lastVisiblePrice should not exist.'
    );
    assert.ok(
        button.childNodes[0].style['background-image'].indexOf('show') !== -1,
        'After a click, the button should suggest a possibility to show a price indicator.'
    );

    // Click the button in StockTools once again.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);

    assert.ok(
        chart.series[0].lastPrice,
        'The lastPrice should exist.'
    );
    assert.ok(
        chart.series[0].lastVisiblePrice,
        'The lastVisiblePrice should exist.'
    );
    assert.ok(
        button.childNodes[0].style['background-image'].indexOf('hide') !== -1,
        'After the second click, the button should change again.'
    );

    chart.series[0].update({
        lastVisiblePrice: {
            enabled: false
        }
    });
    assert.ok(
        button.childNodes[0].style['background-image'].indexOf('hide') !== -1,
        'After an update, the button should suggest a possibility to hide a price indicator.'
    );
    chart.navigationBindings.options.bindings.currentPriceIndicator.init
        .call(chart.navigationBindings, button);

    assert.notOk(
        chart.series[0].lastPrice,
        'The lastPrice should not exist.'
    );
    assert.notOk(
        chart.series[0].lastVisiblePrice,
        'The lastVisiblePrice should not exist.'
    );
    assert.ok(
        button.childNodes[0].style['background-image'].indexOf('show') !== -1,
        'After an update and click, the button should suggest a possibility to show a price indicator again.'
    );
});
