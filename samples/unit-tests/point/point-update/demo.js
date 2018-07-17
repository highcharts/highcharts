QUnit.test(
    'Preserve point config initial number type in options.data',
    function (assert) {
        var chart = $('#container').highcharts({

            navigator: {
                enabled: true
            },

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

        chart.series[0].points[1].update();

        assert.strictEqual(
            chart.series[0].options.data[1],
            2,
            'Update without options should keep original value (#8023).'
        );

        assert.strictEqual(
            chart.xAxis[0].max,
            chart.xAxis[0].dataMax,
            'Correct extremes after point update (#8023).'
        );
    }
);

QUnit.test(
    'Preserve point config initial array type in options.data',
    function (assert) {
        var chart = $('#container').highcharts({

            series: [{
                data: [[0, 1], [1, 2], [2, 3]],
                turboThreshold: 2
            }]

        }).highcharts();

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return Highcharts.isArray(pointCfg);
            }).join(','),
            'true,true,true',
            'Points are arrays'
        );

        chart.series[0].points[2].update([2, 100], true, false);

        assert.strictEqual(
            chart.series[0].options.data.map(function (pointCfg) {
                return Highcharts.isArray(pointCfg);
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
    }
);

QUnit.test(
    'Preserve data values when updating from array to object config (#4916)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: [
                    [1, 2],
                    [3, 4],
                    [5, 6]
                ]
            }]
        });

        assert.strictEqual(
            chart.series[0].options.data.toString(),
            '1,2,3,4,5,6',
            'Initial arrays'
        );

        chart.series[0].points[0].update({
            marker: {
                lineColor: 'red'
            }
        });

        assert.deepEqual(
            chart.series[0].options.data[0],
            {
                x: 1,
                y: 2,
                marker: {
                    lineColor: 'red'
                }
            },
            'Object with data preserved'
        );
    }
);

QUnit.test(
    'marker.symbol=null should be accepted in point.update() (#6792)',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [{
                    data: [{
                        y: 10,
                        marker: {
                            symbol: 'square'
                        }
                    }, {
                        y: 10
                    }]
                }]
            }),
            point = chart.series[0].points[0],
            prevGraphic = point.graphic;

        point.update({
            marker: {
                symbol: null
            }
        });

        assert.strictEqual(
            point.graphic !== prevGraphic,
            true,
            'Point.graphic updated'
        );
    }
);

QUnit.test(
    'Pie series point update',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'pie'
            },

            series: [{
                data: [{
                    name: 'Americas',
                    y: 100,
                    color: 'yellow'
                }, {
                    name: 'Europe',
                    y: 200,
                    color: 'green'
                }]
            }]
        });

        assert.strictEqual(
            chart.series[0].points[0].connector.attr('stroke'),
            'yellow',
            'Initial connector color'
        );

        chart.series[0].points[0].update({ color: 'red' });
        assert.strictEqual(
            chart.series[0].points[0].connector.attr('stroke'),
            'red',
            'Connector color updated'
        );
    }
);
