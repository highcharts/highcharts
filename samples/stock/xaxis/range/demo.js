(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        xAxis: {
            range: 6 * 30 * 24 * 3600 * 1000 // six months
        },

        rangeSelector: {
            enabled: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();