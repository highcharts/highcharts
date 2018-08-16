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
        'url(base/test/testimage.png)' : // karma
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

// Highcharts 3.0.10, Issue #2794
// Renderer.label with <br> tags
QUnit.test('buildText fontSize (#2794)', function (assert) {

    Highcharts.chart('container', {
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
        }]
    }, function (chart) {

        var renderer = chart.renderer,
            group = renderer.g().add(),
            catchedException;

        try {
            renderer.label('Regression caused').add(group);
            renderer.label('error in <br> wrapped text', 0, 20).add(group);
        } catch (exception) {
            catchedException = exception;
        }

        assert.ok(
            !catchedException,
            'There should be not exception, when adding labels to a group.'
        );

    });

});

// Highcharts 4.0.1, Issue #3132
// SVGRenderer with fixed width doesn't handle marked-up text
QUnit.test('SVG text wrap (#3132)', function (assert) {
    var renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        500,
        300
    );
    renderer.label('Foo: bar', 100, 150)
    .attr({
        'stroke-width': 1,
        stroke: 'blue'
    })
    .css({
        width: '260px'
    })
    .add();

    renderer.label('Foo: <b>bar</b>', 100, 100)
    .attr({
        'stroke-width': 1,
        stroke: 'blue'
    })
    .css({
        width: '260px'
    })
    .add();


    var labelWithMarkup = renderer.box.childNodes[3].childNodes[0].getBBox(),
        label = renderer.box.childNodes[2].childNodes[0].getBBox();

    assert.ok(
        labelWithMarkup.width > label.width,
        "The width of the label that contains markup should be the greatest");
});