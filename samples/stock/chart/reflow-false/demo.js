(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        chart: {
            reflow: false
        },

        title: {
            text: 'Chart reflow is set to false'
        },

        subtitle: {
            text: 'When resizing the window or the frame, the chart should not resize'
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