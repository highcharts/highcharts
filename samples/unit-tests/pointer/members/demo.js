/* global TestController */
QUnit.test('Pointer.runPointActions. stickyTracking: true (default). #5914', function (assert) {

    var events = [],
        isNumber = Highcharts.isNumber,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        config = {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true, // Force kd tree to run synchronously.
                    events: {
                        mouseOver: function () {
                            var series = this;
                            pushEvent('mouseOver', series);
                        },
                        mouseOut: function () {
                            var series = this;
                            pushEvent('mouseOut', series);
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOver', series, point);
                            },
                            mouseOut: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOut', series, point);
                            }
                        }
                    }
                }
            }
        };

    var chart = Highcharts.chart('container', {
            chart: config.chart,
            plotOptions: config.plotOptions,
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }]
        }),
        controller = new TestController(chart);

    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    // Move starting position of cursor to 50px below series[0].points[0].
    controller.setPosition(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY + 50
    );
    controller.moveTo(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.0.-',
        'mousemove to 0.0: mouseOver fired on series[0]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.0.0',
        'mousemove to 0.0: mouseOver fired on series[0].points[0]'
    );
    assert.strictEqual(
        events.length,
        0,
        'mousemove to 0.0: no unexpected events'
    );

    // New point, and new series.
    // NOTICE Qunit has added new content to the page,
    // so we have to move the cursor again.
    controller.setPosition(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY
    );
    controller.moveTo(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY + 30
    );
    assert.strictEqual(
        events.shift(),
        'mouseOut.0.0',
        'mousemove 30px below 1.0: mouseOut fired on series[0].points[0]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOut.0.-',
        'mousemove 30px below 1.0: mouseOut fired on series[0]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.-',
        'mousemove 30px below 1.0: mouseOver fired on series[1]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.0',
        'mousemove 30px below 1.0: mouseOver fired on series[1].points[0]'
    );
    assert.strictEqual(
        events.length,
        0,
        'mousemove 30px below 1.0: no unexpected events'
    );

    // New point, same series
    // NOTICE Qunit has added new content to the page,
    // so we have to move the cursor again.
    controller.setPosition(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY
    );
    controller.moveTo(
        chart.plotLeft + chart.series[1].points[2].plotX,
        chart.plotTop + chart.series[1].points[2].plotY
    );
    assert.strictEqual(
        events.shift(),
        'mouseOut.1.0',
        'mousemove to 1.2: mouseOut fired on series[1].points[0]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.1',
        'mousemove to 1.2: mouseOver fired on series[1].points[1]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOut.1.1',
        'mousemove to 1.2: mouseOut fired on series[1].points[1]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.2',
        'mousemove to 1.2: mouseOver fired on series[1].points[2]'
    );
    assert.strictEqual(
        events.length,
        0,
        'mousemove to 1.2: no unexpected events'
    );
    // Same point, same series.
    controller.setPosition(
        chart.plotLeft + chart.series[1].points[2].plotX,
        chart.plotTop + chart.series[1].points[2].plotY
    );
    controller.moveTo(
        chart.plotLeft + chart.series[1].points[2].plotX,
        chart.plotTop + chart.series[1].points[2].plotY + 30
    );
    assert.strictEqual(
        events.length,
        0,
        'mousemove to 30px below 1.2: no unexpected events'
    );
});

