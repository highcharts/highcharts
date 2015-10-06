var renderer,
    circles = [];
$(function () {

    renderer = new Highcharts.Renderer(
        $('#container')[0],
        450,
        300
    );

    circles[0] = renderer.circle(200, 200, 60)
        .attr({
            fill: 'green',
            zIndex: 8
        })
        .add();
    circles[1] = renderer.circle(250, 200, 60)
        .attr({
            fill: 'yellow',
            zIndex: 6
        })
        .add();
    circles[2] = renderer.circle(300, 200, 60)
        .attr({
            fill: 'blue',
            zIndex: 4
        })
        .add();
    circles[3] = renderer.circle(350, 200, 60)
        .attr({
            fill: 'red',
            zIndex: 2
        })
        .add();

    $('.update-yellow-z').click(function () {
        circles[1].attr({
            zIndex: $(this).data('zindex')
        });
    });

});