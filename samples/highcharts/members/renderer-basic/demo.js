const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

const rect = renderer.rect(10, 10, 100, 50, 5).attr({
    fill: '#2caffe',
    stroke: 'black',
    'stroke-width': 1
}).add();

const circle = renderer.circle(100, 100, 50).attr({
    fill: '#544fc5',
    stroke: 'black',
    'stroke-width': 1
}).add();

const text = renderer.text('Hello world', 200, 100).attr({
    rotation: 45
}).css({
    fontSize: '16pt',
    color: '#00e272'
}).add();

// Run animation on click
renderer.button('Animate', 10, 250)
    .on('click', () => {
        rect.animate({
            height: 100
        });

        circle.animate({
            fill: '#fe6a35'
        }, {
            defer: 250
        });

        text.animate({
            rotation: -45,
            x: 300
        }, {
            duration: 1000,
            defer: 500
        });
    })
    .add();
