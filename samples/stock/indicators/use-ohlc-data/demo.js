Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'Plot line on Y axis'
        },

        legend: {
            enabled: true
        },
        yAxis: [{
            height: '70%'
        }, {
            height: '30%',
            top: '70%'
        }],

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            type: 'line',
            useOhlcData: true,
            id: 'aapl',
            name: 'AAPL Stock Price',
            yAxis: 0,
            data: data
        }, {
            type: 'atr',
            yAxis: 1,
            linkedTo: 'aapl'
        }]
    });
});
