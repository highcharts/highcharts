var renderer;


var each = Highcharts.each,
    len = 600,
    boxes;


function getBoxes() {

    return [{
        size: 20,
        target: 10
    }, {
        size: 40,
        target: 30
    }, {
        size: 50,
        target: 110
    }, {
        size: 100,
        target: 300
    }, {
        size: 100,
        target: 300
    }, {
        size: 100,
        target: 330
    }, {
        size: 100,
        target: 530
    }, {
        size: 100,
        target: 580
    }, {
        size: 100,
        target: 580,
        rank: 1
    }];
}



renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    len,
    300
);

function visualize(boxes, len, y) {

    renderer.path(['M', 0, y + 45, 'L', len, y + 45])
    .attr({
        stroke: 'silver',
        'stroke-width': 2
    })
    .add();

    each(boxes, function (box, i) {
        if (box.pos !== undefined) {
            renderer.rect(box.pos + 0.5, y + 0.5, box.size - 1, 20)
            .attr({
                'fill': 'rgba(0, 0, 0, 0.1)',
                'stroke-width': 1,
                'stroke': Highcharts.getOptions().colors[i % 10]
            })
            .add();

            renderer.path([
                'M',
                box.pos + box.size * Highcharts.pick(box.align, 0.5),
                y + 20,
                'L', box.target, y + 45, 'z'
            ])
            .attr({
                'stroke-width': 1,
                'stroke': Highcharts.getOptions().colors[i % 10]
            })
            .add();
        }

        renderer.circle(box.target, y + 45, 2)
        .attr({
            fill: 'blue'
        })
        .add();
    });
}

// Centered
boxes = getBoxes();
Highcharts.distribute(boxes, len);
visualize(boxes, len, 10);

// Left
boxes = getBoxes();
each(boxes, function (box) {
    box.align = 0;
});
Highcharts.distribute(boxes, len);
visualize(boxes, len, 110);

// Right
boxes = getBoxes();
each(boxes, function (box) {
    box.align = 1;
});
Highcharts.distribute(boxes, len);
visualize(boxes, len, 210);

