(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    const trendStart = data[data.length - 110],
        trendEnd = data[data.length - 50];

    // Create the chart
    Highcharts.stockChart('container', {

        annotations: [{
            type: 'crookedLine',
            draggable: '',
            typeOptions: {
                points: [{
                    x: trendStart[0],
                    y: trendStart[1]
                }, {
                    x: trendEnd[0],
                    y: trendEnd[1]
                }]
            },
            shapeOptions: {
                stroke: '#ff0000',
                strokeWidth: 2
            }
        }],

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL Stock Price',
            id: 'aapl',
            data: data,
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 2
            },
            tooltip: {
                valueDecimals: 2
            },
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        }, {
            type: 'trendline',
            linkedTo: 'aapl',
            marker: {
                enabled: false
            }
        }]
    });
})();