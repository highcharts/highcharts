$(function () {
    $('#container').highcharts({
        title: {
            text: 'dynamically added annotations'
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

        annotations: []

    }, function (chart) {
        var series = chart.series[0];

        $('#add').click(function () {
            var annotation = generateAnnotation(series);
            chart.annotations.add(annotation);
        });
    });

    function generateAnnotation (series) {
        var annotations = series.chart.annotations,
            xData = series.xData,
            point,
            n;

        n = parseInt(Math.random() * xData.length, 10);
        point = xData[n];

        return {
            xValue: xData[n],
            yValue: series.yData[n],
            anchorY: "bottom",
            anchorX: 'center',
            width: 80,
            height: 40,
            title: {
                text: "Annotation " + annotations.allItems.length
            },
            shape: {
                type: 'path',
                params: {
                    d: ['M', 40, 20, 'L', 40, 32],
                    stroke: series.color,
                    strokeWidth: 2
                }
            }
        };
    }
});