var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    renderer.image('https://www.highcharts.com/samples/graphics/sun.png', 100, 100, 30, 30)
        .add();
});