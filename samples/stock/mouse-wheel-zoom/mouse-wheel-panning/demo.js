(async () => {
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        chart: {
            panning: true,
            panKey: 'shift'
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Hold Shift and scroll to pan'
        },

        series: [{
            name: 'AAPL',
            data
        }]
    });
})();
