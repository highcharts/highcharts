(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        title: {
            text: 'Linked Y axis on left side'
        },

        yAxis: [{}, {
            linkedTo: 0,
            opposite: false
        }],

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();