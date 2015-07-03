var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    renderer.rect(10, 10, 100, 50, 5).attr({
        fill: 'blue',
        stroke: 'black',
        'stroke-width': 1
    }).add();


    renderer.circle(100, 100, 50).attr({
        fill: 'red',
        stroke: 'black',
        'stroke-width': 1
    }).add();

    renderer.text('Hello world', 200, 100).attr({
        rotation: 45
    }).css({
        fontSize: '16pt',
        color: 'green'
    }).add();
});