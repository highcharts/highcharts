const chart = Highcharts.stockChart('container', {
    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});

document.getElementById('button').addEventListener('click', () => {
    chart.print();
});
