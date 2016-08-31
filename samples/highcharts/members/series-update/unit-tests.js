QUnit.test('Series.update', function (assert) {

    var chart = Highcharts.charts[0];

    assert.strictEqual(
        chart.series[0].legendItem.element.textContent,
        'Series 1',
        'Name enitial'
    );

    $('#name').click();

    assert.strictEqual(
        chart.series[0].legendItem.element.textContent,
        'First',
        'Name changed'
    );


    assert.strictEqual(
        chart.series[0].points[0].dataLabel,
        undefined,
        'Data labels initial'
    );

    $('#data-labels').click();

    assert.strictEqual(
        chart.series[0].points[0].dataLabel.element.textContent.substr(0, 4),
        '29.9',
        'Data labels changed'
    );

    // Markers
    assert.strictEqual(
        chart.series[0].points[0].graphic,
        undefined,
        'Markers initial'
    );

    $('#markers').click();

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
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
        chart.series[0].points[0].graphic.element.getAttribute('fill'),
        Highcharts.getOptions().colors[1],
        'Color changed - marker'
    );

    // Type column
    $('#column').click();
    assert.strictEqual(
        chart.series[0].type,
        'column',
        'Column type'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'rect',
        'Column point'
    );

    // Type line
    $('#line').click();
    assert.strictEqual(
        chart.series[0].type,
        'line',
        'Line type'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.symbolName,
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



    // Type scatter
    $('#scatter').click();
    assert.strictEqual(
        chart.series[0].type,
        'scatter',
        'Scatter type'
    );
    assert.strictEqual(
        typeof chart.series[0].graph,
        'undefined',
        'Has no graph'
    );



    // Type pie
    $('#pie').click();
    assert.strictEqual(
        chart.series[0].type,
        'pie',
        'Pie type'
    );
    assert.strictEqual(
        typeof chart.series[0].graph,
        'undefined',
        'Has no graph'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A') !== -1, // has arc
        true,
        'Arced path'
    );
    assert.strictEqual(
        chart.series[0].points[8].sliced,
        true,
        'Sliced slice'
    );

});