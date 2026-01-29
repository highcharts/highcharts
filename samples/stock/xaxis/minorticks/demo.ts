(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of minor tick options'
        },
        yAxis: {
            minorGridLineWidth: 0,
            minorTickColor: '#80808080',
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTicks: true,
            minorTickWidth: 1
        },
        series: [{
            data: data
        }]
    });

})();