QUnit.test('Pointer.runPointActions. stickyTracking: false. #5914', function (assert) {
    var events = [],
        isNumber = Highcharts.isNumber,
        merge = Highcharts.merge,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        config = {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true, // Force kd tree to run synchronously.
                    events: {
                        mouseOver: function () {
                            var series = this;
                            pushEvent('mouseOver', series);
                        },
                        mouseOut: function () {
                            var series = this;
                            pushEvent('mouseOut', series);
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOver', series, point);
                            },
                            mouseOut: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOut', series, point);
                            }
                        }
                    }
                }
            }
        };
    var options = {
            chart: config.chart,
            plotOptions: merge(config.plotOptions, {
                series: {
                    stickyTracking: false
                }
            }),
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }]
        },
        chart = Highcharts.chart('container', options),
        snap = chart.options.tooltip.snap,
        controller = new TestController(chart);

    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    controller.setPosition(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY + snap + 25
    );
    controller.moveTo(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY + snap + 15
    );
    assert.strictEqual(
        events.length,
        0,
        'stickyTracking: false. moveTo 15px below 1.0: no unexpected events'
    );

    controller.setPosition(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY + snap + 15
    );
    controller.moveTo(
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY + snap - 5
    );

    // With Edge the Series.onMouseOver executed after all mousemoves are complete.
    controller.triggerEvent(
        'mousemove',
        chart.plotLeft + chart.series[1].points[0].plotX,
        chart.plotTop + chart.series[1].points[0].plotY + snap - 5
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.-',
        'stickyTracking: false. moveTo to 5px below 1.0: mouseOver fired on series[1]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.0',
        'stickyTracking: false. moveTo to 5px below 1.0: mouseOver fired on series[1].points[0]'
    );
    assert.strictEqual(
        events.length,
        0,
        'stickyTracking: false. moveTo to 5px below 1.0: no unexpected events'
    );
});

QUnit.test('Pointer.runPointActions. shared: true. stickyTracking: false. #6476', function (assert) {
    var events = [],
        isNumber = Highcharts.isNumber,
        merge = Highcharts.merge,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        config = {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true, // Force kd tree to run synchronously.
                    events: {
                        mouseOver: function () {
                            var series = this;
                            pushEvent('mouseOver', series);
                        },
                        mouseOut: function () {
                            var series = this;
                            pushEvent('mouseOut', series);
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOver', series, point);
                            },
                            mouseOut: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOut', series, point);
                            }
                        }
                    }
                }
            }
        };
    var options = {
            chart: config.chart,
            plotOptions: merge(config.plotOptions, {
                series: {
                    stickyTracking: false
                }
            }),
            tooltip: {
                shared: true
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            }, {
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse()
            }]
        },
        chart = Highcharts.chart('container', options),
        series = chart.series[0],
        point = series.points[0],
        controller = new TestController(chart);

    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    controller.setPosition(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY - 50
    );
    controller.moveTo(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.0.-',
        'Move to point 0.0: mouseOver.0.-'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.0.0',
        'Move to point 0.0: mouseOver.0.0'
    );
    assert.strictEqual(
        chart.hoverPoint === point,
        true,
        'Move to point 0.0: hoverPoint equals 0.0'
    );
    assert.strictEqual(
        chart.hoverPoints.length,
        2,
        'Move to point 0.0: length of hoverPoints is 2'
    );
    assert.strictEqual(
        events.length,
        0,
        'No unexpected events.'
    );

    point = series.points[1];
    controller.moveTo(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY - 40
    );
    assert.strictEqual(
        events.shift(),
        'mouseOut.0.0',
        'Move to 40px below 0.1: mouseOut.0.0'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOut.0.-',
        'Move to 40px below 0.1: mouseOut.0.-'
    );
    assert.strictEqual(
        !!chart.hoverPoint,
        false,
        'Move to point 0.1: hoverPoint is null'
    );
    assert.strictEqual(
        !!chart.hoverPoints,
        false,
        'Move to point 0.1: hoverPoints is null'
    );
    assert.strictEqual(
        events.length,
        0,
        'No unexpected events.'
    );

    controller.moveTo(
        chart.plotLeft + point.plotX,
        chart.plotTop + point.plotY
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.0.-',
        'Move to point 0.1: mouseOver.0.-'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.0.1',
        'Move to point 0.1: mouseOver.0.1'
    );
    assert.strictEqual(
        chart.hoverPoint === point,
        true,
        'Move to point 0.1: hoverPoint equals 0.1'
    );
    assert.strictEqual(
        chart.hoverPoints.length,
        2,
        'Move to point 0.1: length of hoverPoints is 2'
    );
    assert.strictEqual(
        events.length,
        0,
        'No unexpected events.'
    );
});

