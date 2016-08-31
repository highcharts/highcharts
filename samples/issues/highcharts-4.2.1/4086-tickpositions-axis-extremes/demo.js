
$(function () {
    QUnit.test('Clip tickPositions when axis extremes are set', function (assert) {
        var chart = Highcharts.chart('container', {
            xAxis: {
                minRange: 8,
                tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                min: 5,
                max: 15
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

        assert.strictEqual(
            chart.xAxis[0].tickPositions.join(','),
            '5,6,7,8,9,10,11,12,13,14,15',
            'Tick positions are trimmed'
        );
    });
});