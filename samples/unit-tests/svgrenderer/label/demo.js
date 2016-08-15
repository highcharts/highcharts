QUnit.test('New label with rect symbol (#5324)', function (assert) {
    var renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        600,
        400
    );

    var label = renderer.label('Max observation', 270, 50, 'rect', 100, 100)
        .css({
            color: '#FFFFFF'
        })
        .attr({
            fill: 'rgba(0, 0, 0, 0.75)',
            padding: 8,
            r: 5,
            zIndex: 6
        })
        .add();

    assert.strictEqual(
        label.element.textContent,
        'Max observation',
        'Element exists'
    );
});
