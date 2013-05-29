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
            id: 'series1',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            xValue: 6,
            yValue: 176,
            anchorX: 'right',
            anchorY: 'bottom',
            linkedTo: 'series1',
            title: {
                text: 'anntoations'
            }
        }]

    }, function (chart) {
        var series = chart.get('series1');

        $('#toggle').click(function () {
            series[series.visible ? 'hide' : 'show']();
        });
    });
});