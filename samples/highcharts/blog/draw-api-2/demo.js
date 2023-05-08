Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
            148.5, 216.4, 194.1, 95.6, 54.4]
    }]

}, function (chart) {

    var renderer = chart.renderer;
    renderer.rect(10, 10, 100, 50, 5).attr({
        fill: 'blue',
        stroke: 'black',
        'stroke-width': 1
    }).add();


    renderer.circle(100, 100, 50).attr({
        fill: 'red',
        stroke: 'black',
        'stroke-width': 1,
        zIndex: 3
    }).add();

    renderer.text('Hello world', 200, 100).attr({
        rotation: 45
    }).css({
        fontSize: '16pt',
        color: 'green'
    }).add();

});
