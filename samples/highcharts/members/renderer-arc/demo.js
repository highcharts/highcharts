var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({
        fill: '#FCFFC5',
        stroke: 'black',
        'stroke-width': 1
    }).add();
});