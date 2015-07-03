var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    renderer.circle(200, 150, 100).attr({
        fill: '#FCFFC5',
        stroke: 'black',
        'stroke-width': 1
    }).add();
});