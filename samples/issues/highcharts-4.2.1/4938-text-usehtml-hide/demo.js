jQuery(function () {
    QUnit.test('Hide label with useHTML', function (assert) {
        var chart = Highcharts.chart('container', {}),
            renderer = chart.renderer,
            g = renderer.g().add(),
            text = renderer.text('Label', 140, 140, true).add(g);
        assert.strictEqual(
            text.attr('visibility'),
            0,
            'Text element is visible'
        );
        assert.strictEqual(
            g.attr('visibility'),
            0,
            'Group element is visible'
        );
        text.hide();
        assert.strictEqual(
            text.attr('visibility'),
            'hidden',
            'Text element is hidden'
        );
        g.hide();
        assert.strictEqual(
            g.attr('visibility'),
            'hidden',
            'Group element is hidden'
        );
    });
});