(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());
    Highcharts.StockChart('container', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'USD to EUR exchange rate'
        },

        xAxis: {
            maxZoom: 14 * 24 * 3600000 // fourteen days
        },
        yAxis: {
            title: {
                text: 'Exchange rate'
            }
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur,
            tooltip: {
                yDecimals: 3
            }
        }]
    });
})();
