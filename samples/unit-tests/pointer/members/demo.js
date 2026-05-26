QUnit.test('Pointer.getHoverData', function (assert) {
    var events = [],
        isNumber = Highcharts.isNumber,
        merge = Highcharts.merge,
        pushEvent = function (type, series, point) {
            var sI = series && isNumber(series.index) ? series.index : '-',
                pI = point && isNumber(point.index) ? point.index : '-',
                str = [type, sI, pI].join('.');
            events.push(str);
        },
        config = {
            chart: {
                animation: false,
                width: 1000
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true, // Force kd tree to run synchronously.
                    events: {
                        mouseOver: function () {
                            var series = this;
                            pushEvent('mouseOver', series);
                        },
                        mouseOut: function () {
                            var series = this;
                            pushEvent('mouseOut', series);
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOver', series, point);
                            },
                            mouseOut: function () {
                                var point = this,
                                    series = point.series;
                                pushEvent('mouseOut', series, point);
                            }
                        }
                    }
                }
            }
        };
    // Create the chart
    var options = {
            chart: merge(config.chart, {
                type: 'column'
            }),
            plotOptions: merge(config.plotOptions, {
                series: {
                    stacking: 'normal'
                }
            }),
            tooltip: {
                shared: true
            },
            series: [
                {
                    data: [1, 1, 1, 1, 1]
                },
                {
                    data: [5, 1, 1, 1, 1]
                },
                {
                    data: [1, 1, 1, 1, 1]
                }
            ]
        },
        data,
        find = Highcharts.find,
        chart = Highcharts.chart('container', options),
        series = chart.series[2],
        point = series.points[0],
        scatterSeries,
        xAxis = series.xAxis,
        yAxis = series.yAxis;

    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'isDirectTouch && shared: hoverPoint should equal existing hoverPoint'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'isDirectTouch && shared: hoverSeries should equal existing hoverSeries'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        chart.series.length,
        'isDirectTouch && shared: one point hovered per series'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        'isDirectTouch && shared: All hoverPoints should have the same index ' +
        'as the hoverPoint'
    );

    // isDirectTouch and !shared tooltip
    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        false, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'isDirectTouch && !shared: hoverPoint should equal existing hoverPoint'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'isDirectTouch && !shared: hoverSeries should equal existing ' +
        'hoverSeries'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        1,
        'isDirectTouch && !shared: there should be only 1 hoverPoint'
    );

    scatterSeries = chart.addSeries({
        type: 'scatter',
        data: [5, 2, 8, 1, 5]
    });
    series = chart.series[2];
    point = series.points[2];
    // !isDirectTouch and shared tooltip
    data = chart.pointer.getHoverData(
        false, // existingHoverPoint
        false, // existingHoverSeries
        chart.series, // series
        false, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX + point.pointWidth / 2 + 10,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        '!isDirectTouch && shared: hoverPoint should be series[2].points[2]'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        '!isDirectTouch && shared: hoverSeries should be series[2]'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        chart.series.length,
        '!isDirectTouch && shared: one point hovered per series'
    );
    assert.strictEqual(
        scatterSeries.noSharedTooltip,
        false,
        '!isDirectTouch && shared: scatter series should allow shared tooltip'
    );
    assert.strictEqual(
        scatterSeries.directTouch,
        true,
        '!isDirectTouch && shared: scatter series should preserve direct ' +
        'hover in shared mode'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.series === scatterSeries;
        }),
        true,
        '!isDirectTouch && shared: scatter series should be included.'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        '!isDirectTouch && shared: All hoverPoints should have the same ' +
        'index as the hoverPoint'
    );

    // Combination chart
    series = chart.addSeries({
        type: 'pie',
        data: [5, 2, 8, 1, 5]
    });
    point = series.points[0];
    data = chart.pointer.getHoverData(
        point, // existingHoverPoint
        series, // existingHoverSeries
        chart.series, // series
        true, // isDirectTouch
        true, // shared
        {
            chartX: xAxis.pos + point.clientX,
            chartY: yAxis.pos + point.plotY
        } // coordinates
    );
    assert.strictEqual(
        data.hoverPoint === point,
        true,
        'Combination chart: hoverPoint should be series[5].points[0]'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'Combination chart: hoverSeries should be series[5]'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        1,
        'Combination chart: Only one point hovered when hovered series has ' +
        'noSharedTooltip'
    );
});

QUnit.test(
    'Pointer.runPointActions preserves direct hover for scatter and bubble ' +
    'targets with shared and split tooltips',
    function (assert) {
        [
            {
                type: 'scatter',
                tooltip: { shared: true },
                data: [
                    [[0, 21709], [1, 4932]],
                    [[2, 5602], [3, 43499], [1, 26773]]
                ]
            },
            {
                type: 'scatter',
                tooltip: { split: true },
                data: [
                    [[0, 21709], [1, 4932]],
                    [[2, 5602], [3, 43499], [1, 26773]]
                ]
            },
            {
                type: 'bubble',
                tooltip: { shared: true },
                data: [
                    [[0, 21709, 2201], [1, 4932, 500]],
                    [[2, 5602, 500], [3, 43499, 4258], [1, 26773, 2260]]
                ]
            },
            {
                type: 'bubble',
                tooltip: { split: true },
                data: [
                    [[0, 21709, 2201], [1, 4932, 500]],
                    [[2, 5602, 500], [3, 43499, 4258], [1, 26773, 2260]]
                ]
            }
        ].forEach(function (testCase) {
            const mode = Object.keys(testCase.tooltip)[0],
                chart = Highcharts.chart('container', {
                    chart: {
                        animation: false,
                        width: 1000
                    },
                    plotOptions: {
                        series: {
                            animation: false,
                            kdNow: true
                        }
                    },
                    tooltip: testCase.tooltip,
                    series: [
                        {
                            type: testCase.type,
                            data: testCase.data[0]
                        },
                        {
                            type: testCase.type,
                            data: testCase.data[1]
                        }
                    ]
                }),
                point = chart.series[1].points[2],
                replacementPoint = chart.series[0].points[1],
                pointer = chart.pointer,
                originalFindNearestKDPoint = pointer.findNearestKDPoint;
            let kdSearchCalled = false;

            chart.hoverPoint = point;
            chart.hoverSeries = point.series;
            pointer.isDirectTouch = true;
            pointer.findNearestKDPoint = function () {
                kdSearchCalled = true;
                return replacementPoint;
            };

            pointer.runPointActions({
                chartX: point.series.xAxis.pos + point.clientX,
                chartY: point.series.yAxis.pos + point.plotY,
                target: point.graphic && point.graphic.element,
                type: 'mousemove'
            });

            assert.strictEqual(
                kdSearchCalled,
                false,
                `${testCase.type} point targets should preserve the directly ` +
                `hovered point with ${mode} tooltip`
            );
            assert.strictEqual(
                chart.hoverPoint,
                point,
                `${testCase.type} targets should keep the actual hovered ` +
                `point with ${mode} tooltip`
            );
            assert.strictEqual(
                chart.hoverPoints.length,
                2,
                `${testCase.type} targets with ${mode} tooltip should ` +
                'include matching points from both series'
            );

            pointer.findNearestKDPoint = originalFindNearestKDPoint;
            chart.destroy();
        });
    }
);
