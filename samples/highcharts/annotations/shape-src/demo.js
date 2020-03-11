Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    annotations: [{
        shapeOptions: {
            src: 'https://www.highcharts.com/samples/graphics/sun.png'
        },
        shapes: [{
            type: 'image',
            width: 30,
            height: 30,
            point: {
                x: 2,
                y: 2,
                xAxis: 0,
                yAxis: 0
            }
        }]
    }],
    series: [{
        data: [1, 2, 3, 5, 1, 2, 3]
    }]
});
