Highcharts.stockChart('container', {
    mapNavigation: {
        enabled: true
    },
    stockTools: {
        gui: {
            enabled: true,
            buttons: ['indicators']
        }
    },
    series: [{
        type: 'line',
        data: Array.from(Array(50)).map(() => Math.random() * 10)
    }]
});
