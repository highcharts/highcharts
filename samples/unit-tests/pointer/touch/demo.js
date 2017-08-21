

QUnit.test('Single touch drag should not zoom (#5790)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'xy',
            animation: false
        },
        series: [{
            type: 'line',
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            animation: false
        }]
    });
    var offset = Highcharts.offset(chart.container);

    Array.prototype.item = function (i) { // eslint-disable-line no-extend-native
        return this[i];
    };

    // Swipe across the plot area
    chart.pointer.onContainerTouchStart({
        type: 'touchstart',
        touches: [{
            pageX: offset.left + 100,
            pageY: offset.top + 100
        }],
        preventDefault: function () {}
    });

    chart.pointer.onContainerTouchMove({
        type: 'touchmove',
        touches: [{
            pageX: offset.left + 200,
            pageY: offset.top + 100
        }],
        preventDefault: function () {}
    });

    chart.pointer.onDocumentTouchEnd({
        type: 'touchend',
        touches: [{
            pageX: offset.left + 200,
            pageY: offset.top + 100
        }]
    });


    assert.strictEqual(
        typeof chart.resetZoomButton,
        'undefined',
        'Zoom button not created'
    );
});

/* global TestController */
QUnit.test('TouchPointer events', function (assert) {
    var chart,
        controller,
        el,
        events,
        pushEvent = function (type) {
            events.push(type);
        };
    // Listen to internal functions
    [
        'onContainerTouchStart',
        'onContainerTouchMove',
        'onDocumentTouchEnd',
        'pinch',
        'touch'
    ].forEach(function (fn) {
        Highcharts.wrap(Highcharts.Pointer.prototype, fn, function (proceed) {
            pushEvent(fn);
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        });
    });
    chart = Highcharts.chart('container', {
        series: [{
            data: [1]
        }]
    });
    Highcharts.hoverChartIndex = chart.index;
    controller = new TestController(chart);
    el = chart.series[0].points[0].graphic.element;
    events = [];

    controller.tapOnElement(el);
    if (
        window.document.documentElement.ontouchstart !== undefined ||
        window.PointerEvent ||
        window.MSPointerEvent
    ) {
        assert.strictEqual(
            events.shift(),
            'onContainerTouchStart',
            'Tap on point 0.0: onContainerTouchStart'
        );
        assert.strictEqual(
            events.shift(),
            'touch',
            'Tap on point 0.0: touch'
        );
        assert.strictEqual(
            events.shift(),
            'pinch',
            'Tap on point 0.0: pinch'
        );
        assert.strictEqual(
            events.shift(),
            'onDocumentTouchEnd',
            'Tap on point 0.0: onDocumentTouchEnd'
        );
        assert.strictEqual(
            events.length,
            0,
            'Tap on point 0.0: no unexpected events'
        );
    } else {
        assert.strictEqual(
            events.length,
            0,
            'This browser does not support touch.'
        );
    }
});
