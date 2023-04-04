QUnit.test('Bindings general tests', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                width: 800
            },
            yAxis: {
                labels: {
                    align: 'left'
                }
            },
            series: [
                {
                    type: 'ohlc',
                    id: 'aapl',
                    name: 'AAPL Stock Price',
                    data: [
                        [0, 12, 15, 10, 13],
                        [1, 13, 16, 9, 15],
                        [2, 15, 15, 11, 12],
                        [3, 12, 12, 11, 12],
                        [4, 12, 15, 12, 15],
                        [5, 11, 11, 10, 10],
                        [6, 10, 16, 10, 12],
                        [7, 12, 17, 12, 17],
                        [8, 17, 18, 15, 15],
                        [9, 15, 19, 12, 12]
                    ]
                }
            ],
            stockTools: {
                gui: {
                    enabled: true
                }
            }
        }),
        plotLeft = chart.plotLeft,
        plotTop = chart.plotTop,
        points = chart.series[0].points,
        controller = new TestController(chart),
        annotationsCounter = 0;

    // CSS Styles are not loaded, so hide left bar. If we don't hide the bar,
    // chart will be rendered outside the visible page and events will not be
    // fired (TestController issue)
    chart.stockTools.wrapper.style.display = 'none';

    // Number of tests is so high that events are not triggered on a chart,
    // temporary hide it:
    var qunitContainer = document.getElementById('qunit');
    if (qunitContainer) {
        qunitContainer.style.display = 'none';
    }
    delete chart.pointer.chartPosition;

    // Shorthand for selecting a button
    function selectButton(name) {
        var button = document.getElementsByClassName('highcharts-' + name)[0];
        // Bind annotation to the chart events:
        chart.navigationBindings.bindingsButtonClick(
            button,
            chart.navigationBindings.boundClassNames['highcharts-' + name],
            {
                target: {
                    parentNode: button,
                    classList: {
                        contains: Highcharts.noop
                    }
                }
            }
        );
    }

    const verticalAnnotation = chart.addAnnotation({
            type: 'verticalLine',
            typeOptions: {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: 5,
                    y: 15
                }
            }
        }),
        { x, y } = verticalAnnotation.shapes[0].graphic.getBBox();

    controller.mouseDown(
        plotLeft + x - 10,
        plotTop + y - 15
    );

    controller.mouseMove(
        plotLeft + 100,
        plotTop + 100
    );

    controller.mouseUp();

    selectButton('save-chart');

    const annotationStorage = localStorage.getItem('highcharts-chart');

    assert.deepEqual(
        JSON.parse(annotationStorage).annotations[0].typeOptions,
        verticalAnnotation.userOptions.typeOptions,
        'Annotation position saves correctly in localStorage after drag and drop'
    );

    verticalAnnotation.destroy();
    chart.annotations.length = 0;

    localStorage.removeItem('highcharts-chart');

    // Annotations with multiple steps:
    [
        'circle-annotation',
        'rectangle-annotation',
        'ellipse-annotation',
        'segment',
        'arrow-segment',
        'ray',
        'arrow-ray',
        'infinity-line',
        'arrow-infinity-line',
        'crooked3',
        'crooked5',
        'elliott3',
        'elliott5',
        'pitchfork',
        'fibonacci',
        'parallel-channel',
        'measure-xy',
        'measure-y',
        'measure-x'
    ].forEach(name => {
        selectButton(name);
        // Start and steps: annotations, run each step
        controller.click(
            points[2].plotX + plotLeft - 5,
            points[2].plotY + plotTop - 5
        );
        chart.navigationBindings.boundClassNames['highcharts-' + name].steps
            .forEach((_, index) => {
                controller.click(
                    points[4 + index].plotX + plotLeft - 5,
                    points[4 + index].plotY + plotTop - 5
                );
            });

        assert.strictEqual(
            chart.annotations.length,
            ++annotationsCounter,
            'Annotation: ' + name + ' added without errors.'
        );
    });

    // Annotations with just one "start" event:
    [
        'label-annotation',
        'vertical-line',
        'horizontal-line',
        'vertical-counter',
        'vertical-label',
        'vertical-arrow'
        // 'vertical-double-arrow'
    ].forEach(name => {
        selectButton(name);

        controller.click(points[2].plotX, points[2].plotY);

        assert.strictEqual(
            chart.annotations.length,
            ++annotationsCounter,
            'Annotation: ' + name + ' added without errors.'
        );
    });

    // Test control points, measure-y annotation
    controller.click(
        chart.plotLeft + chart.plotWidth / 2,
        chart.plotTop + chart.plotHeight / 2
    );

    controller.mouseDown(
        chart.plotLeft + chart.plotWidth / 2,
        chart.plotTop +
            chart.plotHeight / 2 +
            chart.annotations[16].shapes[1].graphic.getBBox().height / 2
    );

    controller.mouseMove(
        chart.plotLeft + chart.plotWidth / 2,
        chart.plotTop + chart.plotHeight / 2 + 10
    );

    controller.mouseUp(
        chart.plotLeft + chart.plotWidth / 2,
        chart.plotTop + chart.plotHeight / 2 + 10
    );

    assert.close(
        chart.annotations[16].yAxisMax,
        chart.yAxis[0].toValue(chart.plotHeight / 2 + 10),
        1,
        'Annotation should updated after control point\'s drag&drop (#12459)'
    );

    // Individual button events:

    // Current Price Indicator
    selectButton('current-price-indicator');
    assert.strictEqual(
        chart.series[0].lastVisiblePrice &&
            chart.series[0].lastVisiblePrice.visibility,
        'inherit',
        'Last price in the range visible.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice && chart.series[0].lastPrice.visibility,
        'inherit',
        'Last price in the dataset visible.'
    );

    selectButton('current-price-indicator');
    assert.strictEqual(
        chart.series[0].lastVisiblePrice &&
            chart.series[0].lastVisiblePrice.visibility,
        Highcharts.UNDEFINED,
        'Last price in the range hidden.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice && chart.series[0].lastPrice.visibility,
        Highcharts.UNDEFINED,
        'Last price in the dataset hidden.'
    );

    // Annotations:
    var visibleAnnotations = false;
    // Hide all:
    selectButton('toggle-annotations');

    chart.annotations.forEach(annotation => {
        if (annotation.options.visible) {
            visibleAnnotations = true;
        }
    });

    assert.strictEqual(
        visibleAnnotations,
        false,
        'All annotations are hidden.'
    );

    // Show all:
    selectButton('toggle-annotations');

    visibleAnnotations = true;
    chart.annotations.forEach(annotation => {
        if (!annotation.options.visible) {
            visibleAnnotations = false;
        }
    });

    assert.strictEqual(
        visibleAnnotations,
        true,
        'All annotations are visible.'
    );

    // Series types change:
    ['line', 'ohlc', 'candlestick'].forEach(type => {
        selectButton('series-type-' + type);
        assert.strictEqual(
            chart.series[0].type,
            type,
            'Series type changed to ' + type + '.'
        );
    });

    // Saving chart in the local storage
    selectButton('save-chart');
    assert.strictEqual(
        Highcharts.defined(localStorage.getItem('highcharts-chart')),
        true,
        'Chart saved in the local storage'
    );
    // Restore basic annotations
    JSON.parse(localStorage['highcharts-chart']).annotations.forEach(
        annotation => {
            if (!annotation.typeOptions) {
                chart.addAnnotation(annotation);

                assert.ok(
                    1,
                    'No errors should be thrown after setting the basic' +
                    'annotations (#12054)'
                );
                ++annotationsCounter;
            }
        }
    );

    localStorage.removeItem('highcharts-chart');

    // Test annotation events:
    points = chart.series[0].points;
    chart.navigationBindings.popup.closePopup();
    controller.click(
        points[2].plotX + plotLeft + 15,
        points[2].plotY + plotTop + 25
    );
    // Styles in Karma are not loaded!
    chart.navigationBindings.popup.container.style.position = 'absolute';

    var button = document.querySelectorAll(
            '.highcharts-popup .highcharts-annotation-edit-button'
        )[0],
        buttonOffset = Highcharts.offset(button);

    controller.click(buttonOffset.left + 5, buttonOffset.top + 5);

    var popupEditor = document.querySelectorAll('.highcharts-popup-lhs-col');
    assert.strictEqual(
        popupEditor[0].children.length > 0,
        true,
        'The popup should includes the edit elements #13532'
    );

    assert.strictEqual(
        popupEditor[0].children[0].textContent,
        'Shape options',
        'The labels should be in the correct order in Firefox #14691'
    );

    // Point out the other point to close the editor popup
    controller.click(points[9].plotX + plotLeft, points[9].plotY + plotTop);

    controller.click(
        points[2].plotX + plotLeft + 15,
        points[2].plotY + plotTop + 25
    );

    assert.strictEqual(
        chart.navigationBindings.popup.container.classList.contains(
            'highcharts-annotation-toolbar'
        ),
        true,
        'Annotations toolbar rendered.'
    );

    assert.strictEqual(
        chart.navigationBindings.popup.container.style.display,
        'block',
        'Annotations toolbar visible.'
    );

    // Styles in Karma are not loaded!
    chart.navigationBindings.popup.container.style.position = 'absolute';

    button = document.querySelectorAll(
        '.highcharts-popup .highcharts-annotation-remove-button'
    )[0];
    buttonOffset = Highcharts.offset(button);

    controller.click(buttonOffset.left + 5, buttonOffset.top + 5);
    assert.strictEqual(
        chart.annotations.length,
        --annotationsCounter,
        'Annotation removed through popup.'
    );
    assert.strictEqual(
        chart.navigationBindings.popup.container.style.display,
        'none',
        'Annotations toolbar hidden.'
    );

    // Test flags:
    var seriesLength = chart.series.length;

    selectButton('flag-circlepin');
    // Register flag position
    controller.click(points[2].plotX, points[2].plotY);

    // Styles in Karma are not loaded!
    chart.navigationBindings.popup.container.style.position = 'absolute';
    chart.navigationBindings.popup.container.style.top = '0px';
    button = document.querySelectorAll(
        '.highcharts-popup .highcharts-popup-bottom-row button'
    )[0];
    buttonOffset = Highcharts.offset(button);
    controller.click(buttonOffset.left + 5, buttonOffset.top + 5);

    assert.strictEqual(
        chart.series.length,
        seriesLength + 1,
        'Flag: flag-circlepin series created.'
    );

    assert.strictEqual(
        chart.series[seriesLength - 1].points.length,
        1,
        'Flag: no duplicated flags.'
    );

    // #9740:
    chart.update(
        {
            stockTools: {
                gui: {
                    buttons: ['toggleAnnotations']
                }
            }
        },
        true
    );

    selectButton('toggle-annotations');

    assert.strictEqual(
        chart.annotations[0].options.visible,
        false,
        'After chart.update() events are correctly bound.'
    );
    // Restore default button state:
    selectButton('toggle-annotations');

    // Restore details:
    if (qunitContainer) {
        qunitContainer.style.display = 'block';
    }
});

