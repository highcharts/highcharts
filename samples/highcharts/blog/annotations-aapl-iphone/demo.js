$.getJSON('https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/AAPL.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'AAPL Stock Price'
        },

        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value} $'
            }
        },

        tooltip: {
            xDateFormat: '%Y %m',
            valueSuffix: ' $',
            shared: true
        },

        annotations: [{
            labelOptions: {
                shape: 'connector',
                align: 'right',
                justify: false,
                crop: true,
                style: {
                    fontSize: '0.8em',
                    textOutline: '1px white'
                }
            },
            labels: [{
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2007, 5),
                    y: 18.82
                },
                text: 'iPhone'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2008, 7),
                    y: 24.22
                },
                text: 'iPhone 3G'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2009, 6),
                    y: 23.34
                },
                text: 'iPhone 3GS'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2010, 6),
                    y: 36.75
                },
                text: 'iPhone 4'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2011, 10),
                    y: 54.60
                },
                text: 'iPhone 4S'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2012, 9),
                    y: 85.05
                },
                text: 'iPhone 5'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2013, 9),
                    y: 74.67
                },
                text: 'iPhone 5S'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2014, 9),
                    y: 108
                },
                text: 'iPhone 6'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2015, 9),
                    y: 119.50
                },
                text: 'iPhone 6S'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2016, 3),
                    y: 93.74
                },
                text: 'iPhone SE',
                align: 'top'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2016, 9),
                    y: 113.54
                },
                text: 'iPhone 7'
            }]
        }],
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
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
