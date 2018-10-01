$.getJSON('https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/AAPL.json', function (data) {

    for (var i = 0; i < data.length; i++) {

        data[i][0] = Date.parse(data[i][0]);
    }

    // Create the chart
    Highcharts.stockChart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'AAPL Stock Price'
        },
        yAxis: {
            labels: {
                format: '{value} $'
            },
            opposite: false
        },

        tooltip: {
            valueSuffix: ' $'
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
                    x: Date.UTC(2008, 1, 5), //2008-02-5
                    y: 18.48
                },
                text: 'iPhone'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2008, 6, 11), //2008-07-11
                    y: 24.65
                },
                text: 'iPhone 3G'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2009, 5, 19), //2009-06-19
                    y: 19.93
                },
                text: 'iPhone 3GS'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2010, 5, 24), //2010-06-24
                    y: 38.48
                },
                text: 'iPhone 4'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2011, 9, 14), //2011-10-14
                    y: 60.29
                },
                text: 'iPhone 4S'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2012, 8, 21), //2012-09-21
                    y: 100.01
                },
                text: 'iPhone 5'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2013, 8, 20), //2013-09-20
                    y: 66.77
                },
                text: 'iPhone 5S'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2014, 8, 19), //2014-09-19
                    y: 100.96
                },
                text: 'iPhone 6'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2015, 8, 25), //2015-09-25
                    y: 114.71
                },
                text: 'iPhone 6S'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2016, 2, 31), //2016-03-31
                    y: 108.99
                },
                text: 'iPhone SE',
                align: 'top'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2016, 8, 16), //2016-09-16
                    y: 114.92
                },
                text: 'iPhone 7'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2017, 8, 22), //2017-09-22
                    y: 151.82
                },
                text: 'iPhone 8'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2017, 10, 3), //2017-11-3
                    y: 174.25
                },
                text: 'iPhone X'
            }, {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: Date.UTC(2018, 8, 21), //2018-09-21
                    y: 217.66
                },
                text: 'iPhone XS'
            }]
        }],

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});
