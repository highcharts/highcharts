const ren = new Highcharts.Renderer(
    document.getElementById('container'),
    600,
    600
);

ren.text('Visual test for bounding box with rotation', 10, 30)
    .css({
        fontSize: '20px'
    })
    .add();

['left', 'center', 'right'].forEach((align, i) => {

    for (let rotation = -90; rotation <= 90; rotation += 30) {

        const x = (120 + rotation) * 2.5,
            y = (i + 1) * 80;
        ren.circle(x, y, 2)
            .attr({ fill: 'red' })
            .add();


        const text = ren.text(`align<br>${align}`, x, y)
            .attr({
                align,
                rotation
            })
            .css({
                fontSize: '12px'
            })
            .add();

        const bBox = text.getBBox();
        ren.rect(bBox.x, bBox.y, bBox.width, bBox.height)
            .attr({
                stroke: 'rgba(0, 0, 0, 0.5)',
                'stroke-width': 0.5
            })
            .add();

    }
});

for (let rotation = -90; rotation <= 90; rotation += 30) {

    const x = (120 + rotation) * 2.5;
    let y = 340;

    // Rectangle
    ren.circle(x, y, 2)
        .attr({ fill: 'red' })
        .add();

    const rect = ren.rect(x, y, 50, 20)
        .attr({
            fill: 'lightblue',
            rotation
        })
        .add();

    let bBox = rect.getBBox();
    ren.rect(bBox.x, bBox.y, bBox.width, bBox.height)
        .attr({
            stroke: 'rgba(0, 0, 0, 0.5)',
            'stroke-width': 0.5
        })
        .add();

    // Path
    y += 100;
    const path = ren.path([['M', 0, 0], ['L', 0, 30], ['L', 30, 0], ['Z']])
        .attr({
            fill: 'lightblue',
            rotation
        })
        .translate(x, y)
        .add();
    bBox = path.getBBox();
    ren.rect(bBox.x, bBox.y, bBox.width, bBox.height)
        .attr({
            stroke: 'rgba(0, 0, 0, 0.5)',
            'stroke-width': 0.5
        })
        .translate(x, y)
        .add();


}