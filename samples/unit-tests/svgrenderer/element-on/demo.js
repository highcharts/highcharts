QUnit.test('Element.on', function (assert) {

    var renderer = new Highcharts
        .Renderer(
            $('#container')[0],
            400,
            300
        ),
        rectSvgElement = renderer.rect(100, 100, 100, 100, 5)
            .attr({
                'stroke-width': 2,
                stroke: 'gray',
                fill: 'silver',
                zIndex: 3
            })
            .on('click', function () {
                rectSvgElement.animate({
                    x: 50,
                    y: 50,
                    width: 200,
                    height: 20,
                    'stroke-width': 10
                });

            })
            .add();

    var clock = TestUtilities.lolexInstall();

    try {

        var rectNodeElement = document.querySelector('#container rect'),
            done = assert.async();

        assert.strictEqual(
            rectNodeElement.getAttribute('width'),
            '100',
            'Starting at 100 width'
        );

        // Start transforming
        rectNodeElement.onclick();

        assert.strictEqual(
            rectNodeElement.getAttribute('width'),
            '100',
            'Starting at 100 width'
        );

        setTimeout(function () {
            var width = parseInt(rectNodeElement.getAttribute('width'), 10);
            assert.strictEqual(
                width > 100 && width < 200,
                true,
                '300 ms: animating'
            );
        }, 300);

        setTimeout(function () {
            var width = parseInt(rectNodeElement.getAttribute('width'), 10);
            assert.strictEqual(
                width,
                200,
                '600 ms: landed'
            );
            done();
        }, 600);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }

});