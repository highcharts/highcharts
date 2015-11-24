var renderer,
    rect,
    circ;

$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    rect = renderer.rect(100, 100, 100, 100, 5)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'yellow'
        })
        .add();

    circ = renderer.circle(200, 200, 50)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'green'
        })
        .add();

    rect.on('click', function () {
        rect.toFront();
    });

    circ.on('click', function () {
        circ.toFront();
    });
});