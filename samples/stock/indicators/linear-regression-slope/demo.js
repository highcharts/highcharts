(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.setOptions({
        yAxis: {
            lineWidth: 2,
            labels: {
                x: -2
            }
        }
    });

    Highcharts.stockChart('container', {
        yAxis: [{
            title: {
                text: 'OHLC'
            },
            height: '60%',
            resize: {
                enabled: true
            }
        }, {
            title: {
                text: 'Linear Regression Slope'
            },
            top: '65%',
            height: '35%',
            offset: 0
        }],
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
            type: 'linearRegressionSlope',
            linkedTo: 'base',
            yAxis: 1,
            zIndex: -1,
            params: {
                period: 5
            }
        }, {
            type: 'linearRegressionSlope',
            linkedTo: 'base',
            yAxis: 1,
            zIndex: -1,
            params: {
                period: 20
            }
        }],

        tooltip: {
            shared: true,
            split: false
        }
    });
})();