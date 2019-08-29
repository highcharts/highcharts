Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        yAxis: [{
            height: '48%'
        }, {
            height: '40%',
            top: '60%'
        }],

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            yAxis: 1,
            type: 'aroon',
            linkedTo: 'aapl',
            color: 'green',
            lineWidth: 1,
            aroonDown: {
                styles: {
                    lineColor: 'red'
                }
            },
            params: {
                period: 25
            }
        }]
    });
});
