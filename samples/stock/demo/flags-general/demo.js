(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@1485682/samples/data/btc-ohlc-historical.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        title: {
            text: 'Bitcoin Historical Price and Halvings'
        },

        xAxis: {
            overscroll: 2678400000 // 31 days
        },

        yAxis: {
            labels: {
                align: 'left'
            }
        },

        series: [{
            name: 'Bitcoin Price',
            data: data,
            id: 'dataseries',
            type: 'candlestick'

            // the event marker flags
        }, {
            type: 'flags',
            accessibility: {
                exposeAsGroupOnly: true,
                description: 'Bitcoin Halving Events'
            },
            data: [
                {
                    x: Date.UTC(2012, 10, 28),
                    title: '1st',
                    text: '1st Halving'
                },
                {
                    x: Date.UTC(2016, 6, 9),
                    title: '2nd',
                    text: '2nd Halving'
                },
                {
                    x: Date.UTC(2020, 4, 11),
                    title: '3rd',
                    text: '3rd Halving'
                },
                {
                    x: Date.UTC(2024, 3, 19),
                    title: '4th',
                    text: '4th Halving'
                }
            ],
            onSeries: 'dataseries',
            shape: 'circlepin',
            width: 16
        }]
    });
})();
