$(function () {
    var dashStyles = [
        'Solid',
        'ShortDash',
        'ShortDot',
        'ShortDashDot',
        'ShortDashDotDot',
        'Dot',
        'Dash',
        'LongDash',
        'DashDot',
        'LongDashDot',
        'LongDashDotDot'
    ];
    
    var renderer = new Highcharts.Renderer(
        $('#container')[0],
        400, 
        400
    );
    
    $.each(dashStyles, function(i, dashStyle) {
        renderer.text(dashStyle, 10, 30 * i + 20)
            .add();
    
        renderer.path(['M', 10, 30 * i + 23 , 'L', 390, 30 * i + 23])
            .attr({
                dashstyle: dashStyle,
                'stroke-width': 2,
                stroke: 'black'
            })
            .add();
    });
});