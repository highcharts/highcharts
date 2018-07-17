
Highcharts.chart('container', {

    title: {
        text: 'Highcharts 3d line chart'
    },

    chart: {
        margin: 75,
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 30
        }
    },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});