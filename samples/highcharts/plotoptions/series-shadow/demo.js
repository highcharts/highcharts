Highcharts.chart('container', {

    plotOptions: {
        series: {
            shadow: true
        }
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
            216.4, 194.1, 95.6, 54.4
        ],
        type: 'column'
    }, {
        data: [
            144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,
            29.9, 71.5, 106.4, 129.2
        ]
    }, {
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
            216.4, 194.1, 95.6, 54.4
        ],
        color: 'blue',
        shadow: {
            color: 'blue',
            width: 10,
            opacity: 1,
            offsetX: 0,
            offsetY: 0
        }
    }]
});