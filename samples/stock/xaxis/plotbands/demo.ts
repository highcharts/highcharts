(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.plotBands</em> options'
        },
        yAxis: {
            plotBands: [{
                color: '#00c00019',
                from: 0.75,
                to: 0.85
            }]
        },
        series: [{
            data: data
        }]
    });

})();
