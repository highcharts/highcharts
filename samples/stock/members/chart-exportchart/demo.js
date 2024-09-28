(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());
    const chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1,
            inputBoxStyle: {
                right: '80px'
            }
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }],

        exporting: {
            chartOptions: {
                chart: {
                    width: 1024,
                    height: 768
                }
            }
        }
    });

    document.getElementById('button').addEventListener('click', () => {
        chart.exportChart();
    });
})();