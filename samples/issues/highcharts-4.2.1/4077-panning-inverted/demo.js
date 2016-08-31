
$(function () {
    QUnit.test('Panning inverted chart', function (assert) {

        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'bar',
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift',
                    width: 600,
                    height: 400,
                    animation: false
                },

                title: {
                    text: 'Zooming and panning'
                },

                subtitle: {
                    text: 'Click and drag to zoom in. Hold down shift key to pan.'
                },

                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },

                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    animation: false
                }]
            }),
            offset,
            firstZoom = {};

        chart.container.parentNode.style.position = 'absolute';
        chart.container.parentNode.style.top = 0;


        assert.strictEqual(
            chart.xAxis[0].min,
            0,
            'Initial min'
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            11,
            'Initial max'
        );


        // Zoom
        chart.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: 200,
            pageY: 150,
            target: chart.container
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 200,
            pageY: 200,
            target: chart.container
        });
        chart.pointer.onDocumentMouseUp({});

        assert.strictEqual(
            chart.xAxis[0].min > 0,
            true,
            'Zoomed min'
        );
        assert.strictEqual(
            chart.xAxis[0].max < 11,
            true,
            'Zoomed max'
        );

        firstZoom = chart.xAxis[0].getExtremes();

        // Pan
        chart.pointer.onContainerMouseDown({
            type: 'mousedown',
            pageX: 200,
            pageY: 100,
            target: chart.container,
            shiftKey: true
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 200,
            pageY: 50,
            target: chart.container,
            shiftKey: true
        });
        chart.pointer.onDocumentMouseUp({
        });

        assert.strictEqual(
            chart.xAxis[0].min > firstZoom.min,
            true,
            'Has panned'
        );
        assert.strictEqual(
            (chart.xAxis[0].max - chart.xAxis[0].min).toFixed(2),
            (firstZoom.max - firstZoom.min).toFixed(2),
            'Has preserved range'
        );


        chart.container.parentNode.style.position = 'static';

    });
});