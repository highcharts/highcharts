$(function () {
    $('#container').highcharts({
        chart: {
            ignoreHiddenSeries: false,
            type: 'line'
        },
        title: {
            text: 'Ignore hidden series is set to false'
        },
        subtitle: {
            text: 'When hiding one of the series, it is still considered for axis layout, so the plot area doesn\'t redraw'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        plotOptions: {
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [148.5, 116.4, 104.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6]
        }]
    });
});