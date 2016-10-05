$(function () {

    QUnit.test('Custom point.group option (#5681)', function (assert) {

        assert.expect(0);
        Highcharts.chart('container', {

            chart: {
                type: 'column'
            },

            series: [{
                data: [{
                    y: 95,
                    group: 'test'
                }, {
                    y: 102.9
                }]
            }]

        });
    });

    QUnit.test('Update className after initially selected (#5777)', function (assert) {

        ['line', 'column', 'pie'].forEach(function (type) {
            var chart = Highcharts.chart('container', {

                chart: {
                    type: type,
                    animation: false
                },

                series: [{
                    data: [{
                        y: 1,
                        selected: true,
                        sliced: true
                    }, {
                        y: 2
                    }, {
                        y: 3
                    }],
                    allowPointSelect: true,
                    animation: false
                }]

            });

            assert.strictEqual(
                chart.series[0].points[0].graphic.hasClass('highcharts-point-select'),
                true,
                'Class is there initially (' + type + ')'
            );

            // Select the second point, first point should toggle back to unselected
            chart.series[0].points[1].select();
            assert.strictEqual(
                chart.series[0].points[0].graphic.hasClass('highcharts-point-select'),
                false,
                'Selected class is removed (' + type + ')'
            );
        });
    });
});