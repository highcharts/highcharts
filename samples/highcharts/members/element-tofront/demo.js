const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

const rect = renderer.rect(100, 100, 100, 100, 5)
    .attr({
        'stroke-width': 2,
        stroke: 'red',
        fill: 'yellow'
    })
    .add();

const circ = renderer.circle(200, 200, 50)
    .attr({
        'stroke-width': 2,
        stroke: 'red',
        fill: 'green'
    })
    .add();

rect.on('click', () => rect.toFront());
circ.on('click', () => circ.toFront());