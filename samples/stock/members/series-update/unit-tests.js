QUnit.test('Series.update', function (assert) {

    var chart = Highcharts.charts[0],
        data;

    function lastPoint() {
        return chart.series[0].points[chart.series[0].points.length - 1];
    }

    // Add reliable data for the test
    data = [
        [1223337600000,14.35,14.50,12.71,12.74],
        [1223424000000,12.27,13.76,12.24,12.83],
        [1223510400000,13.34,13.69,12.37,12.68],
        [1223596800000,12.20,14.30,12.10,13.80],
        [1223856000000,14.94,15.79,14.43,15.75],
        [1223942400000,16.61,16.63,14.73,14.87],
        [1224028800000,14.83,15.29,13.98,13.99],
        [1224115200000,14.25,14.78,13.11,14.56],
        [1224201600000,14.23,14.58,12.27,13.91],
        [1224460800000,14.25,14.29,13.38,14.06],
        [1224547200000,13.85,13.99,13.02,13.07],
        [1224633600000,13.91,14.46,13.28,13.84],
        [1224720000000,13.79,14.18,13.13,14.03],
        [1224806400000,12.90,13.99,12.87,13.77],
        [1225065600000,13.58,13.95,13.12,13.16],
        [1225152000000,13.63,14.36,13.20,14.27],
        [1225238400000,14.41,15.65,14.28,14.94],
        [1225324800000,15.46,16.03,15.37,15.86],
        [1225411200000,15.34,15.83,14.02,14.37]
    ];
    data = Highcharts.map(data, function (config) {
        return {
            x: config[0],
            open: config[1],
            high: config[2],
            low: config[3],
            close: config[4],
            y: config[4] // let the closing value represent the data in single-value series
        };
    });
    chart.series[0].setData(data);

    // Markers
    assert.strictEqual(
        lastPoint().graphic,
        undefined,
        'Markers initial'
    );

    $('#markers').click();

    assert.strictEqual(
        lastPoint().graphic.element.nodeName,
        'path',
        'Markers changed'
    );


    // Color
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('stroke'),
        Highcharts.getOptions().colors[0],
        'Color initial'
    );

    $('#color').click();

    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('stroke'),
        Highcharts.getOptions().colors[1],
        'Color changed - graph'
    );
    assert.strictEqual(
        lastPoint().graphic.element.getAttribute('fill'),
        Highcharts.getOptions().colors[1],
        'Color changed - marker'
    );

    // Type line
    $('#line').click();
    assert.strictEqual(
        chart.series[0].type,
        'line',
        'Line type'
    );
    assert.strictEqual(
        lastPoint().graphic.symbolName,
        'circle',
        'Line point'
    );

    // Type spline
    $('#spline').click();
    assert.strictEqual(
        chart.series[0].type,
        'spline',
        'Spline type'
    );
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').indexOf('C') !== -1, // has curved path
        true,
        'Curved path'
    );

    // Type area
    $('#area').click();
    assert.strictEqual(
        chart.series[0].type,
        'area',
        'Area type'
    );
    assert.strictEqual(
        chart.series[0].area.element.nodeName,
        'path',
        'Has area'
    );

    // Type areaspline
    $('#areaspline').click();
    assert.strictEqual(
        chart.series[0].type,
        'areaspline',
        'Areaspline type'
    );
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').indexOf('C') !== -1, // has curved path
        true,
        'Curved path'
    );
    assert.strictEqual(
        chart.series[0].area.element.nodeName,
        'path',
        'Has area'
    );

    // Type arearange
    $('#arearange').click();
    assert.strictEqual(
        chart.series[0].type,
        'arearange',
        'Arearange type'
    );
    assert.strictEqual(
        chart.series[0].area.element.nodeName,
        'path',
        'Has area'
    );

    // Type columnrange
    $('#columnrange').click();
    assert.strictEqual(
        chart.series[0].type,
        'columnrange',
        'Columnrange type'
    );
    assert.strictEqual(
        chart.series[0].area,
        undefined,
        'No area'
    );
    assert.strictEqual(
        lastPoint().graphic.element.nodeName,
        'rect',
        'Has column'
    );

    // Type ohlc
    $('#ohlc').click();
    assert.strictEqual(
        chart.series[0].type,
        'ohlc',
        'OHLC type'
    );
    assert.strictEqual(
        chart.series[0].graph,
        undefined,
        'No graph'
    );
    assert.strictEqual(
        lastPoint().graphic.element.nodeName,
        'path',
        'Has path points'
    );

    // Type candlestick
    $('#candlestick').click();
    assert.strictEqual(
        chart.series[0].type,
        'candlestick',
        'Candlestick type'
    );
    assert.strictEqual(
        lastPoint().graphic.element.getAttribute('fill'),
        Highcharts.getOptions().colors[1],
        'Filled last point'
    );



});