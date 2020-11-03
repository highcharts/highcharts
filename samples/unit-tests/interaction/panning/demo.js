QUnit.test('#14426: Vertical panning after zooming', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            zoomType: 'xy',
            panKey: 'shift',
            panning: {
                enabled: true,
                type: 'xy'
            }
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [{
                name: "A",
                y: 1.2
            }, {
                name: "B",
                y: 4.02
            }, {
                name: "C",
                y: 1.92
            }]
        }]
    });

    const offset = Highcharts.offset(chart.container);

    // Zoom
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 250 + offset.left,
        pageY: 50 + offset.top,
        target: chart.container
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 400 + offset.left,
        pageY: 300 + offset.top,
        target: chart.container
    });
    chart.pointer.onDocumentMouseUp({});

    // Pan
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 250 + offset.left,
        pageY: 300 + offset.top,
        target: chart.container,
        shiftKey: true
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 250 + offset.left,
        pageY: 50 + offset.top,
        target: chart.container,
        shiftKey: true
    });
    chart.pointer.onDocumentMouseUp({});

    assert.strictEqual(chart.yAxis[0].min, 0, 'It should be possible to pan to 0 vertically');
});