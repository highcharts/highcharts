(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        chart: {
            plotBorderWidth: 1
        },

        rangeSelector: {
            selected: 1
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();