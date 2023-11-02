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

    document.getElementById('button').addEventListener('click', e => {
        chart.series[0].remove();
        e.target.disabled = true;
    });
})();