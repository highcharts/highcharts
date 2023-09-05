(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            gridLineWidth: 2
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();