$(function () {
    $('#container').highcharts({
        title: {
            text: 'basic annotations - circle'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            xValue: 4,
            yValue: 144.0,
            verticalAlign: 'center',
            align: 'center',
            height: 40,
            title: {
                text: 'Now',
                x: 5,
                y: -20
            },
            shape: {
                type: 'circle',
                params: {
                    x: 20,
                    y: 20,
                    r: 20,
                    fill: 'rgba(0,0,0,0)',
                    stroke: Highcharts.getOptions().colors[1],
                    strokeWidth: 2
                }
            }
        }]

    });
});