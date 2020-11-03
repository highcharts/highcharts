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
    chart.xAxis[0].setExtremes(
        Date.UTC(2014, 0, 1),
        Date.UTC(2014, 11, 31)
    );
});
