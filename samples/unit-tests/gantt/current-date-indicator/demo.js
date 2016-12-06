var today = new Date(),
    day = 1000 * 60 * 60 * 24,
    defaultConfig;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
defaultConfig = {
    title: {
        text: 'Current Date Indicator'
    },
    xAxis: [{
        id: 'bottom-datetime-axis',
        currentDateIndicator: true,
        type: 'datetime',
        tickInterval: day,
        labels: {
            format: '{value:%a}'
        },
        min: today.getTime() - (3 * day),
        max: today.getTime() + (3 * day)
    }],
    series: [{
        name: 'Project 1',
        borderRadius: 3,
        xAxis: 0,
        data: [{
            x: today.getTime() - (2 * day),
            y: 0
        }, {
            x: today.getTime() - day,
            y: 1
        }, {
            x: today.getTime() + day,
            y: 0
        }, {
            x: today.getTime() + (2 * day),
            y: 2
        }]
    }]
};

/**
 * Checks that the value updates on Axis.redraw().
 */
QUnit.test('Value', function (assert) {
    var chart = Highcharts.chart('container', defaultConfig),
        axis = chart.xAxis[0],
        cdi = axis.plotLinesAndBands[0],
        done = assert.async(),
        wait = 1, // Comparing milliseconds, so 1 millisecond is enough
        oldValue,
        newValue;

    oldValue = cdi.options.value.getTime();

    setTimeout(function () {
        axis.redraw();

        newValue = cdi.options.value.getTime();

        assert.ok(
            newValue > oldValue,
            'Value is greater after Axis.redraw()'
        );
        done();
    }, wait);
});

/**
 * Checks that the label text updates on Axis.redraw().
 */
QUnit.test('Label text', function (assert) {
    var chart = Highcharts.chart('container', defaultConfig),
        axis = chart.xAxis[0],
        cdi = axis.plotLinesAndBands[0],
        done = assert.async(),
        wait = 1000, // Comparing seconds, so 1 second is required
        oldLabelText,
        newLabelText;

    oldLabelText = cdi.label.textStr;

    setTimeout(function () {

        axis.redraw();

        newLabelText = cdi.label.textStr;

        assert.notEqual(
            newLabelText,
            oldLabelText,
            'label text gets updated on Axis.redraw()'
        );
        done();
    }, wait);
});
