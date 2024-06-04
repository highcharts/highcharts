(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f56a420/samples/data/btc-historical.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {
        accessibility: {
            typeDescription: `Stock chart with a line series and a flags series
            indicating key events.`
        },

        title: {
            text: 'Bitcoin Historical Price and Halvings'
        },

        xAxis: {
            overscroll: 2678400000 // 1 month
        },

        rangeSelector: {
            selected: 3,
            buttons: [{
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: 'View 6 months'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }]
        },

        series: [{
            name: 'Bitcoin Price',
            color: '#ffbf00',
            data: data,
            id: 'dataseries',
            tooltip: {
                valueDecimals: 2,
                valuePrefix: '$'
            }

            // the event marker flags
        }, {
            type: 'flags',
            color: '#fb922c',
            onSeries: 'dataseries',
            shape: 'squarepin',
            showInNavigator: true,
            navigatorOptions: {
                type: 'flags',
                onSeries: undefined,
                data: [{
                    x: Date.UTC(2016, 6, 9),
                    title: '2nd'
                },
                {
                    x: Date.UTC(2020, 4, 11),
                    title: '3rd'
                }]
            },
            accessibility: {
                exposeAsGroupOnly: true,
                description: 'Bitcoin Halving Events'
            },
            data: [{
                x: Date.UTC(2016, 6, 9),
                title: '2nd Halving',
                text: 'Reward down: 25 BTC to 12.5 BTC per block'
            },
            {
                x: Date.UTC(2020, 4, 11),
                title: '3rd Halving',
                text: 'Reward down: 12.5 BTC to 6.25 BTC per block'
            }]
        }, {
            type: 'flags',
            color: '#fb922c',
            shape: 'squarepin',
            showInNavigator: true,
            navigatorOptions: {
                type: 'flags',
                data: [{
                    x: Date.UTC(2024, 3, 19),
                    title: '4th'
                }]
            },
            accessibility: {
                exposeAsGroupOnly: true,
                description: 'Bitcoin Halving Events'
            },
            data: [{
                x: Date.UTC(2024, 3, 19),
                title: '4th Halving',
                text: 'Reward down: 6.25 BTC to 3.125 BTC per block'
            }]
        }]
    });
})();
