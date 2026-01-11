(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Demo of <em>yAxis.reversed</em>'
        },
        yAxis: {
            reversed: true
        },
        plotOptions: {
            area: {
                fillOpacity: 0.3
            }
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
