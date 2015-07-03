var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    renderer.path(['M', 0, 0, 'L', 100, 100, 200, 50, 300, 100])
        .attr({
            'stroke-width': 2,
            stroke: 'red'
        })
        .add();
});