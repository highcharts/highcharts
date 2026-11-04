(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>tooltip.header</em> options'
        },
        xAxis: {
            crosshair: true
        },
        series: [{
            data: data
        }],
        tooltip: {
            header: {
                backgroundColor: '#444444',
                borderColor: '#141414',
                borderWidth: 1,
                distance: 5,
                style: {
                    color: '#ffffff'
                }
            }
        }
    });

})();
