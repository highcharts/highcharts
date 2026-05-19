(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.crosshair.label.enabled</em> and ' +
                   '<em>format</em>'
        },
        yAxis: {
            crosshair: {
                label: {
                    enabled: true,
                    format: '{value:.2f}'
                }
            }
        },
        series: [{
            data: data
        }]
    });

})();
