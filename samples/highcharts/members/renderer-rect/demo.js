const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

renderer.rect(100, 100, 100, 100, 5)
    .attr({
        'stroke-width': 2,
        stroke: 'red',
        fill: 'yellow',
        zIndex: 3
    })
    .add();