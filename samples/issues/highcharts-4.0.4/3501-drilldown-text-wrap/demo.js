var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        500,
        300
    );

    renderer.rect(100, 100, 100, 100)
        .attr({
            'stroke-width': 1,
            stroke: 'blue',
            fill: 'none'
        })
        .add();

    var txt = renderer.text('Initial text adapts to box width', 100, 120)
        .css({
            width: '100px'
        })
        .add();

    txt.css({ fill: 'red' });

    txt.attr({ text: 'After running .css once, the new text does not respect box width' });
});
