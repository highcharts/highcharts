/* global TestController */
QUnit.test('getUnionExtremes', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [{
                marker: {
                    enabled: true
                },
                data: [[1451952000000, 354652]]
            }]
        }),
        unionExtremes = chart.scroller.getUnionExtremes(),
        extremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        unionExtremes.dataMin,
        extremes.min,
        'getUnionExtremes.min equals getExtremes.min'
    );
    assert.strictEqual(
        unionExtremes.dataMax,
        extremes.max,
        'getUnionExtremes.max equals getExtremes.max'
    );
});

QUnit.test('Extremes - edge cases', function (assert) {
    var chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 5,
                max: 10
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6, 3, 8, 9, 1]
            }]
        }),
        extremes = chart.xAxis[0].getExtremes(),
        navigator = chart.navigator,
        newExtremes;

    chart.series[0].update({
        marker: {
            enabled: true
        }
    });
    chart.series[0].addPoint(10, true, true);
    newExtremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        extremes.max - extremes.min,
        newExtremes.max - newExtremes.min,
        'Extremes with selected button, correct range (#6383)'
    );

    chart.xAxis[0].update({
        reversed: true
    }, false);
    chart.xAxis[0].setExtremes(1, 5);

    navigator.handlesMousedown({}, 1);
    navigator.onMouseMove({
        pageX: navigator.size + navigator.left +
            Highcharts.offset(chart.container).left,
        pageY: navigator.handles[1].translateY + 5
    });
    navigator.onMouseUp({});

    newExtremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        newExtremes.max,
        newExtremes.dataMax,
        'Max with reversed xAxis and handles, correct range (#7576)'
    );

    assert.strictEqual(
        newExtremes.min,
        newExtremes.dataMin,
        'Min with reversed xAxis and handles, correct range (#7576)'
    );
});

QUnit.test('Extremes - inverted chart', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                inverted: true
            },
            xAxis: {
                min: 0,
                max: 3
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6, 3, 8, 9, 1]
            }]
        }),
        controller = new TestController(chart),
        newExtremes;

    controller.mouseDown(
        chart.navigator.left + 10,
        chart.plotTop + chart.navigator.size
    );

    newExtremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        newExtremes.max,
        newExtremes.dataMax,
        'Inverted chart and reversed xAxis: Correct max ' +
            'extremes after click on navigator (#8812)'
    );

    chart.series[0].addPoint(5, true, true, true);

    newExtremes = chart.xAxis[0].getExtremes();

    assert.strictEqual(
        newExtremes.max,
        newExtremes.dataMax,
        'Inverted chart and reversed xAxis: Correct max ' +
            'when adding points (#8812)'
    );
});
