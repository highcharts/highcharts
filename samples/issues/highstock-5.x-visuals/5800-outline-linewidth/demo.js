(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        navigator: {
            outlineColor: 'blue',
            outlineWidth: 9
        },
        rangeSelector: {
            selected: 2
        },
        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();