
$(function () {
    QUnit.test('Animation of stroke-width', function (assert) {
        var renderer =
            new Highcharts.Renderer(
                document.getElementById('container'),
                400,
                300
            ),
            rect = renderer.rect(100, 100, 100, 100, 5)
                .attr({
                    'stroke-width': 2,
                    stroke: 'gray',
                    fill: 'silver',
                    zIndex: 3
                })
                .add(),
            done = assert.async();

        assert.strictEqual(
            rect.element.getAttribute('stroke-width'),
            '2',
            'Starting'
        );

        // Run animation and check
        rect.animate({
            'stroke-width': 10
        }, {
            duration: 100
        });

        setTimeout(function () {
            assert.strictEqual(
                rect.element.getAttribute('stroke-width'),
                '10',
                'Stopped at 10'
            );
            done();
        }, 150);


    });
});