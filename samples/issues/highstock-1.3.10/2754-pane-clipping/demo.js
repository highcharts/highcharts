$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            inputEnabled: true,
            selected: 1
        },

        title: {
            text: 'AAPL Historical'
        },

        yAxis: [{
            title: {
                text: 'OHLC'
            },
            height: 160,
            lineWidth: 2,
            min: 0,
            max: 100
        }, {
            title: {
                text: 'Volume'
            },
            top: 248,
            height: 60,
            offset: 0,
            lineWidth: 2,
            min: 0,
            max: 100
        }],

        navigator: {
            yAxis: {
                min: 0,
                max: 100
            }
        },

        series: [{
            type: 'area',
            name: 'AAPL',
            data: [50, -50, 150, 50]
        }, {
            type: 'area',
            name: 'Volume',
            yAxis: 1,
            data: [50, -50, 150, 50]
        }]
    });
});