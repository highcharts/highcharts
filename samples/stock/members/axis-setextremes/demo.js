(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });

    document.getElementById('button').addEventListener('click', () => {
        chart.xAxis[0].setExtremes(
            '2014-01-01',
            '2014-12-31'
        );
    });
})();