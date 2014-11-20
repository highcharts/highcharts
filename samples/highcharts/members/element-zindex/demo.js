var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
            $('#container')[0],
            450,
            300
        ),
        circ1 = renderer.circle(200, 200, 60)
            .attr({
                fill: 'green',
                zIndex: 8
            })
            .add();
        circ2 = renderer.circle(250, 200, 60)
            .attr({
                fill: 'yellow',
                zIndex: 6
            })
            .add();
        circ3 = renderer.circle(300, 200, 60)
            .attr({
                fill: 'blue',
                zIndex: 4
            })
            .add();
        circ4 = renderer.circle(350, 200, 60)
            .attr({
                fill: 'red',
                zIndex: 2
            })
            .add();

    $('.update-yellow-z').click(function () {
        circ2.attr({
            zIndex: $(this).data('zindex')
        });
    })

});