QUnit.test(
    'Bindings on multiple axes. Checks whether a pointer action returns a proper axis (#12268).',
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
            'Y coord on both yAxes (they overlap) - the top yAxis should be found.'
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

    // The infinityLine should be drawn from bottom-left to top-right plotarea corner.

    assert.strictEqual(
        xAxisLength,
        infinityLine.graphic.element.getBBox().width,
        'The width of the infinityLine\'s graphic box should be the same as the xAxis\' width.'
    );

    assert.strictEqual(
        yAxisLength,
        infinityLine.graphic.element.getBBox().height,
        'The height of the infinityLine\'s graphic box should be the same as the yAxis\' height.'
    );
});

QUnit.test('Stock Tools annotations\' positions with yAxis.top (#15075)', assert => {
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
        'Annotation\'s element should be placed ' + yOffset + 'px from the second point.'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    point = series.points[2];

    // Add vertical arrow annotation near to the third point on inverted chart
    chart.navigationBindings.options.bindings.verticalArrow.start.call(
        chart.navigationBindings,
        {
            chartX: chart.plotLeft + yAxis.len - point.plotY,
            chartY: chart.plotTop + series.xAxis.len - point.plotX
        }
    );

    annotationBBox = chart.annotations[1].graphic.getBBox();

    assert.close(
        (annotationBBox.x + (annotationBBox.width) + yOffset),
        chart.plotLeft + yAxis.len - point.plotY,
        1,
        'Annotation\'s element should be placed ' + yOffset + 'px from the third point.'
    );
});
