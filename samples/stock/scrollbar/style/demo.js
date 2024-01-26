(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        scrollbar: {
            barBorderRadius: 0,
            barBorderWidth: 1,
            buttonsEnabled: true,
            height: 14,
            margin: 0,
            rifleColor: '#333',
            trackBackgroundColor: '#f2f2f2',
            trackBorderRadius: 0
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur.splice(usdeur.length - 250)
        }]
    });
})();