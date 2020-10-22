const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

const rect = renderer.rect(100, 100, 100, 100, 5)
    .attr({
        'stroke-width': 2,
        stroke: 'gray',
        fill: 'silver',
        zIndex: 3
    })
    .on('click', () => rect.animate({
        x: 50,
        y: 50,
        width: 200,
        height: 20,
        'stroke-width': 10
    }))
    .add();