$(function () {
    QUnit.test('Proper plotY for first point when using yAxis.max', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'waterfall'
                },

                xAxis: {
                    type: 'category'
                },

                yAxis: {
                    max: -2000000
                },

                series: [{
                    data: [{
                        name: 'Start',
                        y: -5200000
                    }, {
                        name: 'Product Revenue',
                        y: -569000
                    }, {
                        name: 'Service Revenue',
                        y: -231000
                    }, {
                        name: 'Positive Balance',
                        isIntermediateSum: true,
                        color: Highcharts.getOptions().colors[1]
                    }, {
                        name: 'Fixed Costs',
                        y: -342000
                    }, {
                        name: 'Variable Costs',
                        y: -233000
                    }, {
                        name: 'Balance',
                        isSum: true,
                        color: Highcharts.getOptions().colors[1]
                    }]
                }]
            }).highcharts(),
            point = chart.series[0].points[0];

        assert.ok(
            Math.abs(
                point.graphic.attr('y') + point.graphic.attr('height') -
                chart.yAxis[0].toPixels(point.y, true)
            ) < 2,
            'Intermediate sum inside plot area'
        );
    });
});