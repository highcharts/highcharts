$(function () {
    QUnit.test('Data grouping and shoulder values', function (assert) {
        var chart = Highcharts.stockChart('container', {
            chart: {
                renderTo: 'container'
            },
            xAxis: {
                type: 'datetime',
                ordinal: false,
                min: 84,
                max: 86
            },
            navigator: {
                enabled: false
            },
            series: [{
                dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [
                        ['millisecond', [1]]
                    ]
                },
                marker: {
                    enabled: true
                },
                data: [
                    [1, 1],
                    [2, 2],
                    [80, 3],
                    [85, 4],
                    [90, 5]
                ]
            }]
        });

        assert.strictEqual(
            chart.series[0].processedXData.join(','),
            '80,85,90',
            'Preserve X positions for shoulder points'  // keyword: cropShoulder
        );
    });
});