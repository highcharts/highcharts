(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'xAxis.min = 2010-09-01, xAxis.max = 2014-09-01'
        },

        xAxis: {
            min: '2010-09-01',
            max: '2014-09-01'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();