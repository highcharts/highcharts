$(function () {
    QUnit.test('Text height', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        var txt = ren.text('Firefox/IE clean', 10, 30).add();

        var txt2 = ren.text('Firefox/IE shadow', 10, 60)
            .css({
                textShadow: '0 0 6px green, 0 0 3px green'
            })
            .add();
        assert.equal(
            txt2.getBBox().height,
            txt.getBBox().height,
            'Shadow text'
        );
    });

});