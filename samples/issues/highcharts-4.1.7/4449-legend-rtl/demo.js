$(function () {
    QUnit.test('Legend rtl and useHTML', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            500,
            300
        );

        // Reference point
        ren.circle(100, 100, 3)
            .attr({
                fill: 'red'
            })
            .add();

        // Add an empty text with useHTML, align it to the right
        var text = ren.text('', 100, 100, true)
            .attr({
                align: 'right'
            })
            .add();

        // Update the text
        text.attr({
            text: 'Hello World'
        });


        assert.strictEqual(
            text.element.offsetLeft + text.element.offsetWidth,
            100,
            'Text is right aligned'
        );

    });
});