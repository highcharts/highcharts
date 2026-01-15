(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.minorGridLineDashStyle</em>'
        },
        yAxis: {
            gridLineColor: '#808080',
            minorGridLineColor: '#80808080',
            minorGridLineDashStyle: 'Dash',
            minorTicks: true
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
