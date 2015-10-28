
$(function () {
    QUnit.test("Change of label alignment after add", function (assert) {
        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            500,
            300
        );

        var lbl = ren.label('Hello World', 100, 100)
            .attr({
                //align: 'right',
                'fill': 'silver'
            })
            .add();


        var g = ren.box.querySelector('g');


        assert.strictEqual(
            g.getBoundingClientRect().left,
            100,
            "Box is left aligned"
        );


        lbl.attr({ align: 'right' });

        assert.strictEqual(
            g.getBoundingClientRect().right,
            100,
            "Box is right aligned"
        );

    });
});