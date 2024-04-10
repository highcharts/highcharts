(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        legend: {
            enabled: true
        },

        yAxis: [{
            height: '55%'
        }, {
            height: '40%',
            top: '60%'
        }],

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'dpo',
            linkedTo: 'aapl',
            yAxis: 1,
            lineWidth: 2,
            marker: {
                enabled: false
            },
            params: {
                period: 20,
                index: 3
            }
        }]

    });

})();