QUnit.test('Testing textPath labels', function (assert) {
    const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        ),
        makeTextPathPolygon = (pathArr, textStr) => (ren
            .text(textStr)
            .setTextPath(ren.path(pathArr), { enabled: true })
            .add()
            .getBBox()
            .polygon
        ),
        straightPath = ['M', 100, 100, 'L', 200, 100],
        curvedPath = [
            ['M', 120, 100, 'C', 440, 200, 100, 420, 220, 170],
            ['L', 500, 200]
        ],
        straightTextPolygon = makeTextPathPolygon(
            straightPath,
            'testing textpath'
        ),
        linebreakedTextPolygon = makeTextPathPolygon(
            straightPath,
            'testing<br>textpath'
        ),
        curvedTextPolygon = makeTextPathPolygon(
            curvedPath,
            'testing textpath'
        ),
        curvedLinebreakedPolygon = makeTextPathPolygon(
            curvedPath,
            'testing<br>textpath'
        );

    // Straight text, no curves or linebreaks
    assert.deepEqual(
        straightTextPolygon,
        makeTextPathPolygon(
            straightPath,
            'testing <span style="color: red;">textpath</span>'
        ),
        'Nested spans should not impact straight textpath polygons'
    );
    assert.deepEqual(
        straightTextPolygon,
        makeTextPathPolygon(
            straightPath,
            '<span>testing textpath</span>'
        ),
        'Span-wrapping straight textpath labels should not impact their polygon'
    );
    assert.deepEqual(
        straightTextPolygon,
        makeTextPathPolygon(
            straightPath,
            '<span>testing <span style="color: red;">textpath</span></span>'
        ),
        'Span-wrapping straight textpath labels with nested spans' +
        'should not impact their polygon'
    );

    // Curved text polygon
    assert.deepEqual(
        curvedTextPolygon,
        makeTextPathPolygon(
            curvedPath,
            'testing <span style="color: red;">textpath</span>'
        ),
        'Nested spans should not impact curved textpath polygons'
    );
    assert.deepEqual(
        curvedTextPolygon,
        makeTextPathPolygon(
            curvedPath,
            '<span>testing textpath</span>'
        ),
        'Span-wrapping curved textpath labels should not impact their polygon'
    );
    assert.deepEqual(
        curvedTextPolygon,
        makeTextPathPolygon(
            curvedPath,
            '<span>testing <span style="color: red;">textpath</span></span>'
        ),
        'Span-wrapping curved textpath labels with nested spans' +
        'should not impact their polygon'
    );

    // Linebreaked text
    assert.deepEqual(
        linebreakedTextPolygon,
        makeTextPathPolygon(
            straightPath,
            '<span style="color: red;">testing<br><span>text</span>path</span>'
        ),
        'Span-wrapping straight textpath labels' +
        'should not impact straight linebreaked polygon'
    );
    assert.deepEqual(
        linebreakedTextPolygon,
        makeTextPathPolygon(
            straightPath,
            'testing<br><span>text</span>path'
        ),
        'Nested spans should not impact linebreaked polygon'
    );
    assert.deepEqual(
        linebreakedTextPolygon,
        makeTextPathPolygon(
            straightPath,
            '<span>testing<br><span>text</span>path</span>'
        ),
        'Span-wrapping textpath labels with nested spans' +
        'should not impact straight linebreaked polygon'
    );

    // Curved linebreaked text
    assert.deepEqual(
        curvedLinebreakedPolygon,
        makeTextPathPolygon(
            curvedPath,
            '<span style="color: red;">testing<br><span>text</span>path</span>'
        ),
        'Span-wrapping text labels should not impact curved linebreaked polygon'
    );
    assert.deepEqual(
        curvedLinebreakedPolygon,
        makeTextPathPolygon(
            curvedPath,
            'testing<br><span>text</span>path'
        ),
        'Nested spans should not impact curved linebreaked polygon'
    );
    assert.deepEqual(
        curvedLinebreakedPolygon,
        makeTextPathPolygon(
            curvedPath,
            '<span>testing<br><span>text</span>path</span>'
        ),
        'Span-wrapping textpath labels with nested spans' +
        'should not impact curved linebreaked polygon'
    );
});