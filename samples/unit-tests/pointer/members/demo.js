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
        chart.series.length - 1,
        '!isDirectTouch && shared: one point hovered per series, except from ' +
        'series with noSharedTooltip'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.series === scatterSeries;
        }),
        false,
        '!isDirectTouch && shared: series with noSharedTooltip should not be ' +
        'included.'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        '!isDirectTouch && shared: All hoverPoints should have the same ' +
        'index as the hoverPoint'
    );

    // Allow scatter series in shared tooltip
    scatterSeries.remove();
    Highcharts.Series.types.scatter.prototype.noSharedTooltip = false;
    scatterSeries = chart.addSeries({
        type: 'scatter',
        data: [5, 2, 8, 1, 5]
    });
    // scatterSeries.noSharedTooltip = false;
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
        'Allow scatter series in shared tooltip: hoverPoint should be ' +
        'series[2].points[2]'
    );
    assert.strictEqual(
        data.hoverSeries === series,
        true,
        'Allow scatter series in shared tooltip: hoverSeries should be ' +
        'series[2]'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        chart.series.length,
        'Allow scatter series in shared tooltip: one point hovered per series'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.series === scatterSeries;
        }),
        true,
        'Allow scatter series in shared tooltip: one point from the scatter ' +
        'series'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        'Allow scatter series in shared tooltip: All hoverPoints should have ' +
        'the same index as the hoverPoint'
    );

    // Bubble series should also participate in shared tooltips.
    var bubbleChart = Highcharts.chart('container', {
        chart: {
            animation: false,
            width: 1000
        },
        tooltip: {
            shared: true
        },
        series: [
            {
                type: 'bubble',
                data: [
                    [0, 1, 1],
                    [1, 1, 2]
                ]
            },
            {
                type: 'bubble',
                data: [
                    [0, 2, 1],
                    [1, 2, 2]
                ]
            }
        ]
    });
    point = bubbleChart.series[0].points[1];
    data = bubbleChart.pointer.getHoverData(
        point,
        bubbleChart.series[0],
        bubbleChart.series,
        true,
        true,
        {
            chartX: point.plotX || 0,
            chartY: point.plotY || 0
        }
    );
    assert.strictEqual(
        bubbleChart.series[0].noSharedTooltip,
        false,
        'Bubble series should opt into shared tooltip mode'
    );
    assert.strictEqual(
        data.hoverPoints.length,
        2,
        'Bubble series should contribute one point per series in shared ' +
        'tooltips'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.series === bubbleChart.series[1];
        }),
        true,
        'Bubble series should include the matching series in shared tooltip'
    );
    assert.strictEqual(
        !!find(data.hoverPoints, function (p) {
            return p.x !== data.hoverPoint.x;
        }),
        false,
        'Bubble series shared tooltip points should align on the same x value'
    );
    bubbleChart.destroy();

    // Reset, avoid breaking tests downstream
    Highcharts.Series.types.scatter.prototype.noSharedTooltip = true;

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
