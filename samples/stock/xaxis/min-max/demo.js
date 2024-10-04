(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'xAxis.min = 2010-09-01, xAxis.max = 2014-09-01'
        },

        xAxis: {
            min: Date.UTC(2010, 8, 1),
            max: Date.UTC(2014, 8, 1)
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();