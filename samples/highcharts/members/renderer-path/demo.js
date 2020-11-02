const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

renderer.path(['M', 0, 0, 'L', 100, 100, 200, 50, 300, 100])
    .attr({
        'stroke-width': 2,
        stroke: 'red'
    })
    .add();