(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            gridLineColor: 'green'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();