QUnit.test('Pointer.runPointActions. isDirectTouch: true && shared: true. #6517, #6586', function (assert) {
    var events = [],
        isNumber = Highcharts.isNumber,
        merge = Highcharts.merge,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        config = {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true, // Force kd tree to run synchronously.
                    events: {
                        mouseOver: function () {
                            var series = this;
                            pushEvent('mouseOver', series);
                        },
                        mouseOut: function () {
                            var series = this;
                            pushEvent('mouseOut', series);
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOver', series, point);
                            },
                            mouseOut: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOut', series, point);
                            }
                        }
                    }
                }
            }
        };
    var chart = Highcharts.chart('container', {
            chart: merge(config.chart, {
                type: 'column'
            }),
            plotOptions: config.plotOptions,
            tooltip: {
                shared: true
            },
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }]
        }),
        pointer = chart.pointer,
        controller = new TestController(chart),
        // series1 = chart.series[0],
        series2 = chart.series[1];

    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    // Move starting position of cursor to 50px below series[0].points[0].
    controller.moveTo(
        chart.plotLeft + series2.points[0].plotX + 10,
        chart.plotTop + series2.points[0].plotY - 50
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.-',
        'mousemove to 50px above 1.0: mouseOver fired on series[1]'
    );
    assert.strictEqual(
        events.shift(),
        'mouseOver.1.0',
        'mousemove to 50px above 1.0: mouseOver fired on series[1].points[0]'
    );
    assert.strictEqual(
        events.length,
        0,
        'mousemove to 50px above 1.0: no unexpected events'
    );
    assert.strictEqual(
        pointer.isDirectTouch,
        undefined,
        'mousemove to 50px above 1.0: not a direct touch.'
    );

    // Move inside point 0.1
    controller.moveTo(
        chart.plotLeft + series2.points[0].plotX + 10,
        chart.plotTop + series2.points[0].plotY + 10
    );
    assert.strictEqual(
        events.length,
        0,
        'mousemove to 10px inside 0.1: no unexpected events'
    );
    assert.strictEqual(
        pointer.isDirectTouch,
        true,
        'mousemove to 50px above 0.1: not a direct touch.'
    );

    // TODO getKDPoints returns wrong hoverPoint with columns and shared tooltip
    // Move to 50px above 0.1
    // el = series1.points[1].graphic.element;
    // console.log(el);
    // chart.pointer.debug = true;
    // controller.moveTo(0, -10);
    // assert.strictEqual(
    //     events.shift(),
    //     'mouseOut.1.0',
    //     'mousemove to 10px above 0.1: mouseOut fired on series[1].points[0]'
    // );
    // assert.strictEqual(
    //     events.shift(),
    //     'mouseOut.1.-',
    //     'mousemove to 10px above 0.1: mouseOut fired on series[1]'
    // );
    // assert.strictEqual(
    //     events.shift(),
    //     'mouseOver.0.-',
    //     'mousemove to 10px above 0.1: mouseOver fired on series[0]'
    // );
    // assert.strictEqual(
    //     events.shift(),
    //     'mouseOver.0.1',
    //     'mousemove to 10px above 0.1: mouseOver fired on series[0].points[1].'
    // );
    // assert.strictEqual(
    //     events.length,
    //     0,
    //     'mousemove to 10px above 0.1: no unexpected events'
    // );
    // assert.strictEqual(
    //     pointer.isDirectTouch,
    //     false,
    //     'mousemove to 10px above 0.1: not a direct touch.'
    // );
});

