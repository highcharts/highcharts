$(function () {
    QUnit.test('Reset visibility on HTML label', function (assert) {
        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            500,
            300
        );

        var label = ren.label('Hello World', 100, 100, null, null, null, true)
            .attr({
                'stroke-width': 1,
                stroke: 'blue',
                padding: 10,
                r: 10
            })
            .add();

        label.hide();
        assert.strictEqual(
            label.div.style.visibility,
            'hidden',
            'Visibility is hidden'
        );

        label.show(true);
        assert.strictEqual(
            label.div.style.visibility,
            'inherit',
            'Visibility is inherit'
        );

        label.hide();
        assert.strictEqual(
            label.div.style.visibility,
            'hidden',
            'Visibility is hidden'
        );

        label.show();
        assert.strictEqual(
            label.div.style.visibility,
            'visible',
            'Visibility is visible'
        );



    });
});