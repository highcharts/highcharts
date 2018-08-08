QUnit.test('getSeriesExtremes', function (assert) {
    var getSeriesExtremes = Highcharts.Axis.prototype.getSeriesExtremes,
        xAxis = {
            getExtremes: Highcharts.Axis.prototype.getExtremes,
            isXAxis: true,
            series: [{
                visible: true,
                options: {}
            }]
        };

    assert.throws(
        function () {
            getSeriesExtremes.call(xAxis);
        },
        'xAxis with undefined xData throws an error'
    );

    xAxis.series[0].xData = [];
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        null,
        'xAxis with xData:[] gives dataMin:null'
    );
    assert.strictEqual(
        xAxis.dataMax,
        null,
        'xAxis with xData:[] gives dataMax:null'
    );
    xAxis.series[0].xData = [2, 7, 4];
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        2,
        'xAxis with xData:[2, 7, 4] gives dataMin:2'
    );
    assert.strictEqual(
        xAxis.dataMax,
        7,
        'xAxis with xData:[2, 7, 4] gives dataMax:7'
    );
    xAxis.series[0].xData.push(null);
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        2,
        'xAxis with xData:[2, 7, 4, null] gives dataMin:2'
    );
    assert.strictEqual(
        xAxis.dataMax,
        7,
        'xAxis with xData:[2, 7, 4, null] gives dataMax:7'
    );
    xAxis.series[0].xData.push(undefined);
    getSeriesExtremes.call(xAxis);
    assert.strictEqual(
        xAxis.dataMin,
        2,
        'xAxis with xData:[2, 7, 4, null, undefined] gives dataMin:2'
    );
    assert.strictEqual(
        xAxis.dataMax,
        7,
        'xAxis with xData:[2, 7, 4, null, undefined] gives dataMax:7'
    );

    /**
     * @todo Test the yAxis.getExtremes, but it is much work to mock the yAxis
     */
});

QUnit.test('Zoom out of container', function (assert) {
    var fakeAxis = {
        chart: {
            options: {
                chart: {}
            }
        },
        dataMin: 0,
        dataMax: 10,
        options: {},
        allowZoomOutside: false,
        setExtremes: function (min, max) {
            assert.ok(min <= max, 'Min is less than or equal to max');
            assert.ok(min <= 10 && min >= 0, 'Min is within container');
            assert.ok(max <= 10 && max >= 0, 'Max is within container');
        }
    };
    Highcharts.Axis.prototype.zoom.call(fakeAxis, -4, -5);
    Highcharts.Axis.prototype.zoom.call(fakeAxis, -4, 5);
    Highcharts.Axis.prototype.zoom.call(fakeAxis, 4, 5);
    Highcharts.Axis.prototype.zoom.call(fakeAxis, 4, 15);
    Highcharts.Axis.prototype.zoom.call(fakeAxis, 14, 15);
});

QUnit.test('Zoom next to edge on category axis (#6731)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [{
                name: 'Jan',
                y: 24.2
            }, {
                name: 'Feb',
                y: 24.6
            }, {
                name: 'Mar',
                y: 26.7
            }, {
                name: 'Apr',
                y: 28.6
            }, {
                name: 'May',
                y: 30.1
            }, {
                name: 'Jun',
                y: 29.0
            }, {
                name: 'Jul',
                y: 27.5
            }, {
                name: 'Aug',
                y: 27.2
            }, {
                name: 'Sep',
                y: 27.4
            }, {
                name: 'Oct',
                y: 28.2
            }, {
                name: 'Nov',
                y: 27.4
            }, {
                name: 'Dec',
                y: 25.6
            }]
        }]
    });

    chart.xAxis[0].zoom(0, 1);
    chart.redraw();

    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Axis not zoomed passed 0'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        5,
        'Axis actually zoomed'
    );
});

QUnit.test('Zooming between points (#7061)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            minRange: 0.5
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
                135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
    chart.xAxis[0].setExtremes(2.3, 2.7);

    assert.strictEqual(
        typeof chart.yAxis[0].min,
        'number',
        'Y axis has data'
    );
});


