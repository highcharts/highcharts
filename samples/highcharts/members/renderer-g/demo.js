var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0], 
        400,
        300
    );
    
    var group = renderer.g().add();
    
    var circle = renderer.circle(200, 150, 100).attr({
        fill: '#FCFFC5',
        stroke: 'black',
        'stroke-width': 1
    }).add(group);
    
    var rect = renderer.rect(90, 150, 100, 100, 5).attr({
        fill: '#C5FFC5',
        stroke: 'black',
        'stroke-width': 1
    }).add(group);
    
    // add the button handler
    var vis = true;
    $('#button').click(function() {
        if (vis) {
           group.hide();
        } else {
           group.show();
        }
       vis = !vis; 
    });
});