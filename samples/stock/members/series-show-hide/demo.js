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
        const series = chart.series[0];
        if (series.visible) {
            series.hide();
        } else {
            series.show();
        }
    });
})();