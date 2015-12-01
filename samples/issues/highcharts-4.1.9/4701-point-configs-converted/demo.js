
$(function () {
    QUnit.test('Preserve point config initial type in options.data', function (assert) {
        var chart = $('#container').highcharts({

            series: [{
                data: [1,2,3],
                turboThreshold: 2
            }]

        }).highcharts();

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return typeof pointCfg;
            }).join(','),
            'number,number,number',
            'Points are numbers'
        );

        chart.series[0].points[2].update(100, true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return typeof pointCfg;
            }).join(','),
            'number,number,number',
            'Points are numbers'
        );

        chart.series[0].points[2].update([4, 200], true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return typeof pointCfg === 'object' ?
                    Object.prototype.toString.call(pointCfg) :
                    typeof pointCfg;
            }).join(','),
            'number,number,[object Array]',
            'Points are mixed'
        );

        chart.series[0].points[2].update({ x: 4, y: 200 }, true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return typeof pointCfg === 'object' ?
                    Object.prototype.toString.call(pointCfg) :
                    typeof pointCfg;
            }).join(','),
            'number,number,[object Object]',
            'Points are mixed'
        );
    });
});