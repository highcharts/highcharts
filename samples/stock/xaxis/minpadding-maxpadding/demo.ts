(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>yAxis.minPadding</em> and <em>maxPadding</em>'
        },
        yAxis: {
            endOnTick: true,
            labels: {
                x: -3
            },
            lineWidth: 1,
            maxPadding: 0.5,
            minPadding: 0.5,
            startOnTick: true
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
