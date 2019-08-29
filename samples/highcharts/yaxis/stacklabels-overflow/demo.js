Highcharts.chart('container', {
    chart: {
        type: 'column',
        width: 300,
        height: 260
    },

    yAxis: {
        stackLabels: {
            enabled: true,
            allowOverlap: true,
            overflow: 'allow',
            crop: false
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        data: [29.9123464, -71.5123464, 106.4123464, 129.2123464]
    }, {
        data: [144.0123464, -176.0123464, 135.6123464, 148.5123464]
    }]
});
