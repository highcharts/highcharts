$(function () {

    // Change point shape to a line with three crossing lines for low/median/high
    // Stroke width is hardcoded to 1 for simplicity
    Highcharts.seriesTypes.boxplot.prototype.drawPoints = function () {
        var series = this,
            renderer = series.chart.renderer;

        Highcharts.each(this.points, function (point) {
            var graphic = point.graphic,
                verb = graphic ? 'animate' : 'attr',
                shapeArgs = point.shapeArgs,
                width = shapeArgs.width,
                left = Math.floor(shapeArgs.x) + 0.5,
                right = left + width,
                crispX = left + Math.round(width / 2) + 0.5;

            if (!graphic) {
                point.graphic = graphic = renderer.path('point').attr({ zIndex: 50 }).add(series.group);
            }

            graphic.attr({
                stroke: point.color || series.color,
                "stroke-width": 1
            });

            if (point.low === 0) {
                point.lowPlot -= 1; // Sneakily draw low marker even if 0
            }

            graphic[verb]({
                d: [
                    'M', left, Math.floor(point.highPlot) + 0.5,
                    'L', right, Math.floor(point.highPlot) + 0.5,
                    'M', left, Math.floor(point.medianPlot) + 0.5,
                    'L', right, Math.floor(point.medianPlot) + 0.5,
                    'M', left, Math.floor(point.lowPlot) + 0.5,
                    'L', right, Math.floor(point.lowPlot) + 0.5,
                    'M', crispX, Math.floor(point.highPlot) + 0.5,
                    'L', crispX, Math.floor(point.lowPlot) + 0.5
                ]
            });

            point.stemWidth = 2;
            point.stemColor = '#cccccc';
        });
    };


    // Create chart
    Highcharts.chart('container', {
        accessibility: {
            keyboardNavigation: {
                skipNullPoints: true
            },
            pointDescriptionFormatter: function (point) {
                return point.category + ', low ' + point.low + ', median ' + point.median + ', high ' + point.high;
            },
            seriesDescriptionFormatter: function (series) {
                return series.name + ', series ' + (series.index + 1) + ' of ' + series.chart.series.length + ' with ' + series.points.length + ' data points.';
            }
        },
        chart: {
            type: 'boxplot',
            typeDescription: 'Low, median, high. Each data point has a low, median and high value, depicted vertically as small ticks.', // Describe the chart type to screen reader users, since this is not a traditional boxplot chart
            description: 'Chart depicting fictional fruit consumption data, with the minimum, maximum and median values for each month of 2015. Most plums were eaten in spring, and none at all in July or August. Bananas and apples were both consumed in smaller numbers and steadily throughout the year.'
        },
        title: {
            text: 'Daily company fruit consumption 2015'
        },
        xAxis: [{
            crosshair: true,
            description: 'Months of the year',
            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }],
        yAxis: {
            title: {
                text: 'Fruits consumed'
            },
            min: 0
        },
        plotOptions: {
            series: {
                stickyTracking: true,
                keys: ['low', 'median', 'high'],
                whiskerWidth: 5
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:<br/>Low: <b>{point.low}</b><br/>Median: <b>{point.median}</b><br/>High: <b>{point.high}</b><br/>'
        },
        series: [{
            name: 'Plums',
            data: [
                [0, 8, 19],
                [1, 11, 23],
                [3, 16, 28],
                [2, 15, 28],
                [1, 15, 27],
                [0, 9, 21],
                null,
                null,
                [1, 6, 19],
                [2, 8, 21],
                [2, 9, 22],
                [1, 11, 19]
            ]
        }, {
            name: 'Bananas',
            data: [
                [0, 3, 6],
                [1, 2, 4],
                [0, 2, 5],
                [2, 2, 5],
                [1, 3, 6],
                [0, 1, 3],
                [1, 1, 2],
                [0, 1, 3],
                [1, 1, 3],
                [0, 2, 4],
                [1, 2, 5],
                [1, 3, 5]
            ]
        }, {
            name: 'Apples',
            data: [
                [1, 4, 6],
                [2, 4, 5],
                [1, 3, 6],
                [2, 3, 6],
                [1, 3, 4],
                [0, 2, 4],
                [0, 1, 2],
                [0, 1, 2],
                [0, 1, 2],
                [0, 2, 4],
                [1, 2, 4],
                [1, 3, 4]
            ]
        }]
    });
});
