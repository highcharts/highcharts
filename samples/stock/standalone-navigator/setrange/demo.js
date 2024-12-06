(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    const navigator = Highcharts.navigator('navigator-container', {
        series: [{
            data: usdeur
        }]
    });

    const chart = Highcharts.chart('chart-container', {
        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });

    navigator.bind(chart);

    document.getElementById('button').addEventListener('click', () => {
        navigator.setRange(
            '2014-01-01',
            '2014-12-31'
        );
    });
})();