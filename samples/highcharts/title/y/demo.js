$(function () {
    Highcharts.chart('container', {
        chart: {
            plotBorderWidth: 1
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        title: {
            text: 'My custom title',
            align: 'left',
            x: 90,
            y: 30,
            floating: true
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});