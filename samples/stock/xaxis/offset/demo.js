(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            spacingRight: 0
        },

        rangeSelector: {
            selected: 1
        },

        navigator: {
            enabled: false
        },

        scrollbar: {
            enabled: false
        },

        title: {
            text: 'AAPL Stock Price'
        },

        yAxis: [{
            opposite: false,
            offset: 20,
            tickWidth: 1,
            tickLength: 5,
            lineWidth: 1
        }, {
            offset: 20,
            tickWidth: 1,
            tickLength: 5,
            lineWidth: 1,
            labels: {
                align: 'left'
            },
            linkedTo: 0
        }],

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();