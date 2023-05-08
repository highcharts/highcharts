Highcharts.chart('container', {
    title: {
        text: 'Error bars with data labels'
    },
    series: [{
        name: 'Rainfall error',
        type: 'errorbar',
        data: [
            [48, 51],
            [68, 73],
            [92, 110]
        ],
        dataLabels: {
            enabled: true,
            style: {
                fontWeight: 'normal'
            }
        }
    }]
});