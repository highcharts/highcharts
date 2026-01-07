(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.gridLineColor</em>'
        },
        yAxis: {
            gridLineColor: '#00c00080'
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
