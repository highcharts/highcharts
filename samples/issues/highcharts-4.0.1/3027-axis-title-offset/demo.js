$(function () {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            type: 'column',
            borderWidth: 1
        },

        subtitle: {
            text: 'Y axis labels were truncated, no space reserved'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
                'Dec'
            ]
        },

        yAxis: {
            lineWidth: 1,
            tickWidth: 1,
            title: {
                align: 'high',
                offset: 0,
                text: 'Rai',
                rotation: 0,
                y: -10
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });
});