QUnit.test('Pointer.getHoverData', function (assert) {
    var events = [],
        isNumber = Highcharts.isNumber,
        merge = Highcharts.merge,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        config = {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true, // Force kd tree to run synchronously.
                    events: {
                        mouseOver: function () {
                            var series = this;
                            pushEvent('mouseOver', series);
                        },
                        mouseOut: function () {
                            var series = this;
                            pushEvent('mouseOut', series);
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOver', series, point);
                            },
                            mouseOut: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOut', series, point);
                            }
                        }
                    }
                }
            }
        };
    // Create the chart
    var options = {
            chart: merge(config.chart, {
                type: 'column'
            }),
            plotOptions: merge(config.plotOptions, {
                series: {
                    stacking: 'normal'
                }
            }),
            tooltip: {
                shared: true
            },
            series: [{
                data: [1, 1, 1, 1, 1]
            }, {
                data: [5, 1, 1, 1, 1]
            }, {
                data: [1, 1, 1, 1, 1]
            }]
        },
        data,
        find = Highcharts.find,
        chart = Highcharts.chart('container', options),
        series = chart.series[2],
        point = series.points[0],
        scatterSeries,
        xAxis = series.xAxis,
        yAxis = series.yAxis;

    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'isDirectTouch && shared: hoverPoint should equal existing hoverPoint'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'isDirectTouch && shared: hoverSeries should equal existing hoverSeries'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        chart.series.length,
        'isDirectTouch && shared: one point hovered per series'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        'isDirectTouch && shared: All hoverPoints should have the same index as the hoverPoint'
    );

    // isDirectTouch and !shared tooltip
    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        false, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'isDirectTouch && !shared: hoverPoint should equal existing hoverPoint'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'isDirectTouch && !shared: hoverSeries should equal existing hoverSeries'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        1,
        'isDirectTouch && !shared: there should be only 1 hoverPoint'
    );

    scatterSeries = chart.addSeries({
        type: 'scatter',
        data: [5, 2, 8, 1, 5]
    });
    series = chart.series[2];
    point = series.points[2];
    // !isDirectTouch and shared tooltip
    data = chart.pointer.getHoverData(
        false, // existingHoverPoint
        false, // existingHoverSeries
        chart.series, // series
        false, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX + (point.pointWidth / 2) + 10,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        '!isDirectTouch && shared: hoverPoint should be series[2].points[2]'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        '!isDirectTouch && shared: hoverSeries should be series[2]'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        chart.series.length - 1,
        '!isDirectTouch && shared: one point hovered per series, except from series with noSharedTooltip'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.series === scatterSeries;
        }),
        false,
        '!isDirectTouch && shared: series with noSharedTooltip should not be included.'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        '!isDirectTouch && shared: All hoverPoints should have the same index as the hoverPoint'
    );


    // Allow scatter series in shared tooltip
    scatterSeries.remove();
    Highcharts.seriesTypes.scatter.prototype.noSharedTooltip = false;
    scatterSeries = chart.addSeries({
        type: 'scatter',
        data: [5, 2, 8, 1, 5]
    });
    // scatterSeries.noSharedTooltip = false;
    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'Allow scatter series in shared tooltip: hoverPoint should be series[2].points[2]'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'Allow scatter series in shared tooltip: hoverSeries should be series[2]'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        chart.series.length,
        'Allow scatter series in shared tooltip: one point hovered per series'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.series === scatterSeries;
        }),
        true,
        'Allow scatter series in shared tooltip: one point from the scatter series'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        'Allow scatter series in shared tooltip: All hoverPoints should have the same index as the hoverPoint'
    );

    // Reset, avoid breaking tests downstream
    Highcharts.seriesTypes.scatter.prototype.noSharedTooltip = true;

    // Combination chart
    series = chart.addSeries({
        type: 'pie',
        data: [5, 2, 8, 1, 5]
    });
    point = series.points[0];
    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'Combination chart: hoverPoint should be series[5].points[0]'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'Combination chart: hoverSeries should be series[5]'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        1,
        'Combination chart: Only one point hovered when hovered series has noSharedTooltip'
    );
});
