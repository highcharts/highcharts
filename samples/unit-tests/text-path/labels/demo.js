QUnit.test('Testing textPath labels', function (assert) {
    const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        ),
        makeTextPath = (pathArr, textStr) => {
            const text = ren
                .text(textStr)
                .setTextPath(ren.path(pathArr), { enabled: true })
                .add();
            return text;
        },
        curvedPath = [
            ['M', 120, 100, 'C', 440, 200, 100, 420, 220, 170],
            ['L', 500, 200]
        ],
        curvedTextPolygon = [
            [
                28.475000381469727,
                18
            ],
            [
                28.475000381469727,
                -1
            ],
            [
                23.575000762939453,
                -1
            ],
            [
                23.575000762939453,
                -20
            ],
            [
                5.7750000953674325,
                -20
            ],
            [
                -23.575000762939453,
                -20
            ],
            [
                -23.575000762939453,
                -1
            ],
            [
                -28.475000381469727,
                -1
            ],
            [
                -28.475000381469727,
                18
            ],
            [
                28.475000381469727,
                18
            ]
        ];

    assert.deepEqual(
        curvedTextPolygon,
        makeTextPath(
            curvedPath,
            'testing<br>textpath'
        ).getBBox().polygon,
        'Text labels with newlines have befitting polygons'
    );

    assert.deepEqual(
        curvedTextPolygon,
        makeTextPath(
            curvedPath,
            'testing<br><span>text</span>path'
        ).getBBox().polygon,
        'Text labels with newlines and nested spans have befitting polygons'
    );

    assert.deepEqual(
        curvedTextPolygon,
        makeTextPath(
            curvedPath,
            '<span style="color: red;">testing<br><span>text</span>path</span>'
        ).getBBox().polygon,
        'Span-wrapped text labels with newlines and ' +
        'nested spans have befitting polygons'
    );
});