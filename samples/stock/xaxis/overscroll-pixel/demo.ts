(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.overscroll</em>'
        },
        xAxis: {
            overscroll: '50px'
        },
        series: [{
            data: data
        }]
    });

})();
