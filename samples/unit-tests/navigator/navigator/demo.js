QUnit.test(
    'General Navigator tests',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            legend: {
                enabled: true
            },
            yAxis: {
                labels: {
                    align: 'left'
                }
            },
            navigator: {
                height: 100
            },
            series: [{
                data: [1, 2, 3],
                id: '1'
            }]
        });

        chart.series[0].hide();

        assert.deepEqual(
            chart.scroller.size,
            chart.scroller.xAxis.len,
            'Correct width (#6022)'
        );

        assert.strictEqual(
            chart.series[1].clipBox.height,
            100,
            'Navigator series has correct clipping rect height (#5904)'
        );

        chart.series[1].remove(false);
        chart.series[0].remove();

        assert.strictEqual(
            chart.series.length,
            0,
            'All series, including navSeries, removed without errors (#5581)'
        );
    }
);

QUnit.test(
    'Reversed xAxis with navigator',
    function (assert) {

        var chart = new Highcharts.StockChart({
                chart: {
                    renderTo: 'container'
                },
                series: [{
                    data: [
                        [10, 20],
                        [15, 22]
                    ]
                }],
                rangeSelector: {
                    buttons: [{
                        count: 5,
                        type: 'millisecond',
                        text: '5ms'
                    }],
                    inputEnabled: false,
                    selected: 0
                },
                navigator: {
                    xAxis: {
                        reversed: true
                    }
                },
                xAxis: {
                    reversed: true,
                    minRange: 1
                }
            }),
            offset = $('#container').offset(),
            navigator = chart.scroller,
            done = assert.async();

        chart.series[0].addPoint([20, 23]);

        assert.strictEqual(
            chart.xAxis[0].max,
            20,
            'Correct extremes after addPoint() (#7713).'
        );

        navigator.handlesMousedown({
            pageX: offset.left + 578,
            pageY: offset.top + 400 - 30
        }, 0);

        navigator.mouseMoveHandler({
            pageX: offset.left + 309,
            pageY: offset.top + 400 - 30,
            DOMType: 'mousemove'
        });

        setTimeout(function () {
            navigator.hasDragged = true;
            navigator.mouseUpHandler({
                pageX: offset.left + 308,
                pageY: offset.top + 400 - 30,
                DOMType: 'mouseup'
            });
            assert.strictEqual(
                chart.series[0].points !== null,
                true,
                'Zooming works fine (#4114).'
            );
            done();
        }, 0);
    }
);

QUnit.test(
    'Scrollbar without navigator (#5709).',
    function (assert) {
        var done = assert.async();

        $('#container').highcharts('StockChart', {
            chart: {
                zoomType: 'xy'
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: true,
                showFull: true
            }
        }, function (chart) {
            setTimeout(function () {
                chart.addSeries({
                    data: [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1]
                });
                assert.strictEqual(
                    chart.scroller.scrollbar.group.translateY >= 0,
                    true,
                    'Correct position for a scrollbar'
                );
                done();
            }, 1);
        });
    }
);

QUnit.test('Missing points using navigator (#5699)', function (assert) {
    var container = $('#container'),
        chart = container.highcharts('StockChart', {
            chart: {
                width: 600,
                height: 400
            }
        }).highcharts(),
        offset = container.offset(),
        navigator = chart.scroller,
        done = assert.async();

    chart.addSeries({
        type: 'column',
        name: 'USD to EUR',
        data: usdeur
    });

    navigator.handlesMousedown({
        pageX: offset.left + 578,
        pageY: offset.top + 400 - 30
    }, 0);

    navigator.mouseMoveHandler({
        pageX: offset.left + 309,
        pageY: offset.top + 400 - 30,
        DOMType: 'mousemove'
    });

    setTimeout(function () {
        navigator.hasDragged = true;
        navigator.mouseUpHandler({
            pageX: offset.left + 308,
            pageY: offset.top + 400 - 30,
            DOMType: 'mouseup'
        });
        assert.strictEqual(
            chart.series[0].points !== null,
            true,
            'Points exist.'
        );
        done();
    }, 0);
});

QUnit.test('#3961 - Zone zAxis shouldn\'t cause errors in Navigator series.', function (assert) {
    var chart = $('#container').highcharts('StockChart', {
        series: [{
            type: 'bubble',
            data: [
                [0, 10, 20],
                [1, 10, 20]
            ]
        }]
    }).highcharts();

    assert.strictEqual(
        chart.scroller.handles.length !== 0, // handles are not rendered when we get error in zones
        true,
        'No errors in zones for bubble series.'
    );
});

