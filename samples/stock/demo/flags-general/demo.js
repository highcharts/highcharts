(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@1485682/samples/data/btc-historical.json'
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
            overscroll: 31536000000 // 1 year
        },

        series: [{
            name: 'Bitcoin Price',
            color: '#ffbf00',
            data: data,
            id: 'dataseries',
            tooltip: {
                pointFormat: `<span style='color:{point.color}'>●</span>
                    {series.name}: <b>{point.y:.2f}$</b><br/>`
            }

            // the event marker flags
        }, {
            type: 'flags',
            color: '#fb922c',
            onSeries: 'dataseries',
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
