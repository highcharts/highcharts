(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.plotBands.label</em> options'
        },
        yAxis: {
            plotBands: [{
                color: '#00c00019',
                from: 0.75,
                label: {
                    align: 'center',
                    text: 'Comfort zone',
                    verticalAlign: 'middle',
                    x: 0,
                    y: 0
                },
                to: 0.85,
                zIndex: 3
            }]
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
