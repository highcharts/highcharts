(async () => {

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
            overscroll: '40px'
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            type: 'areaspline',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            color: '#2caffe',
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, '#2caffe'],
                    [1, '#2caffe00']
                ]
            },
            lastPrice: {
                enabled: true,
                color: 'transparent',
                label: {
                    enabled: true,
                    backgroundColor: '#2caffe',
                    style: {
                        color: '#fff'
                    }
                }
            }
        }]
    });
})();