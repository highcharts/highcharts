const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({
    fill: '#FCFFC5',
    stroke: 'black',
    'stroke-width': 1
}).add();