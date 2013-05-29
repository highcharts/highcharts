$(function () {
    $('#container').highcharts({
        title: {
            text: 'Chart title'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, {
                y: 71.5,
                id: 'point1'
            }, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            anchorY: 'bottom',
            linkedTo: 'point1',
            title: {
                y: -10,
                text: 'Annotated point'
            }
        }]

    }, function (chart) {
        var point = chart.get('point1'),
            series = point.series;

        $('#toggle').click(function () {
            series[series.visible ? 'hide' : 'show']();
        });

        $('#update').click(function () {
            point.update({
                y: parseInt(Math.random() * 250, 10)
            });
        });
    });
});