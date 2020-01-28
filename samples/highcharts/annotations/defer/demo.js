Highcharts.chart('container', {

    plotOptions: {
        series: {
            animation: {
                duration: 2000
            }
        }
    },

    series: [{
        data: [{
            y: 29.9,
            id: 'min'
        }, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, {
            y: 216.4,
            id: 'max'
        }, 194.1, 95.6, 54.4]
    }],

    annotations: [{
        defer: {
            duration: 4000
        },
        labels: [{
            point: 'max',
            text: 'Max'
        }, {
            point: 'min',
            text: 'Min'
        }],
        shapes: [{
            type: 'circle',
            point: {
                x: 50,
                y: 50
            },
            r: 10
        }]
    }]
});