(function (H) {
    H.wrap(H.Tooltip.prototype, 'refresh', function (proceed, points) {

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        // For each point add or update trackball
        H.each(points, function (point) {
            // Function variables
            var series = point.series,
                chart = series.chart,
                pointX = point.plotX + series.xAxis.pos,
                pointY = H.pick(point.plotClose, point.plotY) + series.yAxis.pos;

            // If trackball functionality does not already exist
            if (!series.options.marker) {
                // If trackball is not defined
                if (!series.trackball) {
                    // Creates a new trackball with same color as the series
                    series.trackball = chart.renderer.circle(pointX, pointY, 5).attr({
                        fill: series.color,
                        stroke: 'white',
                        'stroke-width': 1,
                        zIndex: 5
                    }).add();
                } else {
                    // Updates the position of the trackball
                    series.trackball.attr({
                        x: pointX,
                        y: pointY
                    });
                }
            }
        });
    });

    H.wrap(H.Tooltip.prototype, 'hide', function (proceed) {
        var series = this.chart.series;
        // Run original proceed method
        proceed.apply(this);
        // For each series destroy trackball
        H.each(series, function (serie) {
            var trackball = serie.trackball;
            if (trackball) {
                serie.trackball = trackball.destroy();
            }
        });
    });
}(Highcharts));

$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {

    // Split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        i;

    for (i = 0; i < dataLength; i++) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    // Set the allowed units for data grouping
    var groupingUnits = [
        [
            'week', // unit name
            [1] // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]
    ];

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Historical'
        },

        yAxis: [{
            title: {
                text: 'OHLC'
            },
            height: '70%',
            lineWidth: 2
        }, {
            title: {
                text: 'Volume'
            },
            top: '75%',
            height: '25%',
            offset: 0,
            lineWidth: 2
        }],

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
});