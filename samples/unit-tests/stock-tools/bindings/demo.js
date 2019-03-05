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
            series: [{
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
            }],
            stockTools: {
                gui: {
                    enabled: true
                }
            }
        }),
        plotLeft = chart.plotLeft,
        plotTop = chart.plotTop,
        points = chart.series[0].points,
        controller = TestController(chart),
        annotationsCounter = 0,
        i = 0;

    // CSS Styles are not loaded, so hide left bar. If we don't hide the bar,
    // chart will be rendered outside the visible page and events will not be
    // fired (TestController issue)
    document.getElementsByClassName('highcharts-stocktools-wrapper')[0].style.display = 'none';

    // Number of tests is so high that events are not triggered on a chart, temporary hide it:
    var qunitContainer = document.getElementById('qunit');
    if (qunitContainer) {
        qunitContainer.style.display = 'none';
    }

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

    // Annotations with multiple steps:
    Highcharts.each(
        [
            'circle-annotation',
            'rectangle-annotation',
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
        ],
        function (name) {
            selectButton(name);
            // Start and steps: annotations, run each step
            controller.click(
                points[2].plotX + plotLeft - 5,
                points[2].plotY + plotTop - 5
            );
            Highcharts.each(
                chart.navigationBindings.boundClassNames['highcharts-' + name].steps,
                function (step, index) {
                    controller.click(
                        points[4 + index].plotX + plotLeft - 5,
                        points[4 + index].plotY + plotTop - 5
                    );
                }
            );

            assert.strictEqual(
                chart.annotations.length,
                ++annotationsCounter,
                'Annotation: ' + name + ' added without errors.'
            );
        }
    );

    // Annotations with just one "start" event:
    Highcharts.each(
        [
            'label-annotation',
            'vertical-line',
            'horizontal-line',
            'vertical-counter',
            'vertical-label',
            'vertical-arrow'
            // 'vertical-double-arrow'
        ],
        function (name) {
            selectButton(name);

            controller.click(
                points[2].plotX,
                points[2].plotY
            );

            assert.strictEqual(
                chart.annotations.length,
                ++annotationsCounter,
                'Annotation: ' + name + ' added without errors.'
            );
        }
    );

    // Individual button events:

    // Current Price Indicator
    selectButton('current-price-indicator');
    assert.strictEqual(
        chart.series[0].lastVisiblePrice &&
            chart.series[0].lastVisiblePrice.visibility,
        'visible',
        'Last price in the range visible.'
    );
    assert.strictEqual(
        chart.series[0].lastPrice &&
            chart.series[0].lastPrice.visibility,
        'visible',
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
        chart.series[0].lastPrice &&
            chart.series[0].lastPrice.visibility,
        Highcharts.UNDEFINED,
        'Last price in the dataset hidden.'
    );

    // Annotations:
    var visibleAnnotations = false;
    // Hide all:
    selectButton('toggle-annotations');

    Highcharts.each(chart.annotations, function (annotation) {
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
    Highcharts.each(chart.annotations, function (annotation) {
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
    Highcharts.each(
        ['line', 'ohlc', 'candlestick'],
        function (type) {
            selectButton('series-type-' + type);
            assert.strictEqual(
                chart.series[0].type,
                type,
                'Series type changed to ' + type + '.'
            );
        }
    );

    // Saving chart in the local storage
    selectButton('save-chart');
    assert.strictEqual(
        Highcharts.defined(localStorage.getItem('highcharts-chart')),
        true,
        'Chart saved in the local storage'
    );
    localStorage.removeItem('highcharts-chart');

    // Test yAxis resizers and adding indicators:
    for (i = 0; i < 9; i++) {
        chart.navigationBindings.selectedButtonElement = document
            .getElementsByClassName('highcharts-indicators')[0];
        chart.navigationBindings.utils.manageIndicators.call(
            chart.navigationBindings,
            {
                actionType: 'add',
                linkedTo: 'aapl',
                fields: {
                    'params.index': '0',
                    'params.period': '5'
                },
                type: 'atr'
            }
        );
        assert.close(
            parseFloat(chart.yAxis[0].options.height),
            i < 4 ?
                (100 - (i + 1) * 20) :
                100 / (i + 2),
            0.0001, // up to 0.0001% is fine
            'Correct height for MAIN yAxis (' + (i + 2) + ' panes - indicator.add).'
        );
        assert.close(
            parseFloat(chart.yAxis[i + 2].options.height),
            i < 4 ?
                20 :
                100 / (i + 2),
            0.0001, // up to 0.0001% is fine
            'Correct height for LAST yAxis (' + (i + 2) + ' panes - indicator.add).'
        );
    }

    for (i = 9; i > 0; i--) {
        chart.navigationBindings.selectedButtonElement = document
            .getElementsByClassName('highcharts-indicators')[0];
        chart.navigationBindings.utils.manageIndicators.call(
            chart.navigationBindings,
            {
                actionType: 'remove',
                seriesId: chart.series[chart.series.length - 2].options.id
            }
        );

        assert.close(
            parseFloat(chart.yAxis[0].options.height),
            i < 6 ?
                100 - (i - 1) * 20 :
                100 / i,
            0.005, // up to 0.5% is fine
            'Correct height for main yAxis (' + (i + 1) + ' pane(s) - indicator.remove).'
        );
    }

    // Test annotation events:
    points = chart.series[0].points;
    chart.navigationBindings.popup.closePopup();
    controller.click(
        points[2].plotX + plotLeft - 5,
        points[2].plotY + plotTop - 25
    );
    assert.strictEqual(
        chart.navigationBindings.popup.container.classList
            .contains('highcharts-annotation-toolbar'),
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

    var button = document.querySelectorAll(
            '.highcharts-popup .highcharts-annotation-remove-button'
        )[0],
        buttonOffset = Highcharts.offset(button);

    controller.click(
        buttonOffset.left + 5,
        buttonOffset.top + 5
    );
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
    controller.click(
        points[2].plotX,
        points[2].plotY
    );

    // Styles in Karma are not loaded!
    chart.navigationBindings.popup.container.style.position = 'absolute';
    chart.navigationBindings.popup.container.style.top = '0px';
    button = document.querySelectorAll(
        '.highcharts-popup .highcharts-popup-bottom-row button'
    )[0];
    buttonOffset = Highcharts.offset(button);
    controller.click(
        buttonOffset.left + 5,
        buttonOffset.top + 5
    );

    assert.strictEqual(
        chart.series.length,
        seriesLength + 1,
        'Flag: flag-circlepin series created.'
    );

    assert.strictEqual(
        chart.series[seriesLength].points.length,
        1,
        'Flag: no duplicated flags.'
    );

    // #9740:
    chart.update({
        stockTools: {
            gui: {
                buttons: ['toggleAnnotations']
            }
        }
    }, true);

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
