$(function () {
    $('#container').highcharts({
        title: {
            text: 'Highcharts <= 3.0.9, Axis.remove didn\'t remove all child series. Only one line series should remain.'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: [{
        }, {
            opposite: true
        }],
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [1, 2, 3]
        },

        {
            name: 'Tokyo',
            yAxis: 1,
            type: 'column',
            data: [100, 100, 100]
        }, {
            name: 'New York',
            yAxis: 1,
            type: 'column',
            data: [100, 100, 100]
        }, {
            name: 'Berlin',
            yAxis: 1,
            type: 'column',
            data: [100, 100, 100]
        }, {
            name: 'London',
            yAxis: 1,
            type: 'column',
            data: [100, 100, 100]
        }]
    }, function (chart) {
        chart.yAxis[1].remove();
    });

});

