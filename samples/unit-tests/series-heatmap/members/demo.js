QUnit.test("Heatmap point size shouldn't overflow plot area(#4530)", function (assert) {
    var chart = new Highcharts.Chart({

        chart: {
            type: 'heatmap',
            renderTo: 'container',
            width: 400,
            height: 400
        },

        series: [{
            data: [[
                Date.UTC(2012, 12, 2),
                0,
                93
            ]/*, [
                Date.UTC(2012, 12, 3),
                0,
                1
            ]*/],
            colsize: 24 * 3600 * 1000,
            rowsize: 24 * 3600 * 1000
        }]
    });

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('width'), 10) < 1200,
        true,
        'Element width is acceptable'
    );

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('height'), 10) < 1200,
        true,
        'Element height is acceptable'
    );


    chart = new Highcharts.Chart({

        chart: {
            type: 'heatmap',
            renderTo: 'container',
            width: 400,
            height: 400,
            inverted: true
        },

        series: [{
            data: [[
                Date.UTC(2012, 12, 2),
                0,
                93
            ]/*, [
                Date.UTC(2012, 12, 3),
                0,
                1
            ]*/],
            colsize: 24 * 3600 * 1000,
            rowsize: 24 * 3600 * 1000
        }]
    });

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('width'), 10) < 1200,
        true,
        'Element width is acceptable'
    );

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('height'), 10) < 1200,
        true,
        'Element height is acceptable'
    );


    chart = new Highcharts.Chart({

        chart: {
            type: 'heatmap',
            renderTo: 'container',
            width: 400,
            height: 400,
            inverted: true
        },

        xAxis: {
            minRange: 1
        },

        series: [{
            data: [[
                Date.UTC(2012, 12, 2),
                0,
                93
            ]/*, [
                Date.UTC(2012, 12, 3),
                0,
                1
            ]*/],
            colsize: 24 * 3600 * 1000,
            rowsize: 24 * 3600 * 1000
        }]
    });

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('width'), 10) < 1200,
        true,
        'With minRange: Element width is acceptable'
    );

    assert.strictEqual(
        parseInt(chart.series[0].points[0].graphic.attr('height'), 10) < 1200,
        true,
        'With minRange: Element height is acceptable'
    );
});

QUnit.test('Point range after setData(#3758)', function (assert) {
    var chart,
        initialPointRange;

    // Create the chart
    $('#container').highcharts({

        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: '#000000'
        },

        series: [{
            data: [
                [1, 0, 92],
                [2, 0, 35],
                [3, 0, 72],
                [4, 0, 38],
                [5, 0, 88],
                [6, 0, 13],
                [7, 0, 31],
                [8, 0, 85],
                [9, 0, 47]
            ]
        }]

    });

    chart = $('#container').highcharts();
    initialPointRange = chart.series[0].pointRange;

    // Run setData
    chart.series[0].setData([
        [1, 0, 92],
        [2, 0, 35],
        [3, 0, 72],
        [4, 0, 38],
        [5, 0, 88],
        [6, 0, 13],
        [7, 0, 31],
        [8, 0, 85],
        [9, 0, 47],
        [10, 0, 47],
        [11, 0, 47],
        [12, 0, 47]
    ]);

    assert.equal(
        chart.series[0].pointRange,
        initialPointRange,
        'Point range should not change'
    );
});


QUnit.test('seriesTypes.heatmap.pointClass.setState', function (assert) {
    var series = Highcharts.seriesTypes.heatmap,
        setState = series.prototype.pointClass.prototype.setState,
        pointAttribs = series.prototype.pointAttribs,
        noop = Highcharts.noop,
        point = {
            graphic: {
                attr: function (obj) {
                    var graphic = this,
                        keys = Object.keys(obj);
                    keys.forEach(function (key) {
                        var value = obj[key];
                        graphic[key] = value;
                    });
                },
                animate: noop,
                addClass: noop,
                removeClass: noop
            },
            series: {
                type: 'heatmap',
                options: {
                    states: {
                        hover: {},
                        select: {}
                    }
                },
                pointAttribs: pointAttribs,
                zones: [],
                chart: {
                    options: {
                        chart: {
                            animation: false
                        }
                    }
                }
            },
            options: {}
        };
    setState.call(point, '');
    assert.strictEqual(
        point.graphic.zIndex,
        0,
        'When state:normal zIndex is 0'
    );
    setState.call(point, 'hover');
    assert.strictEqual(
        point.graphic.zIndex,
        1,
        'When state:hover zIndex is 1'
    );
    setState.call(point, 'select');
    assert.strictEqual(
        point.graphic.zIndex,
        0,
        'When state:select zIndex is 0'
    );
});