QUnit.test('Extremes in navigator with empty series initalized (#5390)', function (assert) {

    var chart = Highcharts.stockChart('container', {
            series: []
        }),
        series = [{
            data: [{
                x: 1465102500000,
                y: 0.0057043973610007015
            }, {
                x: 1465251900000,
                y: 0.020374603343000786
            }]
        }, {
            data: [{
                x: 1465102800000,
                y: 23
            }, {
                x: 1465252200000,
                y: 77
            }]
        }, {
            data: [{
                x: 1465102800000,
                y: 1.2800000000000011
            }, {
                x: 1465252200000,
                y: 1.3199999999999932
            }]
        }],
        points = [{
            data: [{
                x: 1464951300000,
                y: 0.04950855198299564
            }, {
                x: 1465100700000,
                y: 0.007108723524993366
            }]
        }, {
            data: [{
                x: 1464951600000,
                y: 101
            }, {
                x: 1465101000000,
                y: 18
            }]
        }, {
            data: [{
                x: 1464951600000,
                y: 1.5
            }, {
                x: 1465101000000,
                y: 1.2399999999999949
            }]
        }];

    Highcharts.each(series, function (s) {
        chart.addSeries(s, false);
    });
    chart.xAxis[0].setExtremes();

    Highcharts.each(points, function (s, index) {
        if (chart.series[index].options.id !== "highcharts-navigator-series") {
            Highcharts.each(s.data, function (p) {
                chart.series[index].addPoint(p, false);
            });
        }
    });
    chart.xAxis[0].setExtremes();

    assert.strictEqual(
        chart.xAxis[1].getExtremes().max,
        1465251900000,
        'Correct extremes in navigator'
    );

});

QUnit.test('Add point and disabled navigator (#3452)', function (assert) {

    var chart,
        x = 0;

    function add() {
        // set up the updating of the chart each second
        var series = chart.series[0];
        series.addPoint([x++, x % 10], true, true);
    }
    // Create the chart
    chart = Highcharts.stockChart('container', {
        rangeSelector: {
            buttons: [{
                count: 100,
                type: 'millisecond',
                text: '100ms'
            }, {
                count: 1,
                type: 'second',
                text: '1s'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0
        },

        title: {
            text: 'Live random data'
        },

        exporting: {
            enabled: false
        },

        series: [{
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    i;

                for (i = -1000; i <= 0; i += 1) {
                    data.push([
                        x++,
                        x % 10
                    ]);
                }
                return data;
            }())
        }],

        navigator: {
            enabled: false
        }
    });


    assert.strictEqual(
        chart.xAxis[0].min,
        900,
        'Initial min'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        1000,
        'Initial max'
    );

    // Add one point, the zoomed range should now move
    add();

    assert.strictEqual(
        chart.xAxis[0].min,
        901,
        'Adapted min'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        1001,
        'Adapted max'
    );
});

QUnit.test('Empty scroller with Axis min set (#5172)', function (assert) {
    var chart = Highcharts.chart('container', {
        "xAxis": {
            "min": 0
        },
        "series": [{
            "id": "navigator",
            "name": null,
            "data": []
        }, {
            "id": "my_data",
            "name": null,
            "data": []
        }],
        "navigator": {
            "enabled": true,
            "series": {
                "id": "navigator"
            },
            "xAxis": {
                "min": 0
            }
        }
    });

    assert.strictEqual(
        chart.navigator.navigatorGroup.attr('visibility'),
        'hidden',
        'Navigator hidden due to missing data'
    );
});

QUnit.test('Update navigator series on series update (#4923)', function (assert) {

    var chart = Highcharts.stockChart('container', {
            series: [{
                animation: false,
                data: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 2, y: 2 },
                    { x: 3, y: 3 },
                    { x: 4, y: 4 },
                    { x: 5, y: 5 },
                    { x: 6, y: 6 },
                    { x: 7, y: 7 },
                    { x: 8, y: 8 },
                    { x: 9, y: 9 }
                ],
                dataGrouping: {
                    enabled: false
                }
            }]
        }),
        done = assert.async();

    var pathWidth = chart.series[1].graph.getBBox().width;

    assert.strictEqual(
        typeof pathWidth,
        'number',
        'Path width is set'
    );
    assert.ok(
        pathWidth > 500,
        'Path is more than 500px wide'
    );

    setTimeout(function () {
        chart.series[0].addPoint([10, 10]);
        assert.strictEqual(
            chart.series[1].graph.getBBox().width,
            pathWidth,
            'Path width is updated'
        );
        done();
    }, 1);

});


QUnit.test('Moving navigator with no series should not break axis (#7411)',
function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                animation: false
            },
            navigator: {
                series: {
                    visible: false
                }
            },
            rangeSelector: {
                selected: 4
            },
            series: [{
                animation: false,
                data: [
                    { x: 1000000, y: 0 },
                    { x: 100000001, y: 1 },
                    { x: 1000000002, y: 2 },
                    { x: 10000000004, y: 4 },
                    { x: 100000000005, y: 5 },
                    { x: 1000000000007, y: 7 }
                ]
            }]
        }),
        controller = TestController(chart),
        rightHandle = chart.navigator.handles[1],
        isNum = Highcharts.isNumber;

    assert.ok(
        isNum(chart.xAxis[0].userMax),
        'Axis should have proper extremes before messing with navigator.'
    );

    // Make the nav do its rendering by simulating mouse click and drag on
    // right handle.
    function navRender() {
        var x = rightHandle.x + rightHandle.translateX + rightHandle.width / 2,
            y = rightHandle.y + rightHandle.translateY + rightHandle.height / 2;
        controller.triggerEvent('mousedown', x, y);
        controller.triggerEvent('mousemove', x, y);
        controller.triggerEvent('mouseup', x, y);
    }

    navRender();
    chart.series[0].hide();
    navRender();

    assert.ok(
        isNum(chart.xAxis[0].userMax),
        'Axis should have proper extremes after messing with navigator.'
    );
});

