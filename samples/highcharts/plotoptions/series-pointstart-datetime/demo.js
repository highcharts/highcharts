Highcharts.chart('container', {
    xAxis: {
        type: 'datetime'
    },

    plotOptions: {
        series: {
            pointStart: '2024-07-03',
            pointInterval: 36e5 // one hour
        }
    },

    title: {
        text: 'pointStart and pointInterval demo'
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }, {
        data: [
            144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5,
            106.4, 129.2
        ]
    }]
});