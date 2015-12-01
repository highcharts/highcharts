$(function () {

    QUnit.test('Image labels should have no fill', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            500,
            300
        );

        var image = ren.label(
            '',
            100,
            100,
            'url(https://smartview.antaris-solutions.net//images/icons/view_alerts.png)'
        )
            .attr({
                'stroke-width': 1,
                stroke: 'blue'
            })
            .add();


        assert.strictEqual(
            image.box.element.getAttribute('fill'),
            null,
            'No fill for image'
        );


        var circle = ren.label(
            '',
            150,
            100,
            'circle'
        )
            .attr({
                'stroke-width': 2,
                stroke: 'blue'
            })
            .add();


        assert.strictEqual(
            circle.box.element.getAttribute('fill'),
            'none',
            'Fill none for circle'
        );
    });
});