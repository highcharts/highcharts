(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        xAxis: {
            overscroll: '10px'
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            step: true,
            tooltip: {
                valueDecimals: 2
            },
            lastPrice: {
                enabled: true,
                color: 'transparent',
                label: {
                    enabled: true,
                    backgroundColor: '#ffffff',
                    borderColor: '#2caffe',
                    borderWidth: 1,
                    style: {
                        color: '#000000'
                    }
                }
            }
        }]
    });
})();