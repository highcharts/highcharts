// Highcharts 4.0.1, Issue #3158
// Pie chart - item width issue
QUnit.test('Text word wrap #3158', function (assert) {

    var renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        400,
        300
    );

    renderer.rect(100, 80, 100, 100)
        .attr({
            stroke: 'silver',
            'stroke-width': 1
        })
        .add();

    var text = renderer
        .text(
            '<b>TheQuickBrownFox</b><br>jumps over the lazy dog, the issue' +
            ' caused the second line to be only one word', 100, 100
        )
        .css({
            width: '100px',
            color: '#003399'
        })
        .add();

    var textLines = text.element.getElementsByTagName('tspan');

    assert.strictEqual(
        textLines.length,
        6,
        'Six text lines should be rendered.'
    );

    assert.strictEqual(
        (textLines[1].textContent.indexOf(' ') > 0),
        true,
        'There should be more than one word in the second text line. #3158'
    );

});

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

    var renderer;

    try {

        renderer = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        );

        var text = renderer.text(
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

        text.attr({
            text: null
        });

        assert.strictEqual(
            text.getBBox().width,
            0,
            'Null text works fine (#7316)'
        );

    } finally {

        renderer.destroy();

    }
});

QUnit.test('textOverflow: ellipsis.', function (assert) {

    var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        ),
        width = 50,
        style = {
            textOverflow: 'ellipsis',
            width: width + 'px'
        },
        text1 = ren.text('01234567', 0, 100).css(style).add(),
        text2 = ren.text('012345678', 0, 120).css(style).add();
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
    text1 = ren.text('01234567', 0, 100).css(style).add();
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
    text1 = ren.text('01234567', 0, 100).attr({
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


    text1.destroy();
    text1 = ren.text('The quick brown fox jumps over the lazy dog', 30, 30)
        .css({
            width: '100px'
        })
        .add();
    assert.strictEqual(
        text1.element.getElementsByTagName('title').length,
        0,
        'Wrapped text should not have a title tag (#8444)'
    );

    text1.destroy();
    text1 = ren.text('The quick brown fox jumps over the lazy dog', 30, 30)
        .css({
            width: '100px',
            textOverflow: 'ellipsis'
        })
        .add();
    assert.strictEqual(
        text1.element.getElementsByTagName('title').length,
        1,
        'Ellipsis text should have a title tag'
    );

});

QUnit.test('BBox for mulitiple lines', function (assert) {

    var renderer;

    try {

        renderer = new Highcharts.Renderer(
            document.getElementById('container'),
            200,
            200
        );

        var lab = renderer.label('<span></span><br/>line<br/>line', 20, 20)
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

    } finally {

        renderer.destroy();

    }
});

QUnit.test('HTML', function (assert) {

    var renderer;

    try {

        renderer = new Highcharts.SVGRenderer(
            document.getElementById('container'),
            500,
            500
        );

        var text = renderer.text('Hello &amp; &lt;tag&gt;', 10, 30).add();

        assert.strictEqual(
            text.element.textContent,
            'Hello & <tag>',
            'HTML entities decoded correctly'
        );

        text = renderer.text('a < b and c > d', 10, 60).add();
        assert.strictEqual(
            text.element.textContent,
            'a < b and c > d',
            'Tags don\'t start with spaces (#7126)'
        );

        var html = renderer.text('useHTML', 100, 100, true).add();
        assert.close(
            html.element.offsetLeft,
            100,
            1,
            'Left offset should reflect initial position'
        );
        assert.close(
            html.element.offsetHeight + html.element.offsetTop,
            100,
            10,
            'Top offset should reflect initial position'
        );

    } finally {

        renderer.destroy();

    }
});

QUnit.test('Dir rtl (#3482)', function (assert) {

    var renderer;

    try {

        document.getElementById('container').setAttribute('dir', 'rtl');

        renderer = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        );

        var label = renderer.label('Hello', 100, 100)
            .attr({
                stroke: 'blue',
                'stroke-width': 1,
                padding: 0
            })
            .add();

        assert.close(
            label.text.element.getBBox().x,
            0,
            2,
            'Label sits nicely inside box'
        );

        document.getElementById('container').removeAttribute('dir');

    } finally {

        renderer.destroy();

    }

});

QUnit.test('Attributes', function (assert) {

    var renderer;

    try {

        renderer = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        );

        var text = renderer
            .text(
                'The quick brown fox jumps <span class="red">over</span> the lazy dog',
                20,
                20
            )
            .add();

        assert.strictEqual(
            text.element.childNodes[1].getAttribute('class'),
            'red',
            'Double quotes, red span should be picked up'
        );

        text = renderer
            .text(
                "The quick brown fox jumps <span class='red'>over</span> the lazy dog",
                20,
                20
            )
            .add();

        assert.strictEqual(
            text.element.childNodes[1].getAttribute('class'),
            'red',
            'Single quotes, red span should be picked up'
        );

    } finally {

        renderer.destroy();

    }

});

// Highcharts 4.1.1, Issue #3842:
// Bar dataLabels positions in 4.1.x - Firefox, Internet Explorer
QUnit.test('Text height (#3842)', function (assert) {

    var renderer;

    try {

        renderer = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        var textLabel = renderer.text('Firefox/IE clean', 10, 30).add();

        var textLabelWithShadow = renderer.text('Firefox/IE shadow', 10, 60)
            .css({
                textOutline: '6px silver'
            })
            .add();

        assert.equal(
            textLabelWithShadow.getBBox().height,
            textLabel.getBBox().height,
            'Shadow text'
        );

    } finally {

        renderer.destroy();

    }

});