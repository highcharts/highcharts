(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.title.text</em> and <em>align</em>'
        },
        xAxis: {
            title: {
                align: 'high',
                text: 'Date/time'
            }
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
