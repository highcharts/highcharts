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

        yAxis: [{
            height: '48%'
        }, {
            height: '40%',
            top: '60%',
            labels: {
                format: '{value}%'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#000',
                dashStyle: 'dash',
                zIndex: 1
            }]
        }],

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'trix',
            linkedTo: 'aapl',
            yAxis: 1
        }, {
            type: 'trix',
            linkedTo: 'aapl',
            params: {
                period: 50
            },
            yAxis: 1
        }]
    });
});
