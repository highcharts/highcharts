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
        chart = Highcharts.chart('container', {
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
            },
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }]
        }),
        controller = new TestController(chart),
        el = chart.series[0].points[0].graphic.element;

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
    var events = [],
        isNumber = Highcharts.isNumber,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        chart = Highcharts.chart('container', {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    stickyTracking: false,
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
            },
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }]
        }),
        snap = chart.options.tooltip.snap,
        controller = new TestController(chart),
        el = chart.series[1].points[0].graphic.element;

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
