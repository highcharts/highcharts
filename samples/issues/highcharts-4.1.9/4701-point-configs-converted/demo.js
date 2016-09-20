
$(function () {

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    QUnit.test('Preserve point config initial number type in options.data', function (assert) {
        var chart = $('#container').highcharts({

            series: [{
                data: [1, 2, 3],
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

    QUnit.test('Preserve point config initial array type in options.data', function (assert) {
        var chart = $('#container').highcharts({

            series: [{
                data: [[0, 1], [1, 2], [2, 3]],
                turboThreshold: 2
            }]

        }).highcharts();

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return isArray(pointCfg);
            }).join(','),
            'true,true,true',
            'Points are arrays'
        );

        chart.series[0].points[2].update([2, 100], true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return isArray(pointCfg);
            }).join(','),
            'true,true,true',
            'Points are arrays'
        );

        chart.series[0].points[2].update([4, 200], true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return typeof pointCfg === 'object' ?
                    Object.prototype.toString.call(pointCfg) :
                    typeof pointCfg;
            }).join(','),
            '[object Array],[object Array],[object Array]',
            'Points are mixed'
        );

        chart.series[0].points[2].update({ x: 4, y: 200 }, true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return typeof pointCfg === 'object' ?
                    Object.prototype.toString.call(pointCfg) :
                    typeof pointCfg;
            }).join(','),
            '[object Array],[object Array],[object Object]',
            'Points are mixed'
        );
    });

    QUnit.test('Let through if source data object is changed.', function (assert) {
        var data = [{
                y: 29.9
            }, {
                y: 27.9
            }, {
                y: 39.9
            }, {
                y: 26.9
            }, {
                y: 22.9
            }],
            chart = $('#container').highcharts({
                series: [{
                    data: data
                }]
            }).highcharts();

        $.each(data, function (point) {
            this.y = 5;
        });

        chart.series[0].setData(data);

        assert.strictEqual(chart.series[0].points[0].y, 5);
    });

});