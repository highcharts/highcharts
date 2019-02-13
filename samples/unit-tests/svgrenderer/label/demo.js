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
        "The width of the label that contains markup should be the greatest"
    );
});

QUnit.test('Labels with nested or async styling (#9400)', function (assert) {

    document.getElementById('container').innerHTML = '';
    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        600,
        400
    );

    var label1, label2, label3;

    label1 = ren
        .label(
            '<span style="font-size: 10px">I should be inside the box</span>',
            100,
            100
        )
        .attr({
            stroke: 'blue',
            'stroke-width': '1px'
        })
        .css({
            fontSize: '20px'
        })
        .add();

    label2 = ren
        .label(
            '<span style="font-size: 10px">I should be inside</span> the box',
            100,
            130
        )
        .attr({
            stroke: 'blue',
            'stroke-width': '1px'
        })
        .css({
            fontSize: '20px'
        })
        .add();

    label3 = ren
        .label(
            'No inline span',
            100,
            160
        )
        .attr({
            stroke: 'blue',
            'stroke-width': '1px'
        })
        .css({
            fontSize: '20px'
        })
        .add();

    assert.strictEqual(
        document.getElementById('container').innerHTML.indexOf('NaN'),
        -1,
        'No NaN attribute values should be allowed'
    );

    assert.ok(
        label1.element.getBBox().height < label2.element.getBBox().height,
        'Label with inline style should be smaller'
    );

    assert.strictEqual(
        label2.element.getBBox().height,
        label3.element.getBBox().height,
        'Label with text outside inner span should be equal'
    );

    label1 = ren.label('I should be inside the box', 100, 200)
        .attr({
            stroke: 'red',
            'stroke-width': '1px'
        })
        .add()
        .css({
            fontSize: '30px'
        });

    assert.ok(
        label1.box.element.getBBox().height > label1.text.element.getBBox().height,
        'Border should be higher than text'
    );

    assert.ok(
        label1.box.element.getBBox().width > label1.text.element.getBBox().width,
        'Border should be wider than text'
    );

    label1 = ren.text('Testing text-anchor', 100, 300)
        .attr({
            align: ''
        })
        .add()
        .css({
            fontSize: '30px'
        });

    assert.strictEqual(
        label1.element.attributes["text-anchor"],
        undefined,
        'Label text-anchor with empty align attribute should not be set'
    );
});

QUnit.test('Labels with useHTML', assert => {
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').style.position = 'relative';
    const ren = new Highcharts.Renderer(
        document.getElementById('container'),
        600,
        400
    );

    const lbl = ren
        .label(
            'This is a long text that requires the label to wrap into multiple lines',
            10,
            19,
            null,
            0,
            0,
            true
        )
        .attr({
            stroke: 'blue',
            'stroke-width': 2
        })
        .css({
            width: '200px'
        })
        .add();

    assert.strictEqual(
        lbl.text.element.style.width,
        '200px',
        'The span should have a fixed width'
    );

    lbl.attr({
        text: 'Short'
    });

    assert.notEqual(
        lbl.text.element.style.width,
        '200px',
        'The span width should adapt to shorter text (#10009)'
    );
});
