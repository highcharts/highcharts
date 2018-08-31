

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
        events,
        pushEvent = function (type) {
            events.push(type);
        },
        methods = [
            'onContainerTouchStart',
            'onContainerTouchMove',
            'onDocumentTouchEnd',
            'pinch',
            'touch'
        ],
        backups = {};

    // Allow the wrapped event handler to be registered
    if (Highcharts.unbindDocumentTouchEnd) {
        Highcharts.unbindDocumentTouchEnd = Highcharts.unbindDocumentTouchEnd();
    }

    // Listen to internal functions
    methods.forEach(function (fn) {
        backups[fn] = Highcharts.Pointer.prototype[fn];
        Highcharts.wrap(Highcharts.Pointer.prototype, fn, function (proceed) {
            pushEvent(fn);
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        });
    });
    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 200
        },
        series: [{
            data: [1]
        }]
    });
    Highcharts.hoverChartIndex = chart.index;
    controller = new TestController(chart);
    events = [];

    controller.tap(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY
    );
    if (
        window.document.documentElement.ontouchstart !== undefined ||
        window.PointerEvent ||
        window.MSPointerEvent
    ) {
        assert.strictEqual(
            events.join(','),
            'onContainerTouchStart,touch,pinch,onDocumentTouchEnd',
            'Tap on point 0.0: Correct order of events'
        );
    } else {
        assert.strictEqual(
            events.length,
            0,
            'This browser does not support touch.'
        );
    }

    // Restore original functions
    methods.forEach(function (fn) {
        Highcharts.Pointer.prototype[fn] = backups[fn];
    });

    // Allow the original event handler to be re-registered
    if (Highcharts.unbindDocumentTouchEnd) {
        Highcharts.unbindDocumentTouchEnd = Highcharts.unbindDocumentTouchEnd();
    }
});
