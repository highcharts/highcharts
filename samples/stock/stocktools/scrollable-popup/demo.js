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
        data: Array.from({ length: 50 }, () => Math.random() * 10),
        pointInterval: 24 * 36e5,
        pointStart: Date.UTC(2024, 0, 1)
    }]
});
