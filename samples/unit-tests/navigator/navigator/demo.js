QUnit.test(
    'Width and height',
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
    }
);

QUnit.test(
    'Reversed xAxis with navigator should allow zooming.',
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
                navigator: {
                    xAxis: {
                        reversed: true
                    }
                },
                xAxis: {
                    minRange: 1
                }
            }),
            offset = $('#container').offset(),
            navigator = chart.scroller,
            done = assert.async();


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
            'Navigator works.'
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
