var chart = Highcharts.stockChart('container', {
    chart: {
        type: 'candlestick'
    },
    title: {
        text: 'Dynamic stock data'
    },
    subtitle: {
        text: 'Click button to add candle to chart'
    },
    accessibility: {
        description: 'A test case for dynamic data in financial charts.',
        announceNewData: {
            enabled: true
        }
    },
    series: [{
        name: 'Random data',
        data: []
    }]
});

// Add random point when clicking button
document.getElementById('add').onclick = function () {
    var price = Math.round(Math.random() * 100);
    chart.series[0].addPoint([
        Math.round(+new Date() / 1000) * 1000,
        price,
        Math.round(price * 1.2),
        Math.round(price * 0.8),
        Math.round(price + price * 0.3 * (Math.random() - 0.5))
    ]);
};
