QUnit.test('titleSetter', function (assert) {
    var chart = Highcharts.chart('container', {
        }),
        str = 'The quick brown fox<br> jumps over the lazy dog',
        newTitle = 'Quick brown fox',
        text = chart.renderer.text(str, 100, 100).css({ width: 100, textOverflow: 'ellipsis' }).add();

    assert.strictEqual(
        text.element.getElementsByTagName('title')[0].textContent, // Ideally there should be a titleGetter. text.attr('title')
        str.replace('<br>', ''),
        'Text element has a correct title. #5211'
    );

    // Update the title tag with a shorter text
    text.attr('title', newTitle);
    assert.strictEqual(
        text.element.getElementsByTagName('title')[0].textContent, // Ideally there should be a titleGetter. text.attr('title')
        newTitle,
        'Text element title has been updated. #5211'
    );
});

QUnit.test('getBBox with useHTML (#5899)', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        600,
        400
    );

    var text = ren.text(
            '<div style="width: 500px">Styled div</div>',
            20,
            20,
            true
        )
        .add();


    assert.strictEqual(
        text.getBBox().width,
        500,
        'Initial bounding box'
    );


    text.attr({
        text: '<div style="width: 400px">Styled div</div>'
    });

    assert.strictEqual(
        text.getBBox().width,
        400,
        'Updated bounding box'
    );
});
