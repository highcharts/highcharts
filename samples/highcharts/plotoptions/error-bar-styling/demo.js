var chart;
$(function () {
    $('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Temperature'
        },
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }],
        yAxis: {
            labels: {
                format: '{value}°C'
            },
            title: {
                text: 'Temperature'
            }
        },

        tooltip: {
            shared: true
        },

        series: [{
            name: 'Temperature',
            type: 'spline',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            marker: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}°C</b><br/>'
            }
        }, {
            color: '#FF0000',
            name: 'Temperature error',
            type: 'errorbar',
            data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
            tooltip: {
                pointFormat: 'Error range: {point.low}-{point.high}°C'
            },
            stemWidth: 3,
            whiskerLength: 0
        }]
    });
});