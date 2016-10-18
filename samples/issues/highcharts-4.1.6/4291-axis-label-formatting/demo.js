$(function () {
    QUnit.test('Label formatting', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                data: [0, 79962.57, 9e4]
            }],
            yAxis: {
                tickPositions: [0, 79962.57, 9e4]
            }
        }).highcharts();

        assert.strictEqual(
            chart.yAxis[0].ticks['79962.57'].label.textStr,
            '79 962.57',
            'Preserved decimals'
        );

    });

});