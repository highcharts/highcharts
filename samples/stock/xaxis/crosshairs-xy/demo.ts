(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of axis <em>crosshair</em> options'
        },
        xAxis: {
            crosshair: true
        },
        yAxis: {
            crosshair: true
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
