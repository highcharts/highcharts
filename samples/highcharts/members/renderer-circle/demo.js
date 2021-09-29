const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

renderer.circle(200, 150, 100).attr({
    fill: '#FCFFC5',
    stroke: 'black',
    'stroke-width': 1
}).add();