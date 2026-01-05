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
                y: 12
            },
            showFirstLabel: false,
            showLastLabel: true
        },
        series: [{
            data: data
        }]
    });

})();
