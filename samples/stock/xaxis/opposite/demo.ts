(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of axis <em>opposite</em> options'
        },
        xAxis: {
            opposite: true
        },
        yAxis: {
            opposite: false
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
