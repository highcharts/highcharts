(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.plotLines</em> options'
        },
        yAxis: {
            plotLines: [{
                color: '#00c000',
                dashStyle: 'Solid',
                label: {
                    text: 'Plot line'
                },
                value: 0.85,
                width: 1
            }]
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
