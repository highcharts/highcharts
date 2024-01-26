(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-v.json'
    ).then(response => response.json());

    // create the chart
    Highcharts.stockChart('container', {
        chart: {
            alignTicks: false
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Volume'
        },

        series: [{
            type: 'column',
            name: 'AAPL Stock Volume',
            data: data,
            dataGrouping: {
                units: [[
                    'week', // unit name
                    [1] // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]]
            }
        }]
    });
})();