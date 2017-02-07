var renderer;

var angle = 0;
renderer = new Highcharts.Renderer(
    $('#container')[0],
    400,
    300
);


var liveDot = renderer.circle(-10, -10, 3)
    .attr({
        fill: 'green'
    })
    .add();
var liveLabel = renderer.label('Callout test<br>Click me', 200, 140, 'callout')
    .attr({
        align: 'center',
        stroke: 'green',
        'stroke-width': 2,
        fill: 'green',
        r: 5
    })
    .css({
        color: 'white',
        cursor: 'pointer'
    })
    .on('click', function () {
        setInterval(function () {
            var anchorX = Math.cos(angle) * 100 + 200,
                anchorY = Math.sin(angle) * 100 + 140;

            liveDot.attr({
                cx: anchorX,
                cy: anchorY
            });

            liveLabel.attr({
                anchorX: anchorX,
                anchorY: anchorY
            });

            angle += Math.PI / 100;

        }, 25);
    })
    .add();

renderer.circle(10, 10, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Top left', 20, 20, 'callout')
    .attr({
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 10,
        anchorY: 10,
        r: 10
    })
    .add();


renderer.circle(200, 10, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Top', 200, 20, 'callout')
    .attr({
        align: 'center',
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 200,
        anchorY: 10,
        r: 5
    })
    .add();


renderer.circle(390, 10, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Top right', 380, 20, 'callout')
    .attr({
        align: 'right',
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 390,
        anchorY: 10,
        r: 10
    })
    .add();


renderer.circle(390, 150, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Right', 380, 140, 'callout')
    .attr({
        align: 'right',
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 390,
        anchorY: 150,
        r: 5
    })
    .add();


renderer.circle(390, 290, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Bottom right', 380, 260, 'callout')
    .attr({
        align: 'right',
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 390,
        anchorY: 290,
        r: 10
    })
    .add();


renderer.circle(200, 290, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Bottom', 200, 260, 'callout')
    .attr({
        align: 'center',
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 200,
        anchorY: 290,
        r: 5
    })
    .add();


renderer.circle(10, 290, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Bottom left', 20, 260, 'callout')
    .attr({
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 10,
        anchorY: 290,
        r: 10
    })
    .add();


renderer.circle(10, 150, 3)
    .attr({
        fill: 'blue'
    })
    .add();

renderer.label('Left', 20, 140, 'callout')
    .attr({
        'stroke': 'blue',
        'stroke-width': 2,
        anchorX: 10,
        anchorY: 150,
        r: 5
    })
    .add();