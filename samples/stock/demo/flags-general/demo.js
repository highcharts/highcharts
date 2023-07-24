(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 0
        },

        title: {
            text: 'USD to EUR exchange rate'
        },

        tooltip: {
            style: {
                width: '200px'
            },
            valueDecimals: 4,
            shared: true
        },

        yAxis: {
            title: {
                text: 'Exchange rate'
            }
        },

        series: [{
            name: 'USD to EUR',
            data: data,
            id: 'dataseries'

        // the event marker flags
        }, {
            type: 'flags',
            accessibility: {
                exposeAsGroupOnly: true,
                description: 'Flagged events.'
            },
            data: [{
                x: Date.UTC(2021, 11, 2),
                title: 'A',
                text: 'Some event with a description'
            }, {
                x: Date.UTC(2021, 11, 15),
                title: 'B',
                text: 'Some event with a description'
            }, {
                x: Date.UTC(2021, 11, 22),
                title: 'C',
                text: 'Some event with a description'
            }],
            onSeries: 'dataseries',
            shape: 'circlepin',
            width: 16
        }]
    });
})();