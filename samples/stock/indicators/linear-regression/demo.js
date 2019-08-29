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
        series: [{
            type: 'ohlc',
            data: data,
            id: 'base'
        }, {
            type: 'linearRegression',
            linkedTo: 'base',
            zIndex: -1,
            params: {
                period: 5
            }
        }, {
            type: 'linearRegression',
            linkedTo: 'base',
            zIndex: -1,
            params: {
                period: 100
            }
        }],
        tooltip: {
            shared: true,
            split: false
        }
    });
});
