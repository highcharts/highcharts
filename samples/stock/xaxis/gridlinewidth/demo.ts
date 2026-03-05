(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.gridLineWidth</em>'
        },
        yAxis: {
            gridLineWidth: 2
        },
        series: [{
            data: data
        }]
    });

})();
