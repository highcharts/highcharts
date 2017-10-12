(function () {
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
            touches: [{
                pageX: 100 + offset.left,
                pageY: 100 + offset.top
            }],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [{
                pageX: 200 + offset.left,
                pageY: 100 + offset.top
            }],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [{
                pageX: 200 + offset.left,
                pageY: 100 + offset.top
            }]
        });
    }

    function dualTouchZoom(chart) {

        var offset = Highcharts.offset(chart.container);

        // Perform dual touch zoom
        chart.pointer.onContainerTouchStart({
            type: 'touchstart',
            touches: [{
                pageX: 200 + offset.left,
                pageY: 100 + offset.top
            }, {
                pageX: 300 + offset.left,
                pageY: 100 + offset.top
            }],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [{
                pageX: 150 + offset.left,
                pageY: 100 + offset.top
            }, {
                pageX: 350 + offset.left,
                pageY: 100 + offset.top
            }],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [{
                pageX: 150 + offset.left,
                pageY: 100 + offset.top
            }, {
                pageX: 350 + offset.left,
                pageY: 100 + offset.top
            }]
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
            touches: [{
                pageX: 200 + offset.left,
                pageY: 100 + offset.top
            }, {
                pageX: 300 + offset.left,
                pageY: 100 + offset.top
            }],
            preventDefault: function () {}
        });

        chart.pointer.onContainerTouchMove({
            type: 'touchmove',
            touches: [{
                pageX: 100 + offset.left,
                pageY: 100 + offset.top
            }, {
                pageX: 200 + offset.left,
                pageY: 100 + offset.top
            }],
            preventDefault: function () {}
        });

        chart.pointer.onDocumentTouchEnd({
            type: 'touchend',
            touches: [{
                pageX: 100 + offset.left,
                pageY: 100 + offset.top
            }, {
                pageX: 200 + offset.left,
                pageY: 100 + offset.top
            }]
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

    Array.prototype.item = function (i) { // eslint-disable-line no-extend-native
        return this[i];
    };


    QUnit.test('pinchType on, followTouchMove is true', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                pinchType: 'x',
                animation: false,
                width: 600
            },
            tooltip: {
                followTouchMove: true
            },
            series: [{
                animation: false,
                data: getData(),
                kdNow: true
            }]
        });

        var xAxis = chart.xAxis[0],
            initialExtremes = xAxis.getExtremes();

        assert.ok(
            xAxis.min <= 0,
            'Initial min'
        );

        assert.ok(
            xAxis.max >= 1000,
            'Initial max'
        );


        singleTouchDrag(chart);
        assert.deepEqual(
            xAxis.getExtremes(),
            initialExtremes,
            'Extremes have not changed'
        );


        dualTouchZoom(chart);
        assert.ok(
            xAxis.min > 100,
            'Zoomed in'
        );
        assert.ok(
            xAxis.max < 900,
            'Zoomed in'
        );



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
                pinchType: 'x',
                animation: false,
                width: 600
            },
            tooltip: {
                followTouchMove: false
            },
            series: [{
                animation: false,
                data: getData(),
                kdNow: true
            }]
        });

        var xAxis = chart.xAxis[0];

        assert.ok(
            xAxis.min <= 0,
            'Initial min'
        );

        assert.ok(
            xAxis.max >= 1000,
            'Initial max'
        );

        dualTouchZoom(chart);
        var initialExtremes = [xAxis.min, xAxis.max].toString();


        singleTouchDrag(chart);
        assert.notEqual(
            [xAxis.min, xAxis.max].toString(),
            initialExtremes,
            'Extremes have changed'
        );
    });



    QUnit.test('pinchType is on, zoomType is off (#5840)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                pinchType: 'x',
                zoomType: '',
                animation: false,
                width: 600
            },
            series: [{
                animation: false,
                data: getData(),
                kdNow: true
            }],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        var xAxis = chart.xAxis[0];

        mouseZoom(chart);
        assert.strictEqual(
            xAxis.min,
            0,
            'Unaltered min'
        );
        assert.strictEqual(
            xAxis.max,
            999,
            'Unaltered max'
        );

        dualTouchZoom(chart);
        assert.notEqual(
            xAxis.min,
            0,
            'Altered min'
        );
        assert.notEqual(
            xAxis.max,
            999,
            'Altered max'
        );
    });




    QUnit.test('pinchType is off, zoomType is on', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                pinchType: '',
                zoomType: 'x',
                animation: false,
                width: 600
            },
            series: [{
                animation: false,
                data: getData(),
                kdNow: true
            }],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        var xAxis = chart.xAxis[0];

        dualTouchZoom(chart);
        assert.strictEqual(
            xAxis.min,
            0,
            'Unaltered min'
        );
        assert.strictEqual(
            xAxis.max,
            999,
            'Unaltered max'
        );

        mouseZoom(chart);
        assert.notEqual(
            xAxis.min,
            0,
            'Altered min'
        );
        assert.notEqual(
            xAxis.max,
            999,
            'Altered max'
        );
    });



    QUnit.test('zoomType is on, pinchType inherited', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'x',
                animation: false,
                width: 600
            },
            series: [{
                animation: false,
                data: getData(),
                kdNow: true
            }],
            xAxis: {
                minPadding: 0,
                maxPadding: 0
            }
        });

        var xAxis = chart.xAxis[0];

        dualTouchZoom(chart);
        assert.notEqual(
            xAxis.min,
            0,
            'Altered min'
        );
        assert.notEqual(
            xAxis.max,
            999,
            'Altered max'
        );
    });
}());
