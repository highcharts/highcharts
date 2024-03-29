(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            height: 300
        },

        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'all',
                text: 'Month (preserve=true)',
                preserveDataGrouping: true,
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
                }
            }, {
                type: 'all',
                text: 'Month (preserve=false)',
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
                }
            }],
            buttonTheme: {
                width: 160
            },
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'Click on rangeSelector buttons and use navigator to ' +
                'compare dataGroupings'
        },

        series: [{
            name: 'AAPL',
            type: 'column',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();