Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlcv.json', function (data) {

    var DAY = 1000 * 60 * 60 * 24;

    // Correct the x values to show full day (-13.5h)
    data = data.map(function (point) {
        point[0] = point[0] - DAY / 24 * 13.5;

        return point;
    });

    var dateFormat = Highcharts.dateFormat,
        firstX = data[0][0],
        lastX = data[data.length - 1][0],
        showDataInfo = function (chart, point, date) {
            var plotLinesAndBands = chart.xAxis[0].plotLinesAndBands;

            if (plotLinesAndBands && plotLinesAndBands.length) {
                plotLinesAndBands[0].destroy();
            }

            chart.xAxis[0].addPlotLine({
                value: date,
                color: 'red',
                lineWidth: 3
            });

            openCell.innerText = (point.custom.open).toFixed(2) + '$';
            highCell.innerText = (point.custom.high).toFixed(2) + '$';
            lowCell.innerText = (point.custom.low).toFixed(2) + '$';
            closeCell.innerText = (point.y).toFixed(2) + '$';
        };

    Highcharts.stockChart('chart-container', {

        navigator: {
            enabled: false
        },

        rangeSelector: {
            enabled: false
        },

        scrollbar: {
            enabled: false
        },

        tooltip: {
            enabled: false
        },

        xAxis: {
            min: data[data.length - 21][0],
            max: lastX
        },

        series: [{
            keys: ['x', 'custom.open', 'custom.high', 'custom.low', 'y'],
            type: 'area',
            data: data,
            threshold: null,
            fillOpacity: 0.3,
            point: {
                events: {
                    mouseOver: function () {
                        var point = this,
                            chart = point.series.chart;

                        $('#date-picker').datepicker(
                            'setDate',
                            dateFormat('%Y-%m-%d', point.x)
                        );

                        if (point) {
                            showDataInfo(chart, point, point.x);
                        }
                    }
                }
            }
        }]

    }, function (chart) {
        var lastPoint =
            chart.series[0].points[chart.series[0].points.length - 1];

        // Highlight the current (last) point
        showDataInfo(chart, lastPoint, lastPoint.x);

        $('#date-picker').datepicker({
            beforeShowDay: $.datepicker.noWeekends,
            // First available date
            minDate: -Math.ceil(lastX - firstX) / DAY - 1,
            maxDate: -1 // today
        });

        $.datepicker.setDefaults({
            // Set the datepicker's date format
            dateFormat: 'yy-mm-dd',
            onSelect: function (dateText) {
                var points,
                    point,
                    clickedDateStr = dateText.split('-'),
                    clickedDate = Date.UTC(
                        clickedDateStr[0],
                        clickedDateStr[1] - 1,
                        clickedDateStr[2]
                    );

                // Show 20 points on the graph
                chart.xAxis[0].setExtremes(
                    clickedDate - DAY * 10,
                    clickedDate + DAY * 10
                );

                points = chart.series[0].points;

                for (var i in points) {
                    if (dateFormat('%Y-%m-%d', points[i].x) === dateText) {
                        point = points[i];
                        break;
                    }
                }

                if (point) {
                    showDataInfo(chart, point, clickedDate);
                }
            }
        });

    });
});
