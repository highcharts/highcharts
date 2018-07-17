var renderer,
    circles = [],
    group2;


renderer = new Highcharts.Renderer(
    $('#container')[0],
    450,
    300
);

circles[0] = renderer.circle(200, 200, 60)
    .attr({
        fill: 'green',
        zIndex: 8
    })
    .add();
circles[1] = renderer.circle(250, 200, 60)
    .attr({
        fill: 'yellow',
        zIndex: 6
    })
    .add();
circles[2] = renderer.circle(300, 200, 60)
    .attr({
        fill: 'blue',
        zIndex: 4
    })
    .add();
circles[3] = renderer.circle(350, 200, 60)
    .attr({
        fill: 'red',
        zIndex: 2
    })
    .add();

group2 = renderer.g().add();

circles[4] = renderer.circle(200, 100, 60)
    .attr({
        fill: 'pink',
        zIndex: undefined
    })
    .add(group2);
circles[5] = renderer.circle(250, 100, 60)
    .attr({
        fill: 'black',
        zIndex: -1
    })
    .add(group2);
circles[6] = renderer.circle(300, 100, 60)
    .attr({
        fill: 'grey',
        zIndex: -2
    })
    .add(group2);
circles[7] = renderer.circle(350, 100, 60)
    .attr({
        fill: 'orange',
        zIndex: 10
    })
    .add(group2);

$('.update-yellow-z').click(function () {
    circles[1].attr({
        zIndex: $(this).data('zindex')
    });
});
