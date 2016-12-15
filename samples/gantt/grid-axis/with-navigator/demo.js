$(function () {

    // THE CHART
    Highcharts.stockChart('container', {
        chart: {
            type: 'scatter',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Grid axis with navigator'
        },

        xAxis: [{
            id: 'bottom-datetime-axis',
            grid: true,
            opposite: true,
            type: 'datetime',
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}'
            }
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            labels: {
                format: '{value:Week %W}',
                style: {
                    fontSize: '15px'
                }
            },
            linkedTo: 0
        }],
        yAxis: [{
            title: '',
            opposite: false,
            categories: ['Prototyping', 'Development', 'Testing'],
            grid: true
        }],
        series: [{
            name: 'Project 1',
            borderRadius: 10,
            xAxis: 0,
            data: [{
                x: new Date(2014, 10, 18, 12),
                y: 0
            }, {
                x: new Date(2014, 10, 20, 12),
                y: 1
            }, {
                x: new Date(2014, 10, 23, 12),
                y: 2
            }, {
                x: new Date(2014, 10, 26, 12),
                y: 0
            }]
        }]
    });
});
