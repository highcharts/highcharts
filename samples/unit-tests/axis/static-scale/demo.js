var now,
    data,
    dataPoints,
    addPoints,
    i,
    j,
    chart,
    axis,
    series,
    ticks,
    createPoint = function (i) {
        return {
            name: new Date(now + i * 1000),
            y: Math.random()
        };
    };

QUnit.testStart(function () {
    now = Date.now();
    data = [];
    dataPoints = 3;
    addPoints = 100;
    ticks = [];


    for (i = 0; i < dataPoints; i++) {
        data.push(createPoint(i));
    }

    chart = Highcharts.chart('container', {

        xAxis: {
            staticScale: 24,
            minRange: 1,
            categories: true
        },

        series: [{
            data: data,
            type: 'bar'
        }]

    });
    axis = chart.xAxis[0];
    series = chart.series[0];

    Highcharts.each(axis.tickPositions, function (pos) {
        ticks.push(axis.ticks[pos]);
    });
});

/**
 * Checks that the space between ticks is maintained.
 */
QUnit.test('Interval between ticks is maintained', function (assert) {
    var diff1,
        diff2,
        diff3;

    diff1 = ticks[1].mark.getBBox().y - ticks[0].mark.getBBox().y;
    for (j = 0; j < addPoints; j++) {
        series.addPoint(createPoint(i++), false); // Do not redraw for every add
    }
    chart.redraw();

    diff2 = ticks[1].mark.getBBox().y - ticks[0].mark.getBBox().y;

    assert.equal(
        diff1,
        diff2,
        'Space between ticks is equal after adding ' + addPoints + ' points'
    );

    series.addPoint(createPoint(i++));

    diff3 = ticks[1].mark.getBBox().y - ticks[0].mark.getBBox().y;

    assert.equal(
        diff2,
        diff3,
        'Space between ticks is equal after adding an extra point with redraw'
    );
});

/**
 * Checks that the space between the lowermost tick and the legend is
 * maintained. By checking this, we are checking that the static scale does not
 * alter the relationship with other chart elements.
 */
QUnit.test('Legend margin is maintained', function (assert) {
    var diff1,
        diff2,
        diff3,
        legend;
    legend = chart.legend.box;
    diff1 = legend.getBBox().y - ticks[ticks.length - 1].mark.getBBox().y;

    for (j = 0; j < addPoints; j++) {
        series.addPoint(createPoint(i++), false); // Do not redraw for every add
    }
    chart.redraw();

    diff2 = legend.getBBox().y - ticks[ticks.length - 1].mark.getBBox().y;

    assert.equal(
        diff1,
        diff2,
        'Space is equal after adding ' + addPoints + ' points'
    );

    diff3 = legend.getBBox().y - ticks[ticks.length - 1].mark.getBBox().y;

    assert.equal(
        diff2,
        diff3,
        'Space is equal after adding an extra point with redraw'
    );
});
