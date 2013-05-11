$(function () {
    $('#container').highcharts({
        title: {
            text: 'basic annotations demo'
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
            xValue: 8,
            yValue: 216.4,
            verticalAlign: "bottom",
            align: "center",
            width: 30,
            height: 40,
            title: {
                text: "High",
                x: 0,
                y: 0
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 15, 20, 'L', 15, 32],
                    stroke: Highcharts.getOptions().colors[0],
                    strokeWidth: 2
                }
            }
        }, {
            xValue: 0,
            yValue: 29.9,
            verticalAlign: "center",
            align: "left",
            width: 30,
            height: 25,
            title: {
                text: "Low",
                x: 30,
                y: 0
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 30, 12, 'L', 10, 12],
                    stroke: Highcharts.getOptions().colors[0],
                    strokeWidth: 2
                }
            }
        }]

    });
});