Highcharts.stockChart('container', {
    stockTools: {
        gui: {
            enabled: true,
            buttons: ['indicators']
        }
    },
    series: [{
        id: 'main',
        type: 'line',
        data: Array.from({ length: 50 }, () => Math.random() * 10)
    }]
});
