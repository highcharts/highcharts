$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            spacingRight: 0
        },

        rangeSelector: {
            selected: 1
        },

        navigator: {
            enabled: false
        },

        scrollbar: {
            enabled: false
        },

        title: {
            text: 'AAPL Stock Price'
        },

        yAxis: [{
            opposite: false,
            offset: 20,
            tickWidth: 1,
            tickLength: 5,
            lineWidth: 1
        }, {
            offset: 20,
            tickWidth: 1,
            tickLength: 5,
            lineWidth: 1,
            labels: {
                align: 'left'
            },
            linkedTo: 0
        }],

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});
