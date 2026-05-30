(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        chart: {
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text: 'Demo of <em>yAxis.scrollbar.enabled</em> and ' +
                   '<em>showFull</em>'
        },
        yAxis: {
            scrollbar: {
                enabled: true,
                showFull: false
            }
        },
        series: [{
            data: data
        }]
    });

})();
