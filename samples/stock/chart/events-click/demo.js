(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        chart: {
            events: {
                click: function (event) {
                    alert(
                        'x: ' + Highcharts.dateFormat(
                            '%Y-%m-%d',
                            event.xAxis[0].value
                        ) + ', ' +
                        'y: ' + event.yAxis[0].value
                    );
                }
            }
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();