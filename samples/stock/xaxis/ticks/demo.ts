(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis</em> options'
        },
        xAxis: {
            tickColor: '#00c000',
            tickLength: 10,
            tickPosition: 'inside',
            tickWidth: 2
        },
        series: [{
            data: data
        }]
    });

})();
