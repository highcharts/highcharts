var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        500,
        300
    );

    var lbl = renderer.label('<span>Header</span><br>Body', 100, 100)
        .attr({
            'stroke-width': 1,
            stroke: 'blue'
        })
        .css({
            width: '100px'
        })
        .add();
});
