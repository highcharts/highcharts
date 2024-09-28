(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        rangeSelector: {
            enabled: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();