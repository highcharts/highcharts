QUnit.test(
    'Axis breaks and column width in Highstock (#5979)',
    function (assert) {
        var data = [];
        for (
            var x = Date.UTC(2010, 0, 8), y = 1;
            x < Date.UTC(2010, 1, 22);
            x += 24 * 36e5, y++
        ) {
            if (y % 7 !== 2 && y % 7 !== 3) {
                data.push([x, y]);
            }
        }

        var chart = Highcharts.stockChart('container', {
            xAxis: {
                ordinal: false,
                type: 'datetime',
                breaks: [{
                    from: Date.UTC(2010, 6, 30, 0, 0, 0),
                    to: Date.UTC(2010, 6, 31, 21, 59, 59),
                    repeat: 7 * 24 * 36e5
                }]
            },
            series: [{
                type: 'column',
                data: data,
                animation: false
            }]
        });

        assert.ok(
            chart.series[0].points[0].graphic.attr('width') > 7,
            'Width is great enough'
        );

    }
);
QUnit.test('Axis.isBroken', function (assert) {
    var H = Highcharts,
        Axis = H.Axis,
        init = Axis.prototype.init,
        defaultOptions = H.getOptions(),
        chart = {
            axes: [],
            yAxis: [],
            options: {
                tooltip: defaultOptions.tooltip
            }
        },
        axis = {
            defaultOptions: Axis.prototype.defaultOptions,
            setOptions: Axis.prototype.setOptions
        },
        userOptions = {
            breaks: undefined
        };

    init.call(axis, chart, userOptions);
    assert.strictEqual(
        axis.isBroken,
        false,
        'Axis.breaks: undefined results in Axis.isBroken: false.'
    );

    userOptions.breaks = [];
    init.call(axis, chart, userOptions);
    assert.strictEqual(
        axis.isBroken,
        false,
        'Axis.breaks: [] results in Axis.isBroken: false.'
    );

    userOptions.breaks = [{}];
    init.call(axis, chart, userOptions);
    // @todo Consider adding more clever checks for isBroken.
    assert.strictEqual(
        axis.isBroken,
        true,
        'Axis.breaks: [{}] results in Axis.isBroken: true.'
    );
});