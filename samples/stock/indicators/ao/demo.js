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

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        yAxis: [{
            height: '60%'
        }, {
            top: '65%',
            height: '35%',
            offset: 0
        }],

        series: [{
            type: 'candlestick',
            id: 'AAPL',
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }, {
            type: 'ao',
            yAxis: 1,
            greaterBarColor: '#00cc66',
            lowerBarColor: '#FF5E5E',
            linkedTo: 'AAPL',
            showInLegend: true
        }]
    });
})();