QUnit.test('Get SVG', function (assert) {
    var chart = Highcharts.charts[0],
        svg = chart.getSVG();

    assert.strictEqual(
        typeof svg,
        'string',
        'SVG is string'
    );

    assert.strictEqual(
        svg.indexOf('<svg '),
        0,
        'Starts correctly'
    );

    assert.strictEqual(
        svg.indexOf('</svg>'),
        svg.length - 6,
        'Ends correctly'
    );

    assert.strictEqual(
        svg.length > 1000,
        true,
        'Has some content'
    );

});