$(function () {
    QUnit.test('Column update', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                animation: false
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                type: 'column',
                animation: false,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]

        }).highcharts();

        var point = chart.series[0].points[0];
        point.update({ y: 100 });


        assert.notEqual(
            point.graphic.element.getAttribute('visibility'),
            'hidden',
            'Point is visible'
        );

    });

});