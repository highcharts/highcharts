Highcharts.chart('container', {

    annotations: [{
        shapes: [{
            type: 'path',
            strokeWidth: 2,
            stroke: 'red',
            points: [{
                x: 1,
                xAxis: 0,
                y: 3,
                yAxis: 0
            }, {
                x: 2,
                xAxis: 0,
                y: 3,
                yAxis: 0
            }, {
                x: 2,
                xAxis: 0,
                y: 5,
                yAxis: 0
            }, {
                x: 1,
                xAxis: 0,
                y: 5,
                yAxis: 0
            }, {
                x: 1,
                xAxis: 0,
                y: 3,
                yAxis: 0
            }]
        }]
    }],

    chart: {
        width: 800,
        height: 400
    },

    exporting: {
        scale: 2
    },

    series: [{
        data: [4, 3, 5, 6, 2, 3]
    }]

});
