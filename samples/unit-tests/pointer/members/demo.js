/* global TestController */
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
QUnit.test('Pointer.runPointActions. stickyTracking: true (default). #5914', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: config.chart,
            plotOptions: config.plotOptions,
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }]
        }),
        controller = new TestController(chart),
        el = chart.series[0].points[0].graphic.element;
    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    // Move starting position of cursor to 50px below series[0].points[0].
    controller.setPositionToElement(el, 0, 50);
    controller.moveToElement(el);
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
    controller.setPositionToElement(el);
    el = chart.series[1].points[0].graphic.element;
    controller.moveToElement(el, 0, 30);
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
    el = chart.series[1].points[0].graphic.element;
    controller.setPositionToElement(el);
    el = chart.series[1].points[2].graphic.element;
    controller.moveToElement(el);
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
    controller.setPositionToElement(el);
    controller.moveToElement(el, 0, 30);
    assert.strictEqual(
        events.length,
        0,
        'mousemove to 30px below 1.2: no unexpected events'
    );
});

QUnit.test('Pointer.runPointActions. stickyTracking: false. #5914', function (assert) {
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
        controller = new TestController(chart),
        el = chart.series[1].points[0].graphic.element;
    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    controller.setPositionToElement(el, 0, snap + 25);
    controller.moveToElement(el, 0, snap + 15);
    assert.strictEqual(
        events.length,
        0,
        'stickyTracking: false. moveTo 15px below 1.0: no unexpected events'
    );

    controller.setPositionToElement(el, 0, snap + 15);
    controller.moveToElement(el, 0, snap - 5);
    // With Edge the Series.onMouseOver executed after all mousemoves are complete.
    controller.triggerOnElement(el, 'mousemove', 0, snap - 5);
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
        el = point.graphic.element,
        controller = new TestController(chart);
    events = []; // Destruction of previous chart, does a mouse out on its hoverPoint.
    controller.setPositionToElement(el, 0, -50);
    controller.moveToElement(el);
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
    el = point.graphic.element;
    controller.moveToElement(el, 0, 40);
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

    controller.moveToElement(el);
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

QUnit.test('Pointer.getHoverData', function (assert) {
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
});
