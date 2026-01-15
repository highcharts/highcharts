(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.min</em> and <em>max</em>'
        },
        xAxis: {
            max: '2020-12-31',
            min: '2020-01-01'
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
