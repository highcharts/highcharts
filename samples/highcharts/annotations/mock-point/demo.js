Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },
    subtitle: {
        text: 'Annotations connected to coordinates without data points'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }],

    xAxis: {
        tickInterval: 0.5,
        gridLineWidth: 1
    },

    annotations: [{
        labels: [{
            point: {
                x: 3,
                y: 129.2,
                xAxis: 0,
                yAxis: 0
            },
            text: 'x: {x}<br/>y: {y}'
        },
        {
            point: {
                x: 0,
                y: 0
            },
            text: 'x: {point.plotX} px<br/>y: {point.plotY} px'
        },
        {
            point: {
                x: 5,
                y: 100,
                xAxis: 0
            },
            text: 'x: {x}<br/>y: {point.plotY} px'
        }],
        labelOptions: {
            x: 40, y: -10
        }
    }]
});