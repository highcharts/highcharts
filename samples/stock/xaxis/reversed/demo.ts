(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.reversed</em>'
        },
        yAxis: {
            reversed: true,
            showLastLabel: true
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
