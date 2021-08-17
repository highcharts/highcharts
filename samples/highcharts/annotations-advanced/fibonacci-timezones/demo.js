Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {
    var length = data.length;

    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            events: {
                load: function () {
                    this.annotations.forEach(function (annotation) {
                        annotation.setControlPointsVisibility(true);
                        annotation.cpVisibility = true;
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
                    this.cpVisibility = !this.cpVisibility;
                    this.setControlPointsVisibility(this.cpVisibility);
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
});