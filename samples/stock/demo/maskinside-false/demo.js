(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        title: {
            text: 'Navigator mask is outside zoomed range'
        },

        navigator: {
            maskInside: false
        },

        rangeSelector: {
            selected: 4
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();