QUnit.test(
    'Highcharts events tests',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
                series: [{
                    data: [1, 2, 3]
                }],
                navigator: {
                    adaptToUpdatedData: true
                }
            }),
            getMarginsLength = chart.hcEvents.getMargins.length;

        chart.update({
            navigator: {
                adaptToUpdatedData: false
            }
        });

        assert.strictEqual(
            chart.series[0].hcEvents.updatedData.length,
            1,
            'Update of adaptToUpdatedData should remove all related events (#8038)'
        );

        assert.strictEqual(
            chart.hcEvents.getMargins.length,
            getMarginsLength,
            'Update of navigator should not add extra events getMargins (#8595)'
        );
    }
);

// Highcharts 6.0.0, Issue #7067
// Chart.update() doesn't enable the navigator under certain conditions
QUnit.test('Chart update enables navigator (#7067)', function (assert) {

    var chart = Highcharts.stockChart('container', {
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.deepEqual([
        typeof chart.navigator,
        typeof chart.scroller
    ], [
        'undefined',
        'undefined'
    ],
        'Chart should have no navigator.'
    );

    chart.update({
        navigator: {
            enabled: true
        }
    });

    assert.notDeepEqual([
        typeof chart.navigator,
        typeof chart.scroller
    ], [
        'undefined',
        'undefined'
    ],
        'Chart should have a navigator instance.'
    );

    assert.ok(
        chart.navigator &&
        chart.navigator.navigatorEnabled,
        'Navigator should be enabled.'
    );

});
QUnit.test(
    'Navigator series visibility should be in sync with master series (#8374)',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
                legend: {
                    enabled: true
                },
                series: [{
                    data: [1, 2, 3],
                    visible: false
                }, {
                    showInNavigator: true,
                    data: [30, 22, 10]
                }]
            }),
            series0 = chart.series[0],
            series1 = chart.series[1];

        assert.strictEqual(
            // This returns false, when series is hidden:
            series0.navigatorSeries.visible === true,
            // Directly visibile = false
            series0.visible,
            'Both series[0] and series[0].navigator should be hidden.'
        );

        assert.strictEqual(
            series1.navigatorSeries.visible === true,
            series1.visible,
            'Both series[1] and series[1].navigator should be visible.'
        );

        series0.update({
            visible: true
        });

        assert.strictEqual(
            series0.navigatorSeries.visible === true,
            series0.visible,
            'Both series[0] and series[0].navigator should be visible.'
        );

        series1.update({
            visible: false
        });

        assert.strictEqual(
            series1.navigatorSeries.visible === true,
            series1.visible,
            'Both series[1] and series[1].navigator should be hidden.'
        );

        // Order of the events:
        // - first execute callback for series.hide(), to show navigator series
        // - then redraw the chart, including navigator series
        series1.setVisible();

        assert.strictEqual(
            Highcharts.defined(series1.navigatorSeries.graph) &&
                series1.navigatorSeries.group.visibility !== 'hidden',
            true,
            'Navigator series should be visible.'
        );

    }
);


QUnit.test('stickToMin and stickToMax', function (assert) {
    var chart = new Highcharts.stockChart('container', {
            xAxis: {
                min: 5,
                minRange: 1
            },
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            rangeSelector: {
                buttons: [{
                    count: 2,
                    type: 'millisecond',
                    text: '2ms'
                }]
            },
            series: [{
                pointStart: 0,
                data: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
            }, {
                pointStart: 5,
                data: [3, 2, 1, 1, 2]
            }]
        }),
        extremes;

    chart.series[0].addPoint(5, false, false);
    chart.series[1].addPoint(5, false, false);
    chart.redraw();

    extremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        extremes.min,
        5,
        'stickToMin, multiple series with different ranges: ' +
            'Correct extremes after adding points(#9075)'
    );

    chart.series[0].update({
        pointStart: extremes.max,
        data: [4]
    });

    chart.rangeSelector.clickButton(0, true);
    chart.series[0].addPoint(5);
    chart.series[1].addPoint(5);
    extremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        extremes.min,
        extremes.max - chart.fixedRange,
        'stickToMax, multiple series with different ranges: ' +
            'Correct extremes after rangeSelector use and adding points(#9075)'
    );
});