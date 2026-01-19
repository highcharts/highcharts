(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.labels.staggerLines</em>'
        },
        xAxis: {
            labels: {
                staggerLines: 2
            }
        },
        rangeSelector: {
            selected: 4
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
