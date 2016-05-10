$(function () {
    QUnit.test('Gap size for multiple series', function (assert) {
        var chart = Highcharts.stockChart('container', {
            "xAxis": {
                "min": 0
            },
            plotOptions: {
                series: {
                    gapSize: 1,
                    lineWidth: 10
                }
            },
            "series": [{
                name: 'Spacing = 1',
                data: [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [4, 1],
                    [5, 1],
                    [6, 1]
                ]
            }, {
                name: 'Spacing = 2',
                data: [
                    [0, 2],
                    [2, 2],
                    [4, 2],
                    [8, 2],
                    [10, 2],
                    [12, 2]
                ]
            }, {
                name: 'Spacing = 3',
                data: [
                    [0, 3],
                    [3, 3],
                    [6, 3],
                    [9, 3],
                    [15, 3],
                    [18, 3]
                ]
            }]
        });

        assert.strictEqual(
            chart.series[0].graph.attr('d').match(/M/g).length,
            2,
            'series[0] has two moveTo statements'
        );
        assert.strictEqual(
            chart.series[1].graph.attr('d').match(/M/g).length,
            2,
            'series[1] has two moveTo statements'
        );
        assert.strictEqual(
            chart.series[2].graph.attr('d').match(/M/g).length,
            2,
            'series[2] has two moveTo statements'
        );
    });
});