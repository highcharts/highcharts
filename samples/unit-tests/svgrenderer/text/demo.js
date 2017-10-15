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

QUnit.test('textOverflow: ellipsis.', function (assert) {
    var chart = Highcharts.chart('container', {}),
        width = 50,
        style = {
            textOverflow: 'ellipsis',
            width: width + 'px'
        },
        text1 = chart.renderer.text('01234567', 0, 100).css(style).add(),
        text2 = chart.renderer.text('012345678', 0, 120).css(style).add();
    assert.strictEqual(
        text1.getBBox().width < width,
        true,
        'Width of text is lower than style.width'
    );
    assert.strictEqual(
        text1.element.childNodes[0].textContent.slice(-1),
        '\u2026',
        'Ellipsis was added to text node.'
    );
    assert.strictEqual(
        text1.element.childNodes[0].textContent,
        text2.element.childNodes[0].textContent,
        'Consistent result between different strings. #6258'
    );
    // TODO 0px does not work, because ellipsis and breaks are not applied
    // when width is considered falsy.
    style.width = '1px';
    text1.destroy();
    text1 = chart.renderer.text('01234567', 0, 100).css(style).add();
    assert.strictEqual(
        text1.element.childNodes[0].textContent,
        '',
        'Width was too small for ellipsis.'
    );

    /**
     * Rotation. Width determines the length of a rotated text
     */
    text1.destroy();
    text2.destroy();
    style.width = '50px';
    text1 = chart.renderer.text('01234567', 0, 100).attr({
        rotation: 90
    }).css(style).add();
    assert.strictEqual(
        text1.element.childNodes[0].textContent.slice(-1),
        '\u2026',
        'Ellipsis was added to text node which has rotation.'
    );
    assert.strictEqual(
        text1.getBBox().height < width,
        true,
        'Height of text is lower than style.width'
    );
});

QUnit.test('BBox for mulitiple lines', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        200,
        200
    );

    var lab = ren.label('<span></span><br/>line<br/>line', 20, 20)
        .css({
            color: '#f00'
        })
        .attr({
            fill: 'rgba(0, 100, 0, 0.75)',
            padding: 0
        })
        .add();

    assert.strictEqual(
        lab.element.getAttribute('dy'),
        null,
        "Frist line shouldn't have dy (#6144) - visually the red text fits in the green box."
    );
});

QUnit.test('HTML entities', function (assert) {
    var ren = new Highcharts.SVGRenderer(
        document.getElementById('container'),
        500,
        500
    );

    var text = ren.text('Hello &amp; &lt;tag&gt;', 10, 30).add();

    assert.strictEqual(
        text.element.textContent,
        'Hello & <tag>',
        'HTML entities decoded correctly'
    );

    text = ren.text('a < b and c > d', 10, 60).add();
    assert.strictEqual(
        text.element.textContent,
        'a < b and c > d',
        'Tags don\'t start with spaces (#7126)'
    );
});
