const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

renderer
    .image(
        'https://www.highcharts.com/samples/graphics/sun.png',
        100,
        100,
        30,
        30
    )
    .add();
