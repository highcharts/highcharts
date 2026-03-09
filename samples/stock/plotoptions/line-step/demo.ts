(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>series.step</em>'
        },
        rangeSelector: {
            selected: 0
        },
        series: [{
            data: data,
            step: true
        }]
    });

})();
