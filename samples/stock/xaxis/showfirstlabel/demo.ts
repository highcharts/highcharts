(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.showFirstLabel</em> and ' +
                   '<em>showLastLabel</em>'
        },
        yAxis: {
            labels: {
                y: 12
            },
            showFirstLabel: false,
            showLastLabel: true
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
