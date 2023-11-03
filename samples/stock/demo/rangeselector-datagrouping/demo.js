(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'month',
                count: 3,
                text: 'Day',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'year',
                count: 1,
                text: 'Week',
                dataGrouping: {
                    forced: true,
                    units: [['week', [1]]]
                }
            }, {
                type: 'all',
                text: 'Month',
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
                }
            }],
            buttonTheme: {
                width: 60
            },
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'Custom data grouping tied to range selector'
        },

        _navigator: {
            enabled: false
        },

        series: [{
            name: 'AAPL',
            data: data,
            marker: {
                enabled: null, // auto
                radius: 3,
                lineWidth: 1,
                lineColor: '#FFFFFF'
            },
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();