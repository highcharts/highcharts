

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
            }]
        });

        chart.series.forEach(function (s) {
            assert.close(
                s.legendGroup.translateY,
                chart.plotTop - chart.spacing[0] + s.points[2].plotY,
                20,
                'Label should be next to last point'
            );
        });
    }
);