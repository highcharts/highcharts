

QUnit.test(
    'Legend layout',
    function (assert) {

        var chart = Highcharts.chart('container', {
            legend: {
                layout: 'proximate',
                align: 'right'
            },

            series: [{
                data: [1, 1, 1]
            }, {
                data: [2, 2, 2]
            }, {
                data: [4, 4, 4]
            }, {
                data: [null, null, null] // #8638
            }]
        });

        chart.series.forEach(function (s) {
            var y = s.points[2].plotY || s.yAxis.height;

            assert.close(
                s.legendGroup.translateY,
                chart.plotTop - chart.spacing[0] + y,
                20,
                'Label should be next to last point'
            );
        });
    }
);