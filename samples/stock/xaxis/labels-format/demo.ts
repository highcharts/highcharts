(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.labels.format</em>'
        },
        yAxis: {
            labels: {
                format: '${value} USD'
            }
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
