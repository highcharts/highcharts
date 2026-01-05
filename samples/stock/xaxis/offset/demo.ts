(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis</em> options'
        },
        yAxis: {
            labels: {
                x: -2
            },
            lineWidth: 1,
            offset: 10,
            opposite: false,
            tickLength: 5,
            tickWidth: 1
        },
        series: [{
            data: data
        }]
    });

})();
