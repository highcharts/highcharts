$(function () {
    QUnit.test('Test different reversedStacks options for 3D.', function (assert) {
        var options = {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        viewDistance: 25,
                        depth: 40
                    },
                },
                yAxis: {
                    reversedStacks: false
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        depth: 40
                    }
                },
                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2]
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, 2, 5, 3, 4, 4, 2, 5, 3, 4, 4, 2, 5]
                }, {
                    name: 'Jane',
                    data: [2, 5, 6, 2, 1, 2, 5, 6, 2, 1, 2, 5, 6, 2, 1]
                }, {
                    name: 'Janet',
                    data: [3, 0, 4, 4, 3, 3, 0, 4, 4, 3, 3, 0, 4, 4, 3]
                }]
            },
            chart_1, chart_2;

        chart_1 = $("#container_1").highcharts(options).highcharts();
        options.yAxis.reversedStacks = true;
        chart_2 = $("#container_2").highcharts(options).highcharts();

        // non-reversed stacks
        for (var i = chart_1.series.length - 1; i >= 1; i--) {
            assert.strictEqual(
                chart_1.series[i].options.zIndex > chart_1.series[i - 1].options.zIndex,
                true,
                'Series ascending order'
            );
        };

        // reversed stacks
        for (var j = chart_2.series.length - 1; j >= 1; j--) {
            assert.strictEqual(
                chart_2.series[j].options.zIndex < chart_2.series[j - 1].options.zIndex,
                true,
                'Series descendig order'
            );
        };
    });
});