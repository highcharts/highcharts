(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>scrollbar.enabled</em>'
        },
        rangeSelector: {
            selected: 1
        },
        scrollbar: {
            enabled: false
        },
        series: [{
            data: data,
            name: 'USD to EUR',
            type: 'line'
        }]
    });

})();
