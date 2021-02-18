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
            chart.series[0].crossLabel.added,
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
                    color: 'red'
                }
            }]
        }),
        controller = new TestController(chart),
        button = chart.stockTools.listWrapper.childNodes[0].childNodes[0];

    // Show croshair with the label.
    controller.moveTo(200, 200);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.getAttribute('visibility'),
        'visible',
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
        chart.yAxis[0].crossLabel.element.getAttribute('visibility'),
        'hidden',
        'Cross label should not be visible.'
    );

    // Show currentPriceIndicator with the label.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init.call(
        chart.navigationBindings, button);
    assert.strictEqual(
        chart.series[0].crossLabel.element.getAttribute('visibility'),
        'visible',
        'Series price indicator should be visible.'
    );
    assert.strictEqual(
        chart.series[0].crossLabel.element.childNodes[0].getAttribute('fill'),
        '#00ff00',
        'Cross label fill color should be blue.'
    );

    // Show currentPriceIndicator togehter with axis croshair.
    controller.moveTo(200, 200);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.getAttribute('visibility'),
        'visible',
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
        chart.series[0].crossLabel.element.getAttribute('visibility'),
        'visible',
        'Series last price indicator should be visible.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice.stroke,
        'red',
        'Cross label fill color should be red.'
    );

    // Hide lastPrice and currentPriceIndicator.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init.call(
        chart.navigationBindings, button);
    assert.notOk(
        chart.series[0].crossLabel,
        'Series price indicator should not exist.'
    );
    assert.notOk(
        chart.series[0].lastPrice,
        'Series last price indicator should not exist.'
    );

    // Show again the lastPrice and currentPriceIndicator.
    chart.navigationBindings.options.bindings.currentPriceIndicator.init.call(
        chart.navigationBindings, button);
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.getAttribute('visibility'),
        'visible',
        'Cross label should be visible again.'
    );
    assert.strictEqual(
        chart.yAxis[0].crossLabel.element.childNodes[0].getAttribute('fill'),
        '#0000ff',
        'Cross label fill color should be blue again.'
    );
    assert.strictEqual(
        chart.series[0].crossLabel.element.getAttribute('visibility'),
        'visible',
        'Series last price indicator should be visible again.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice.stroke,
        'red',
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
    chart.navigationBindings.options.bindings.currentPriceIndicator.init.call(
        chart.navigationBindings, button);
    chart.navigationBindings.options.bindings.currentPriceIndicator.init.call(
        chart.navigationBindings, button);

    assert.strictEqual(
        chart.series[0].lastPrice.attr('stroke'),
        '#00ff00',
        'The lastPrice color should remain the same after toggle.'
    );
});