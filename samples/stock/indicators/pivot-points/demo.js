
$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

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
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data,
            zIndex: 1
        }, {
            type: 'pivotpoints',
            linkedTo: 'aapl',
            zIndex: 0,
            lineWidth: 1,
            dataLabels: {
                overflow: 'none',
                crop: false,
                y: 4,
                style: {
                    fontSize: 9
                }
            }
        }, {
            type: 'pivotpoints',
            linkedTo: 'aapl',
            zIndex: 0,
            lineWidth: 1,
            visible: false,
            name: 'Camarilla PP (56)',
            params: {
                algorithm: 'camarilla',
                period: 56
            },
            dataLabels: {
                overflow: 'none',
                crop: false,
                y: 4,
                style: {
                    fontSize: 9
                }
            }
        }, {
            type: 'pivotpoints',
            linkedTo: 'aapl',
            zIndex: 0,
            lineWidth: 1,
            visible: false,
            params: {
                algorithm: 'fibonacci',
                period: 14
            },
            name: 'Fibonacci PP (14)',
            dataLabels: {
                overflow: 'none',
                crop: false,
                y: 4,
                style: {
                    fontSize: 9
                }
            }
        }]
    });
});
