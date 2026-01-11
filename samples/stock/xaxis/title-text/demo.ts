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
                align: 'middle',
                text: 'This is the x-axis text'
            }
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
