$(function () {

    $('#container').highcharts({
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
