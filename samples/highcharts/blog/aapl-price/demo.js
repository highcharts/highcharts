fetch(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json'
)
    .then(response => response.json())
    .then(result =>
        // Create the chart
        Highcharts.stockChart('container', {
            chart: {
                zoomType: 'xy'
            },

            rangeSelector: {
                selected: 4
            },

            title: {
                text: 'AAPL Stock Price'
            },

            series: [
                {
                    name: 'AAPL',
                    data: result,
                    tooltip: {
                        valueDecimals: 2
                    }
                }
            ]
        })
    )
    .catch(error => console.log(error));
