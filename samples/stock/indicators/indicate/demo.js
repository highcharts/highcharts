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

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'indicate',
            linkedTo: 'aapl',
            name: 'Marker',
            params: {
                period: 7
            },
            indicateCallback: function (context) {
                const { periodValues, x, y } = context;
                const average = periodValues.reduce((sum, xy, i, array) => {
                    sum = sum + xy[1];
                    if (i === array.length - 1) {
                        sum = sum / array.length;
                    }
                    return sum;
                }, 0);
                const delta = y / average;

                if (delta < 0.92) {
                    return { text: '❌', x, y };
                }

                if (delta > 1.08) {
                    return { text: '🟢', x, y };
                }
            }
        }]
    });
})();
