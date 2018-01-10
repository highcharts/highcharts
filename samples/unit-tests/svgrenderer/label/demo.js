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

QUnit.test('New label with url symbol (#5635)', function (assert) {
    var renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        600,
        400
    );

    var url = (location.host === 'localhost:9876') ?
        'url(base/utils/samples/testimage.png)' : // karma
        'url(testimage.png)'; // utils

    var label = renderer.label('Max observation', 270, 50, url, 100, 100)
        .attr({
            padding: 8
        })
        .add();

    assert.strictEqual(
        label.box.element.tagName,
        'image',
        'Background image exists'
    );
});

QUnit.test('Box with nested ems (#5932)', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        600,
        400
    );

    var label = ren.label('This is line 1<br><span style="font-size: 2em">This is line 2</span>', 10, 10)
        .attr({
            'stroke-width': 1,
            stroke: 'blue'
        })
        .css({
            fontSize: '32px'
        })
        .add();

    assert.ok(
        label.getBBox().height > 100,
        'Nested em is included'
    );
});