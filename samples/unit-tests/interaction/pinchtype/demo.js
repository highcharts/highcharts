(function () {
    /* eslint no-extend-native: 0 */
    function getData() {
        var arr = [];
        for (var i = 0; i < 1000; i++) {
            arr.push(i);
        }
        return arr;
    }

    function singleTouchDrag(chart) {
        var offset = Highcharts.offset(chart.container);

        // Perform single touch-drag
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [
                {
                    pageX: 100 + offset.left,
                    pageY: 100 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                }
            ]
        });
    }

    function dualTouchZoom(chart) {
        var offset = Highcharts.offset(chart.container);

        // Perform dual touch zoom
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                },
                {
                    pageX: 300 + offset.left,
                    pageY: 150 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [
                {
                    pageX: 150 + offset.left,
                    pageY: 80 + offset.top
                },
                {
                    pageX: 350 + offset.left,
                    pageY: 170 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [
                {
                    pageX: 150 + offset.left,
                    pageY: 80 + offset.top
                },
                {
                    pageX: 350 + offset.left,
                    pageY: 170 + offset.top
                }
            ]
        });
    }

    /**
     * Pan the chart by touching two fingers and moving to the left, without
     * pinching.
     */
    function dualTouchPan(chart) {
        var offset = Highcharts.offset(chart.container);

        // Perform dual touch zoom
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                },
                {
                    pageX: 300 + offset.left,
                    pageY: 100 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [
                {
                    pageX: 100 + offset.left,
                    pageY: 100 + offset.top
                },
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                }
            ],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [
                {
                    pageX: 100 + offset.left,
                    pageY: 100 + offset.top
                },
                {
                    pageX: 200 + offset.left,
                    pageY: 100 + offset.top
                }
            ]
        });
    }

    function mouseZoom(chart) {
        var offset = Highcharts.offset(chart.container);

        // Perform single touch-drag
        chart.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: 100 + offset.left,
            pageY: 100 + offset.top
        });

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 200 + offset.left,
            pageY: 100 + offset.top
        });

        chart.pointer.onDocumentMouseUp({
            type: 'mouseup'
        });
    }

    Array.prototype.item = function (i) {
        // eslint-disable-line no-extend-native
        return this[i];
    };

    QUnit.test('pinchType on, followTouchMove is true', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    pinchType: 'x'
                },
                animation: false,
                width: 600
            },
            tooltip: {
                followTouchMove: true
            },
            series: [
                {
                    animation: false,
                    data: getData(),
                    kdNow: true
                }
            ]
        });

        var xAxis = chart.xAxis[0],
            initialExtremes = xAxis.getExtremes();

        assert.ok(xAxis.min <= 0, 'Initial min');

        assert.ok(xAxis.max >= 1000, 'Initial max');

        singleTouchDrag(chart);
        assert.deepEqual(
            xAxis.getExtremes(),
            initialExtremes,
            'Extremes have not changed'
        );

        dualTouchZoom(chart);
        assert.ok(xAxis.min > 100, 'Zoomed in');
        assert.ok(xAxis.max < 900, 'Zoomed in');

        var lastMin = xAxis.min,
            lastMax = xAxis.max;
        dualTouchPan(chart);

        assert.notEqual(
            [lastMin, lastMax].toString(),
            [xAxis.min, xAxis.max].toString(),
            'Chart has dragged'
        );
    });

    QUnit.test('pinchType on, followTouchMove is false', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    pinchType: 'x'
                },
                animation: false,
                width: 600
            },
            tooltip: {
                followTouchMove: false
            },
            series: [
                {
                    animation: false,
                    data: getData(),
                    kdNow: true
                }
            ],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        const xAxis = chart.xAxis[0],
            initialRange = xAxis.max - xAxis.min;

        assert.ok(xAxis.min <= 0, 'Initial min');

        assert.ok(xAxis.max >= 999, 'Initial max');

        singleTouchDrag(chart);

        assert.close(
            xAxis.max - xAxis.min,
            initialRange,
            0.5,
            'The range should be preserved during a single touch pan'
        );

        dualTouchZoom(chart);
        const initialExtremes = [xAxis.min, xAxis.max].toString();

        singleTouchDrag(chart);
        assert.notEqual(
            [xAxis.min, xAxis.max].toString(),
            initialExtremes,
            'Extremes should change after single-panning a zoomed chart'
        );
    });

    QUnit.test('pinchType is on, zoomType is off (#5840)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    pinchType: 'x',
                    type: ''
                },
                animation: false,
                width: 600
            },
            series: [
                {
                    animation: false,
                    data: getData(),
                    kdNow: true
                }
            ],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        var xAxis = chart.xAxis[0];

        mouseZoom(chart);
        assert.strictEqual(xAxis.min, 0, 'Unaltered min');
        assert.strictEqual(xAxis.max, 999, 'Unaltered max');

        dualTouchZoom(chart);
        assert.notEqual(xAxis.min, 0, 'Altered min');
        assert.notEqual(xAxis.max, 999, 'Altered max');
    });

    QUnit.test('pinchType is off, zoomType is on', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    pinchType: '',
                    type: 'x'
                },
                animation: false,
                width: 600
            },
            series: [
                {
                    animation: false,
                    data: getData(),
                    kdNow: true
                }
            ],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        var xAxis = chart.xAxis[0];

        dualTouchZoom(chart);
        assert.strictEqual(xAxis.min, 0, 'Unaltered min');
        assert.strictEqual(xAxis.max, 999, 'Unaltered max');

        mouseZoom(chart);
        assert.notEqual(xAxis.min, 0, 'Altered min');
        assert.notEqual(xAxis.max, 999, 'Altered max');
    });

    QUnit.test('zoomType is on, pinchType inherited', function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    type: 'xy'
                },
                animation: false,
                width: 600
            },
            series: [
                {
                    animation: false,
                    data: getData(),
                    kdNow: true
                }
            ],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        const xAxis = chart.xAxis[0],
            yAxis = chart.yAxis[0];

        dualTouchZoom(chart);
        assert.notEqual(xAxis.min, 0, 'Altered min');
        assert.notEqual(xAxis.max, 999, 'Altered max');

        assert.ok(
            yAxis.tickPositions.includes(yAxis.min),
            'The y-axis should start on a tick after touch-zooming'
        );
        assert.ok(
            yAxis.tickPositions.includes(yAxis.max),
            'The y-axis should end on a tick after touch-zooming'
        );
    });

    QUnit.test('zoomBySingleTouch is true', assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                zooming: {
                    type: 'x'
                },
                animation: false,
                width: 600
            },
            series: [
                {
                    animation: false,
                    data: getData(),
                    kdNow: true
                }
            ]
        });

        var xAxis = chart.xAxis[0];

        assert.ok(xAxis.min <= 0, 'Initial min');

        assert.ok(xAxis.max >= 1000, 'Initial max');

        var initialExtremes = [xAxis.min, xAxis.max];

        singleTouchDrag(chart);
        assert.deepEqual(
            [xAxis.min, xAxis.max],
            initialExtremes,
            'Extremes should not change after single touch'
        );

        chart.update({
            chart: {
                zooming: {
                    singleTouch: true
                }
            }
        });
        singleTouchDrag(chart);
        assert.notDeepEqual(
            [xAxis.min, xAxis.max],
            initialExtremes,
            'Extremes should change after single touch zoom'
        );
    });
}());
