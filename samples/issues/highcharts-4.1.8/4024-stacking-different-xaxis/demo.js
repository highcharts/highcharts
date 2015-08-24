$(function () {
    QUnit.test('Stacks with different xAxis.', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                xAxis: [{
                    width: 200,
                    offset: 0
                }, {
                    width: 200,
                    offset: 0,
                    left: 300
                }],
                plotOptions: {
                    column: {
                        stacking: true
                    },
                },
                yAxis: {
                    stackLabels: {
                        enabled: true
                    }
                },
                series: [{
                    data: [1, 2, 3]
                }, {
                    data: [1, 2, 3],
                    xAxis: 1
                }]
            }).highcharts();

        assert.strictEqual(
            chart.series[0].data[0].yBottom,
            chart.series[1].data[0].yBottom,
            'Separate stacks'
        );
        
    });

});