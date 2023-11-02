(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        chart: {
            margin: 0,
            borderWidth: 1
        },

        navigator: {
            top: 340,
            margin: 30
        },

        rangeSelector: {
            selected: 1
        },

        yAxis: {
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();