(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());


    const length = data.length;
    // The control point's visibility
    let cpVisibility = true;

    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            events: {
                load: function () {
                    this.annotations.forEach(function (annotation) {
                        annotation.setControlPointsVisibility(true);
                    });
                }
            }
        },

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
            typeOptions: {
                points: [{
                    x: data[length - 60][0]
                }, {
                    x: data[length - 59][0]
                }]
            },
            events: {
                click: function () {
                    cpVisibility = !cpVisibility;
                    this.setControlPointsVisibility(cpVisibility);
                }
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
})();