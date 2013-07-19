$(function () {
    $('#container').highcharts({

        chart: {},

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        },
        
        legend: {
            align: 'left',
            verticalAlign: 'top',
            x: 250,
            y: 100,
            floating: true
        },

        tooltip: {
            avoidLegend: true,
            shared: true
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'

        }, {
            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
        }]

    });
});