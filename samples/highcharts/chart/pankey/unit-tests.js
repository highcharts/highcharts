QUnit.test('Zoom and pan key', function (assert) {

    var chart = Highcharts.charts[0],
        offset,
        firstZoom = {};

    chart.setSize(600, 300);
    offset = $(chart.container).offset();


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
        pageX: offset.left + 200,
        pageY: offset.top + 150,
        target: chart.container
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: offset.left + 250,
        pageY: offset.top + 150,
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

    offset = $(chart.container).offset();

    // Pan
    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: offset.left + 200,
        pageY: offset.top + 100,
        target: chart.container,
        shiftKey: true
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: offset.left + 150,
        pageY: offset.top + 100,
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
        chart.xAxis[0].max - chart.xAxis[0].min,
        firstZoom.max - firstZoom.min,
        'Has preserved range'
    );




});