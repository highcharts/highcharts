(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        accessibility: {
            description: 'Chart shows Apple stock prices from mid 2008 to mid 2015. It shows steady growth with one significant peak lasting through most of 2012 before normalizing.'
        },

        title: {
            text: 'Apple Stock Price 2008 to 2015'
        },

        subtitle: {
            text: 'Accessible stock chart demo'
        },

        rangeSelector: {
            selected: 1
        },

        navigator: {
            series: {
                accessibility: {
                    description: 'Overview series for navigation' // The navigator series could be confusing to screen reader users.
                }
            }
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });

})();