QUnit.test('X data with null and negative values (#7369)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        series: [{
            data: [{
                x: null,
                y: 95
            }, {
                x: 100,
                y: 102.9
            }, {
                x: -80.8,
                y: 91.5
            }]
        }]

    });

    assert.ok(
        Highcharts.isNumber(chart.xAxis[0].min),
        'Valid X axis min'
    );
    assert.ok(
        Highcharts.isNumber(chart.xAxis[0].max),
        'Valid X axis max'
    );
    assert.ok(
        Highcharts.isNumber(chart.yAxis[0].min),
        'Valid Y axis min'
    );
    assert.ok(
        Highcharts.isNumber(chart.yAxis[0].max),
        'Valid Y axis max'
    );
});

QUnit.test(
    '#5493, #5823 - Extremes for xAxis with hidden series and dataGrouping',
    function (assert) {

        function getRandomData(start, end) {
            var data = [];

            for (; start <= end; start += (1000 * 60)) {
                data.push([start, Math.random()]);
            }

            return data;
        }

        function equal(a, b, c) {
            return a === b && b === c && c === a;
        }

        var min = Date.UTC(2000, 0, 2),
            max = Date.UTC(2000, 0, 4),
            chart = $('#container').highcharts('StockChart', {
                legend: {
                    enabled: true
                },
                series: [{
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 5))
                }, {
                    data: getRandomData(min, max)
                }, {
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1)),
                    type: 'column',
                    visible: false
                }, {
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1)),
                    type: 'column',
                    visible: false
                }]
            }).highcharts(),
            extremes,
            pointRange;

        chart.series[0].hide();
        extremes = chart.xAxis[0].getExtremes();

        assert.strictEqual(
            equal(extremes.dataMin, extremes.min, min),
            true,
            'Correct minimum: #5493'
        );
        assert.strictEqual(
            equal(extremes.dataMax, extremes.max, max),
            true,
            'Correct maximum: #5493'
        );

        // #5823
        chart.series[0].hide();
        chart.series[1].hide();
        chart.series[2].show();
        chart.series[3].show();
        pointRange = chart.xAxis[0].closestPointRange;
        chart.series[2].hide();

        assert.strictEqual(
            pointRange,
            chart.xAxis[0].closestPointRange,
            'Correct pointRange: #5823'
        );

    }
);

// Highcharts 4.0.1, Issue #3075
// Touch panning on categorized axis alters range
QUnit.test('Touch pan categories (#3075)', function (assert) {

    TestTemplate.test('highcharts/area', {

        chart: {
            zoomType: 'x'
        },

        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    }, function (template) {

        var chart = template.chart,
            controller = new TestController(chart),
            xAxis = chart.xAxis[0];

        try {

            assert.deepEqual([
                typeof xAxis.userMin,
                typeof xAxis.userMax
            ], [
                'undefined',
                'undefined'
            ],
                'The user range of x-axis should be undefined.'
            );

            xAxis.setExtremes(5, 11, true, false);

            assert.deepEqual([
                xAxis.userMin,
                xAxis.userMax
            ], [
                5,
                11
            ],
                'The user range of x-axis should be set.'
            );

            controller.touchStart(300, 100, {
                preventDefault: function () {}
            });

            controller.touchMove(100, 100, {
                preventDefault: function () {}
            });

            controller.touchEnd(100, 100);

            assert.deepEqual([
                xAxis.userMin,
                xAxis.userMax
            ], [
                5,
                11
            ],
                'The user range of x-axis should be unchanged.'
            );

        } finally {

            xAxis.setExtremes();

        }

    });

});

// Highcharts v4.0.1, Issue #3104
// Touch panning falls back to data range, ignores axis min and max
QUnit.test('Touch panning falls back to data range (#3104)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        xAxis: {
            min: 0,
            max: 10
        },
        series: [{
            name: 'blue',
            color: 'blue',
            data: [1, 4, 3, 4, 5, 5, 4],
            pointStart: 4
        }]
    }, function (chart) {
        chart.xAxis[0].setExtremes(2, 15, true, false);
    });
    var controller = new TestController(chart),
        tickPositions = chart.axes[0].tickPositions,
        touchPointX = (chart.plotSizeX + chart.plotLeft) / 2,
        touchPointY = (chart.plotSizeY + chart.plotTop) / 2;

    controller.slide(
        [touchPointX, touchPointY],
        [touchPointX + 100, touchPointY], undefined, true);

    var tickPositionsAfterSlide =  chart.axes[0].tickPositions;

    assert.deepEqual(
        tickPositions,
        tickPositionsAfterSlide,
        "Tick positions has changed after touch sliding"
    );
});
