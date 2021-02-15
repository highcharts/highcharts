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
        data: Array.from({ length: 50 }, () => Math.random() * 10)
    }]
});
