(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());
    const chart = Highcharts.stockChart('container', {
        xAxis: {
            id: 'x-axis'
        },
        rangeSelector: {
            selected: 1
        },
        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });

    document.getElementById('button').addEventListener('click', () => {
        alert('The axis object: ' + chart.get('x-axis'));
    });
})();