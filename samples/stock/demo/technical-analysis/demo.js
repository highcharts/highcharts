(async () => {

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@c44c51a/samples/data/mini-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        yAxis: {
            plotBands: [{
                color: 'rgba(169, 255, 101, 0.4)',
                from: 182.94,
                to: 177.57,
                zIndex: 3,
                label: {
                    text: 'Resistance Zone'
                }
            }]
        },

        annotations: [{
            type: 'fibonacci',
            langKey: 'Fibonacci',
            typeOptions: {
                points: [{
                    x: 1631021400000,
                    y: 157.26
                }, {
                    x: 1633354200000,
                    y: 157.26
                }],
                height: 138.27 - 157.26,
                xAxis: 0,
                yAxis: 0
            }
        }, {
            type: 'crookedLine',
            langKey: 'Trendline',
            typeOptions: {
                points: [{
                    x: 1636727400000,
                    y: 147.48
                }, {
                    x: 1642516200000,
                    y: 182.5
                }]
            },
            shapeOptions: {
                stroke: 'orange',
                strokeWidth: 2
            }
        }],

        series: [{
            id: 'main',
            type: 'candlestick',
            color: '#FF6F6F',
            upColor: '#6FB76F',
            data,
            dataGrouping: {
                enabled: false
            }
        }]

    });
})();
