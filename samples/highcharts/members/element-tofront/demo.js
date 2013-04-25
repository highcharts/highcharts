$(function () {
    var renderer = new Highcharts.Renderer(
        $('#container')[0], 
        400,
        300
    );
    
    var rect = renderer.rect(100, 100, 100, 100, 5)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'yellow'
        })
        .add();
    
    rect.on('click', function() {
        rect.toFront();  
    });
    
    
    var circ = renderer.circle(200, 200, 50)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'green'
        })
        .add();
    
    circ.on('click', function() {
        circ.toFront();  
    });
});