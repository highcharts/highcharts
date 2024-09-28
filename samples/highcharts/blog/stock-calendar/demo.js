(async () => {

    let data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    const DAY = 1000 * 60 * 60 * 24;

    // Correct the x values to show full day (-13.5h)
    data = data.map(point => {
        point[0] = point[0] - DAY / 24 * 13.5;

        return point;
    });

    const dateFormat = Highcharts.dateFormat,
        firstX = data[0][0],
        lastX = data[data.length - 1][0],
        showDataInfo = (chart, point, date) => {
            const plotLinesAndBands = chart.xAxis[0].plotLinesAndBands;

            if (plotLinesAndBands && plotLinesAndBands.length) {
                plotLinesAndBands[0].destroy();
            }

            chart.xAxis[0].addPlotLine({
                value: date,
                color: 'red',
                lineWidth: 3
            });

            document.getElementById('openCell').innerText =
                (point.custom.open).toFixed(2) + '$';
            document.getElementById('highCell').innerText =
                (point.custom.high).toFixed(2) + '$';
            document.getElementById('lowCell').innerText =
                (point.custom.low).toFixed(2) + '$';
            document.getElementById('closeCell').innerText =
                (point.y).toFixed(2) + '$';
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
                        const point = this,
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

    }, chart => {
        const lastPoint =
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
                const clickedDateStr = dateText.split('-'),
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

                const points = chart.series[0].points;

                let point;

                for (const i in points) {
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
})();