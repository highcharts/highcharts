$(function () {
    QUnit.test('Pan or scroll to X axis max', function (assert) {
        var chart = $('#container').highcharts('StockChart', {
            rangeSelector : {
                selected : 1
            },
            series: [{
                data: Highcharts.map(new Array(366), function (undef, i) {
                    return i;
                }),
                pointStart: Date.UTC(2015, 0, 1),
                pointInterval: 24 * 36e5
            }]
        }).highcharts();

        document.body.insertBefore(chart.renderTo, document.body.childNodes[0]);
        chart.renderTo.style.margin = 0;

        // Grab the left handle
        chart.scroller.mouseDownHandler({
            type: 'mousedown',
            pageX: 700,
            pageY: 250
        });

        // Drag it to the left
        chart.scroller.mouseMoveHandler({
            type: 'mousemove',
            pageX: 600,
            pageY: 250
        });

        // Drag it all the way to the right
        chart.scroller.mouseMoveHandler({
            type: 'mousemove',
            pageX: 750,
            pageY: 250
        });

        // Drop
        chart.scroller.mouseUpHandler({
            type: 'mouseup'
        });


        assert.strictEqual(
            chart.xAxis[0].max,
            chart.xAxis[0].dataMax,
            'Scrolled to max'
        );


        // Pan
        chart.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: 500,
            pageY: 150
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 700,
            pageY: 150
        });
        chart.pointer.onDocumentMouseUp({});


        assert.ok(
            chart.xAxis[0].max < chart.xAxis[0].dataMax,
            'Panned left'
        );

        // Pan
        chart.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: 700,
            pageY: 150
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 300,
            pageY: 150
        });
        chart.pointer.onDocumentMouseUp({});


        assert.ok(
            chart.xAxis[0].max === chart.xAxis[0].dataMax,
            'Panned to max'
        );


    });
});