

$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            marginRight: 50
        },
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        xAxis: {
            crosshair: true
        },

        yAxis: {
            opposite: true,
            crosshair: {
                label: {
                    enabled: true,
                    format: '{value:.2f}'
                }
            },
            labels: {
                align: 'left',
                format: '{value:.2f}',
                y: 6,
                x: 2
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
});

