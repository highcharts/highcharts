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

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        yAxis: [{
            height: '55%'
        }, {
            height: '35%',
            top: '65%',
            tickPositions: [-100, -80, -50, -20, 0],
            plotBands: [{
                from: -20,
                to: -80,
                color: 'rgba(0, 0, 0, 0.10)'
            }, {
                from: 0,
                to: -20,
                color: 'rgba(0, 255, 0, 0.12)'
            }, {
                from: -80,
                to: -100,
                color: 'rgba(0, 255, 0, 0.12)'
            }],
            plotLines: [{
                value: -80,
                width: 1.5,
                dashStyle: 'dash',
                color: 'rgba(0, 255, 0, 0.3)',
                zIndex: 3
            }, {
                value: -20,
                width: 1.5,
                dashStyle: 'dash',
                color: 'rgba(0, 255, 0, 0.3)',
                zIndex: 3
            }, {
                value: -50,
                width: 1,
                dashStyle: 'dash',
                color: 'rgba(0, 0, 0, 0.5)',
                zIndex: 3
            }]
        }],

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            yAxis: 1,
            type: 'williamsr',
            linkedTo: 'aapl',
            color: 'green',
            lineWidth: 1.5,
            marker: {
                enabled: false
            },
            params: {
                period: 14
            },
            zones: [{
                value: -80,
                color: 'green'
            }, {
                value: -20,
                color: '#bbb'
            }]
        }]
    });
})();