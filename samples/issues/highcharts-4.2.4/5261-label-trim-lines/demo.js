jQuery(function () {

    QUnit.test('Left trim', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            500,
            300
        );

        var correctLabel = ren.label('Hello World', 100, 25)
            .attr({
                'stroke-width': 1,
                stroke: 'blue'
            })
            .add();


        var label = ren.label('<br>Hello World', 100, 50)
            .attr({
                'stroke-width': 1,
                stroke: 'blue'
            })
            .add();

        // tspan.dy should be the same as the reference
        assert.strictEqual(
            label.element.querySelector('tspan').getAttribute('dy'),
            correctLabel.element.querySelector('tspan').getAttribute('dy'),
            'Tspan dy offset'
        );


        label = ren.label('Hello World<br>', 100, 50)
            .attr({
                'stroke-width': 1,
                stroke: 'blue'
            })
            .add();

        // tspan.dy should be the same as the reference
        assert.strictEqual(
            label.element.querySelector('tspan').getAttribute('dy'),
            correctLabel.element.querySelector('tspan').getAttribute('dy'),
            'Tspan dy offset'
        );
    });
});