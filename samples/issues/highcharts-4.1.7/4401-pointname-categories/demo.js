$(function () {
    QUnit.test('Test different point.name types.', function (assert) {
        var UNDEFINED,
            labels = ['0', true, false, NaN, '', 'Proper', '6', 0, Infinity],
            chart = $('#container').highcharts({
                xAxis: {
                    type: "category"
                },
                series: [{
                    data: [{
                        name: null,
                        y: 0
                    }, {
                        name: labels[1],
                        y: 12
                    }, {
                        name: labels[2],
                        y: 1
                    }, {
                        name: labels[3],
                        y: 0
                    }, {
                        name: labels[4],
                        y: 5
                    }, {
                        name: labels[5],
                        y: 9
                    }, {
                        name: UNDEFINED,
                        y: 10
                    }, {
                        name: labels[7],
                        y: 11
                    }, {
                        name: labels[8],
                        y: 11
                    }]
                }]
            }).highcharts();

        $.each(chart.xAxis[0].tickPositions, function (i, pos) {
            assert.strictEqual(
                chart.xAxis[0].ticks[pos].label.textStr.toString(),
                labels[pos].toString(),
                'Right label.'
            );
        });
    });
});