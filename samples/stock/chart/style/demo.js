(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'serif'
            }
        }
    });

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]

    });
})();
