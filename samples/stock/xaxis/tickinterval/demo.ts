(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.tickInterval</em>'
        },
        yAxis: {
            tickInterval: 0.01
        },
        series: [{
            data: data
        }]
    });

})();
