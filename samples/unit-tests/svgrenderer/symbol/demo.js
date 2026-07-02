QUnit.test('Arc', assert => {
    const path = Highcharts.SVGRenderer.prototype.symbols.arc(0, 0, 10, 10, {
        r: 0
    });

    assert.strictEqual(
        path[1][1],
        0,
        '#15382: X radius should be 0'
    );
    assert.strictEqual(
        path[1][2],
        0,
        '#15382: Y radius should be 0'
    );

    const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        ),
        arcBox = ren.path({
            d: ren.symbols.arc(150, 150, 150, 150, {
                r: 150,
                end: Math.PI * 2 - 1.1,
                start: -1.1
            })
        }).attr({
            stroke: 'black'
        }).add().getBBox();

    assert.close(
        arcBox.y,
        0,
        0.001,
        'Arc with changed start and end angle should create a correct circle.'
    );
    assert.close(
        arcBox.x,
        0,
        0.001,
        'Arc with changed start and end angle should create a correct circle.'
    );
    assert.close(
        arcBox.width,
        300,
        0.001,
        'Arc with changed start and end angle should create a correct circle.'
    );
    assert.close(
        arcBox.height,
        300,
        0.001,
        'Arc with changed start and end angle should create a correct circle.'
    );
});

// Tests for #20585, #21701
QUnit.test('Arc proximity', assert => {
    const ren = new Highcharts.Renderer(
        document.getElementById('container'),
        400,
        400
    );

    [0, 5000, 10000].forEach(x => {

        const circle = ren
            .symbol('circle', x, 100, 6, 6)
            .attr({
                fill: 'blue'
            })
            .add();

        assert.close(
            circle.getBBox().width,
            6,
            0.001,
            `Circle should be rendered with correct width, x=${x}`
        );
    });
});

QUnit.test('Square/rect', assert => {
    ['square', 'rect'].forEach(shape => {
        const fn = Highcharts.SVGRenderer.prototype.symbols[shape];

        let path = fn(0, 0, 10, 10);
        assert.strictEqual(
            path.length,
            5,
            `${shape}, no options: Path should have no curves`
        );

        path = fn(0, 0, 10, 10, { r: 0 });
        assert.strictEqual(
            path.length,
            5,
            `${shape}, r=0: Path should have no curves`
        );

        path = fn(0, 0, 10, 10, { r: 5 });
        assert.ok(
            path.length > 5,
            `${shape}, r=5: Path should have curves`
        );
    });
});

QUnit.test('Image', assert => {
    const renderer = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            300
        ),
        // eslint-disable-next-line max-len
        symbol = 'url(data:image/svg+xml;base64,PHN2ZyBpZD0ibWFsZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTkyIDUxMiI+PHBhdGggZD0iTTk2IDBjMzUuMzQ2IDAgNjQgMjguNjU0IDY0IDY0cy0yOC42NTQgNjQtNjQgNjQtNjQtMjguNjU0LTY0LTY0UzYwLjY1NCAwIDk2IDBtNDggMTQ0aC0xMS4zNmMtMjIuNzExIDEwLjQ0My00OS41OSAxMC44OTQtNzMuMjggMEg0OGMtMjYuNTEgMC00OCAyMS40OS00OCA0OHYxMzZjMCAxMy4yNTUgMTAuNzQ1IDI0IDI0IDI0aDE2djEzNmMwIDEzLjI1NSAxMC43NDUgMjQgMjQgMjRoNjRjMTMuMjU1IDAgMjQtMTAuNzQ1IDI0LTI0VjM1MmgxNmMxMy4yNTUgMCAyNC0xMC43NDUgMjQtMjRWMTkyYzAtMjYuNTEtMjEuNDktNDgtNDgtNDh6IiBmaWxsPSIjMkQ1RkYzIi8+PC9zdmc+)';

    renderer.image(
        'https://www.highcharts.com/samples/graphics/sun.png',
        100,
        null,
        ''
    ).add();

    assert.ok(
        true,
        'No errors after adding an image without optional parameters, #11756.'
    );


    const clock = TestUtilities.lolexInstall();

    const symbol1 = renderer.symbol(
        symbol,
        50,
        50,
        void 0,
        void 0, {
            backgroundSize: 'within'
        }
    ).attr({
        width: 50,
        height: 50
    }).add();

    try {
        setTimeout(() => {
            const symbol2 = renderer.symbol(
                symbol,
                200,
                50,
                void 0,
                void 0, {
                    backgroundSize: 'within'
                }
            ).attr({
                height: 50,
                width: 50
            })
                .add();

            const {
                    width: width1,
                    height: height1
                } = symbol1.element.getBBox(),
                {
                    width: width2,
                    height: height2
                } = symbol2.element.getBBox();

            assert.equal(
                width1,
                width2,
                'Width of image-symbol should not be changed after redraw, ' +
                '#17315.'
            );

            assert.equal(
                height1,
                height2,
                'Height of image-symbol should not be changed after redraw, ' +
                '#17315.'
            );
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } catch (error) {
        TestUtilities.lolexUninstall(clock);
        throw error;
    }

    symbol1.imgwidth = 56;
    symbol1.imgheight = 150;
    symbol1.attr({
        width: 0,
        height: 0
    });

    assert.equal(
        symbol1.translateX,
        -symbol1.imgwidth / 2,
        'Symbol should be correctly centered in X (#18790)'
    );

    assert.equal(
        symbol1.translateY,
        -symbol1.imgheight / 2,
        'Symbol should be correctly centered in Y (#18790)'
    );
});
