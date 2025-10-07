QUnit.test(
    'Bindings on multiple axes. Checks whether a pointer action returns a ' +
    'proper axis (#12268).',
    assert => {
        const chart = Highcharts.stockChart('container', {
                yAxis: [{
                    height: '40%',
                    top: '10%',
                    id: 'topYAxis'
                }, {
                    height: '20%',
                    top: '20%',
                    id: 'bottomYAxis'
                }],
                series: [{
                    data: [2, 4, 3]
                }, {
                    type: 'column',
                    data: [2, 4, 3],
                    yAxis: 1
                }]
            }),
            getCoordinates = chart.pointer.getCoordinates.bind(chart.pointer),
            getAssignedAxis = chart.navigationBindings.utils.getAssignedAxis,
            offset = 3;

        // The yAxes overlap - y coord on both of them
        let coords = getCoordinates({
                chartX: chart.yAxis[1].left + offset,
                chartY: chart.yAxis[1].top + offset
            }),
            coordsX = getAssignedAxis(coords.xAxis),
            coordsY = getAssignedAxis(coords.yAxis);

        assert.strictEqual(
            coordsY.axis.options.id,
            'topYAxis',
            'Y coord on both yAxes (they overlap) - the top yAxis should be ' +
            'found.'
        );

        chart.yAxis[1].update({
            top: '70%'
        });

        // Outside the plot area
        coords = getCoordinates({
            chartX: chart.plotLeft - offset,
            chartY: chart.plotTop - offset
        });

        coordsX = getAssignedAxis(coords.xAxis);
        coordsY = getAssignedAxis(coords.yAxis);

        assert.notOk(
            coordsX,
            'No xAxis should be found.'
        );

        assert.notOk(
            coordsY,
            'No yAxis should be found.'
        );

        // Inside the plot area and the xAxis but outside the yAxes
        coords = getCoordinates({
            chartX: chart.plotLeft + offset,
            chartY: chart.plotTop + offset
        });

        coordsX = getAssignedAxis(coords.xAxis);
        coordsY = getAssignedAxis(coords.yAxis);

        assert.ok(
            coordsX,
            'The xAxis should be found.'
        );

        assert.notOk(
            coordsY,
            'Y coord above the top yAxis - no yAxis should be found.'
        );

        // Inside the xAxis and the first yAxis
        coords = getCoordinates({
            chartX: chart.xAxis[0].left + offset,
            chartY: chart.yAxis[0].top + offset
        });

        coordsX = getAssignedAxis(coords.xAxis);
        coordsY = getAssignedAxis(coords.yAxis);

        assert.ok(
            coordsX,
            'The xAxis should be found.'
        );

        assert.strictEqual(
            coordsY.axis.options.id,
            'topYAxis',
            'Y coord on the top yAxis - the top yAxis should be found.'
        );

        // Inside the xAxis and between yAxes
        coords = getCoordinates({
            chartX: chart.xAxis[0].left + chart.xAxis[0].len - offset,
            chartY: chart.yAxis[0].top + chart.yAxis[0].len + offset
        });

        coordsX = getAssignedAxis(coords.xAxis);
        coordsY = getAssignedAxis(coords.yAxis);

        assert.ok(
            coordsX,
            'The xAxis should be found.'
        );

        assert.notOk(
            coordsY,
            'Y coord between top and bottom yAxes - no yAxis should be found.'
        );

        // Inside the xAxis and the second yAxis
        coords = getCoordinates({
            chartY: chart.yAxis[1].top + offset
        });

        coordsY = getAssignedAxis(coords.yAxis);

        assert.strictEqual(
            coordsY.axis.options.id,
            'bottomYAxis',
            'Y coord on the bottom yAxis - the bottom yAxis should be found.'
        );

        chart.yAxis[0].update({
            type: 'logarithmic'
        });

        const cords = [{
            axis: chart.yAxis[0],
            value: 2.2
        }];

        assert.ok(
            getAssignedAxis(cords),
            `The getAssignedAxis method should also work
            for logarithmic axes, #16451.`
        );
    });

QUnit.test('Stock Tools: drawing line annotations (#15155)', assert => {
    const chart = Highcharts.stockChart('container', {
            chart: {
                width: 800,
                plotBorderWidth: 1
            },
            series: [{
                data: [4, 2, 5, 6, 4]
            }]
        }),
        plotLeft = chart.plotLeft,
        plotTop = chart.plotTop,
        xAxisLength = chart.xAxis[0].len,
        yAxisLength = chart.yAxis[0].len;

    // init infinityLine
    chart.navigationBindings.options.bindings.infinityLine.start.call(
        chart.navigationBindings,
        {
            // the center of the plotarea
            chartX: plotLeft + xAxisLength / 2,
            chartY: plotTop + yAxisLength / 2
        }
    );

    const infinityLine = chart.annotations[0]; // initiated infinityLine

    // 'move mouse' so the infinityLine can be drawn
    chart.navigationBindings.options.bindings.infinityLine.steps[0].call(
        chart.navigationBindings,
        {
            // direction: top-right corner of the plotarea
            chartX: plotLeft + xAxisLength * 3 / 4,
            chartY: plotTop + yAxisLength * 1 / 4
        },
        infinityLine
    );

    // The infinityLine should be drawn from bottom-left to top-right
    // plotarea corner.

    assert.strictEqual(
        xAxisLength,
        infinityLine.graphic.element.getBBox().width,
        'The width of the infinityLine\'s graphic box should be the same as ' +
        'the xAxis\' width.'
    );

    assert.strictEqual(
        yAxisLength,
        infinityLine.graphic.element.getBBox().height,
        'The height of the infinityLine\'s graphic box should be the same as ' +
        'the yAxis\' height.'
    );
});

QUnit.test(
    'Stock Tools annotations\' positions with yAxis.top (#15075)', assert => {
        const chart = Highcharts.stockChart('container', {
                chart: {
                    width: 800
                },
                yAxis: {
                    top: '40%',
                    height: '60%'
                },
                series: [{
                    data: [4, 2, 5, 6, 4]
                }]
            }),
            series = chart.series[0],
            yAxis = series.yAxis;

        let point = series.points[1];

        // Add vertical counter annotation near to the second point
        chart.navigationBindings.options.bindings.verticalLabel.start.call(
            chart.navigationBindings,
            {
                chartX: point.plotX,
                chartY: point.plotY + yAxis.top
            }
        );

        const yOffset = chart.annotations[0].options.typeOptions.yOffset;
        let annotationBBox = chart.annotations[0].graphic.getBBox();

        assert.strictEqual(
            annotationBBox.y + annotationBBox.height + yOffset,
            point.plotY + yAxis.top,
            'Annotation\'s element should be placed ' + yOffset +
            'px from the second point.'
        );

        chart.update({
            chart: {
                inverted: true
            }
        });

        point = series.points[2];

        // Add vertical arrow annotation near to the third point on inverted
        // chart
        chart.navigationBindings.options.bindings.verticalArrow.start.call(
            chart.navigationBindings,
            {
                chartX: chart.plotLeft + yAxis.len - point.plotY,
                chartY: chart.plotTop + series.xAxis.len - point.plotX
            }
        );

        annotationBBox = chart.annotations[1].graphic.getBBox();

        assert.close(
            (
                annotationBBox.x + (annotationBBox.width) + yOffset),
            chart.plotLeft + yAxis.len - point.plotY,
            1,
            'Annotation\'s element should be placed ' + yOffset +
            'px from the third point.'
        );
    });
