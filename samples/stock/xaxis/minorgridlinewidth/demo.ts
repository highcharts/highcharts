(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.minorGridLineWidth</em>'
        },
        yAxis: {
            gridLineColor: '#808080',
            gridLineWidth: 2,
            minorGridLineColor: '#80808080',
            minorGridLineWidth: 1,
            minorTicks: true
        },
        series: [{
            data: data
        }]
    });

})();
