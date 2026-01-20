(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.min</em> and <em>max</em>'
        },
        yAxis: {
            endOnTick: false,
            max: 0.9,
            min: 0.7,
            startOnTick: false
        },
        series: [{
            data: data
        }]
    });

})();
