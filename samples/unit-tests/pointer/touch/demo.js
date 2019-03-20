

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

QUnit.test('followPointer and followTouchMove', function (assert) {



    var chart;


    function swipe() {
        var offset = Highcharts.offset(chart.container),
            points = chart.series[0].points;

        // Swipe across the plot area
        if (!chart.options.tooltip.shared) {
            points[0].onMouseOver();
        }
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [{
                pageX: offset.left + chart.plotLeft + points[0].shapeArgs.x + points[0].shapeArgs.width / 2,
                pageY: offset.top + chart.plotTop + chart.plotHeight - 10
            }],
            preventDefault: function () {},
            target: points[0].graphic.element
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [{
                pageX: offset.left + chart.plotLeft + points[2].shapeArgs.x + points[2].shapeArgs.width / 2,
                pageY: offset.top + chart.plotTop + chart.plotHeight - 10
            }],
            preventDefault: function () {},
            target: points[2].graphic.element
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [{
                pageX: offset.left + chart.plotLeft + points[2].shapeArgs.x + points[2].shapeArgs.width / 2,
                pageY: offset.top + chart.plotTop + chart.plotHeight - 10
            }]
        });

    }

    Array.prototype.item = function (i) { // eslint-disable-line no-extend-native
        return this[i];
    };

    chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        series: [{
            data: [1, 4, 3, 5],
            pointPadding: 0,
            groupPadding: 0,
            type: 'column'
        }]
    });
    swipe();

    assert.close(
        chart.tooltip.label.translateY + chart.tooltip.label.getBBox().height,
        chart.plotTop + chart.series[0].points[2].plotY,
        10,
        'followPointer is false, followTouchMove is true by default, the tooltip should stay next to the top of Bananas'
    );
    assert.ok(
        chart.tooltip.label.translateX > chart.plotLeft + chart.series[0].points[2].shapeArgs.x,
        'The tooltip should be above Bananas'
    );
    assert.notEqual(
        chart.tooltip.label.element.textContent.indexOf('Bananas'),
        -1,
        'The tooltip should show Bananas'
    );

    chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        tooltip: {
            followTouchMove: false
        },
        series: [{
            data: [1, 4, 3, 5],
            pointPadding: 0,
            groupPadding: 0,
            type: 'column'
        }]
    });
    swipe();

    assert.close(
        chart.tooltip.label.translateY + chart.tooltip.label.getBBox().height,
        chart.plotTop + chart.series[0].points[0].plotY,
        10,
        'followPointer is false, followTouchMove is false, the tooltip should stay next to Apples'
    );
    assert.ok(
        chart.tooltip.label.translateX < chart.plotLeft + chart.series[0].points[2].shapeArgs.x,
        'The tooltip should be above Apples'
    );
    assert.notEqual(
        chart.tooltip.label.element.textContent.indexOf('Apples'),
        -1,
        'The tooltip should show Apples'
    );

    chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        series: [{
            data: [1, 4, 3, 5],
            pointPadding: 0,
            groupPadding: 0,
            type: 'column',
            tooltip: {
                followPointer: true
            }
        }]
    });
    swipe();

    assert.close(
        chart.tooltip.label.translateY + chart.tooltip.label.getBBox().height,
        chart.plotTop + chart.plotHeight - 10,
        10,
        'followPointer is true, followTouchMove is true by default, the tooltip should stay next to the touch'
    );
    assert.ok(
        chart.tooltip.label.translateX > chart.plotLeft + chart.series[0].points[2].shapeArgs.x,
        'The tooltip should be above Bananas'
    );
    assert.notEqual(
        chart.tooltip.label.element.textContent.indexOf('Bananas'),
        -1,
        'The tooltip should show Bananas'
    );


    chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        tooltip: {
            followTouchMove: false
        },
        series: [{
            data: [1, 4, 3, 5],
            pointPadding: 0,
            groupPadding: 0,
            type: 'column',
            tooltip: {
                followPointer: true
            }
        }]
    });
    swipe();

    assert.close(
        chart.tooltip.label.translateY + chart.tooltip.label.getBBox().height,
        chart.plotTop + chart.plotHeight - 10,
        10,
        'followPointer is true, followTouchMove is false, the tooltip should stay next to the touch'
    );
    assert.ok(
        chart.tooltip.label.translateX < chart.plotLeft + chart.series[0].points[2].shapeArgs.x,
        'The tooltip should be above Apples'
    );
    assert.notEqual(
        chart.tooltip.label.element.textContent.indexOf('Apples'),
        -1,
        'The tooltip should show Apples'
    );
});
