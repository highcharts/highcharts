(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    const length = data.length;

    // Create the chart
    const chart = Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'With Fibonacci Time Zones'
        },

        annotations: [{
            type: 'fibonacciTimeZones',
            controlPointOptions: {
                visible: true
            },
            typeOptions: {
                points: [{
                    x: data[length - 60][0]
                }, {
                    x: data[length - 59][0]
                }]
            }
        }],

        xAxis: {
            ordinal: false
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]

    });

    const applyColors = document.getElementById('applyColors');

    applyColors.onclick = function () {
        chart.annotations[0].update({
            typeOptions: {
                line: {
                    fill: '#06d001',
                    stroke: '#06d001',
                    strokeWidth: 2
                }
            }
        });
    };
})();
