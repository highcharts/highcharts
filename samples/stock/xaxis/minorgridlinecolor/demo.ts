(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.minorGridLineColor</em>'
        },
        yAxis: {
            minorGridLineColor: '#00c00019',
            minorTicks: true
        },
        series: [{
            data: data
        }]
    });

})();
