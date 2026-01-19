(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.crosshair</em> options'
        },
        yAxis: {
            crosshair: {
                label: {
                    enabled: true,
                    format: '{value:.2f}'
                },
                snap: true
            }
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
