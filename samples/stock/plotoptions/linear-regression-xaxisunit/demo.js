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
            name: 'Linear Regression Slope: 1 mintue xAxisUnit',
            linkedTo: 'base',
            yAxis: 1,
            zIndex: -1,
            params: {
                period: 5,
                xAxisUnit: 60 * 1000 // 1 minute
            }
        }],
        tooltip: {
            valueDecimals: 6,
            shared: true,
            split: false
        }
    });
})();