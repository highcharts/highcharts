(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.range</em>'
        },
        xAxis: {
            range: 10000000000
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
