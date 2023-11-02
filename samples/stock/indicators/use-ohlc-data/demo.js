(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

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
})();