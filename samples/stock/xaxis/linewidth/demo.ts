(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.lineWidth</em>'
        },
        xAxis: {
            lineWidth: 2
        },
        series: [{
            data: data
        }]
    });

})();
