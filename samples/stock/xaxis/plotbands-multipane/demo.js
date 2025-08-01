Highcharts.stockChart('container', {
    xAxis: {
        plotBands: [{
            color: '#eeeeee',
            from: '2025-07-31',
            to: '2025-08-02'
        }],
        gridLineWidth: 1
    },
    yAxis: [
        {
            height: '50%'
        },
        {
            height: '45%',
            top: '55%',
            offset: 0
        }
    ],

    plotOptions: {
        series: {
            pointStart: '2025-07-30',
            pointIntervalUnit: 'day'
        }
    },

    series: [
        {
            yAxis: 0,
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ]
        },
        {
            yAxis: 1,
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ]
        }
    ]
});