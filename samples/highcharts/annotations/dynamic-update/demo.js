$(function() {
    $('#container').highcharts({
        title: {
            text: 'dynamically updated annotations'
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
            xValue: 0,
            yValue: 29.9,
            verticalAlign: "bottom",
            align: "center",
            width: 80,
            height: 40,
            title: {
                text: "Annotation 0"
            },
            shape: {
                type: "path",
                params: {
                    d: ["M", 40, 20, "L", 40, 32],
                    stroke: "#2f7ed8",
                    strokeWidth: 2
                }
            }
        }]

    }, function (chart) {
        var series = chart.series[0],
            x = 1;

        $('#update').click(function () {
            var annotation = chart.annotations.allItems[0],
                xData = series.xData,
                options,
                n;

            n = parseInt(Math.random() * xData.length, 10);

            options = {
                xValue: xData[n],
                yValue: series.yData[n],
                title: {
                    text: "Annotation " + x
                }
            };

            annotation.update(options);
            x++;
        });
    });
});