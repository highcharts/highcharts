QUnit.test('RangeSelector.updateButtonStates', function (assert) {
    var RangeSelector = Highcharts.RangeSelector,
        updateButtonStates = RangeSelector.prototype.updateButtonStates,
        now = +new Date(),
        month = 30 * 24 * 36e5,
        createButton = function (o) {
            return {
                state: undefined,
                name: o.text,
                setState: function (state) {
                    this.state = state;
                }
            };
        },
        getState = function (button) {
            return button.state;
        },
        buttonOptions = RangeSelector.prototype.defaultButtons.map(function (
            rangeOptions
        ) {
            RangeSelector.prototype.computeButtonRange(rangeOptions);
            return rangeOptions;
        }),
        buttons = buttonOptions.map(createButton),
        rangeSelector = {
            buttons: buttons,
            buttonOptions: buttonOptions,
            chart: {
                xAxis: [
                    {
                        min: now - 24 * month,
                        minRange: 0,
                        max: now,
                        dataMin: now - 36 * month,
                        dataMax: now,
                        hasVisibleSeries: true
                    }
                ],
                time: new Highcharts.Time()
            },
            getYTDExtremes: RangeSelector.prototype.getYTDExtremes,
            options: {
                allButtonsEnabled: undefined
            },
            selected: undefined
        },
        result;
    updateButtonStates.call(rangeSelector);
    result = rangeSelector.buttons.map(getState);
    assert.deepEqual(result, [0, 0, 0, 0, 0, 0], 'Normal states.');

    rangeSelector.chart.xAxis[0].minRange = 2 * month;
    updateButtonStates.call(rangeSelector);
    result = rangeSelector.buttons.map(getState);
    assert.deepEqual(result, [3, 0, 0, 0, 0, 0], 'minRange above 1m.');

    rangeSelector.chart.xAxis[0].min = now - 6 * month;
    rangeSelector.selected = 2;
    updateButtonStates.call(rangeSelector);
    result = rangeSelector.buttons.map(getState);
    assert.deepEqual(result, [3, 0, 2, 0, 0, 0], 'Select 6m.');

    rangeSelector.chart.xAxis[0].dataMin = now - 9 * month;
    updateButtonStates.call(rangeSelector);
    result = rangeSelector.buttons.map(getState);
    assert.deepEqual(
        result,
        [3, 0, 2, 0, 3, 0],
        '1y has greater range than axis.'
    );

    rangeSelector.options.allButtonsEnabled = true;
    updateButtonStates.call(rangeSelector);
    result = rangeSelector.buttons.map(getState);
    assert.deepEqual(result, [0, 0, 2, 0, 0, 0], 'allButtonsEnabled.');
});

QUnit.test('RangeSelector.updateButtonStates, visual output', assert => {
    const getOptions = () => ({
        chart: {
            type: 'column',
            width: 600
        },

        series: [
            {
                data: (function () {
                    const dataArrayTmp = [];
                    for (let i = 0; i < 2 * 24; i++) {
                        dataArrayTmp.push([i * 120000, 1]);
                    }
                    return dataArrayTmp;
                }())
            }
        ],

        rangeSelector: {
            buttons: [
                {
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }
            ]
        }
    });

    const chart = Highcharts.stockChart('container', getOptions());

    chart.rangeSelector.clickButton(0);

    assert.deepEqual(
        chart.rangeSelector.buttons.map(b => b.state),
        [2],
        'The button should be clicked'
    );
    assert.strictEqual(
        chart.rangeSelector.selected,
        0,
        'The selected property should be updated'
    );
    assert.strictEqual(
        chart.rangeSelector.options.selected,
        0,
        'The selected option should be updated'
    );

    // Change the extremes
    chart.xAxis[0].setExtremes(chart.xAxis[0].min + 12000, chart.xAxis[0].max);

    assert.deepEqual(
        chart.rangeSelector.buttons.map(b => b.state),
        [0],
        'The button should not be clicked'
    );
    assert.strictEqual(
        chart.rangeSelector.selected,
        undefined,
        'The selected property should be updated'
    );
    assert.strictEqual(
        chart.rangeSelector.options.selected,
        undefined,
        'The selected option should be updated'
    );

    // Update the series
    chart.update(getOptions());

    assert.deepEqual(
        chart.rangeSelector.buttons.map(b => b.state),
        [0],
        'The button should not be selected after redraw (#9209)'
    );
    assert.strictEqual(
        chart.rangeSelector.selected,
        undefined,
        'The selected property should remain after redraw (#9209)'
    );
    assert.strictEqual(
        chart.rangeSelector.options.selected,
        undefined,
        'The selected option should remain after redraw (#9209)'
    );

    // #19808
    chart.update({
        rangeSelector: {
            buttons: [
                {
                    type: 'week',
                    count: 1,
                    text: '1W'
                },
                {
                    type: 'month',
                    count: 1,
                    text: '1M'
                },
                {
                    type: 'year',
                    count: 1,
                    text: '1Y'
                }
            ]
        },
        xAxis: {
            minRange: 5 * 24 * 36e5
        },
        series: {
            dataGrouping: {
                enabled: false
            },
            data: (function () {
                const dataArrayTmp = [];
                const startDate = new Date('2015-01-01');
                for (startDate; startDate <= new Date('2016-02-01'); startDate.setDate(startDate.getDate() + 1)) {
                    dataArrayTmp.push([startDate.getTime(), 1]);
                }
                return dataArrayTmp;
            }())
        }
    });
    const day = 24 * 36e5,
        xAxis = chart.xAxis[0],
        max = xAxis.max,
        buttons = chart.rangeSelector.buttons,
        correctStates = [0, 2, 2, 0];

    // Week
    const weekState = [
        6.4 * day, // (0) inactive
        6.5 * day, // (2) active
        7.5 * day, // (2) active
        7.6 * day  // (0) inactive
    ].map(range => {
        xAxis.setExtremes(max - range, null);
        return buttons[0].state;
    });
    assert.deepEqual(
        weekState,
        correctStates,
        'Week state button should have correct states in various ranges, #19808.'
    );

    // Month
    const monthState = [
        26.9 * day, // (0) inactive
        27 * day,   // (2) active
        32 * day,   // (2) active
        32.1 * day  // (0) inactive
    ].map(range => {
        xAxis.setExtremes(max - range, null);
        return buttons[1].state;
    });
    assert.deepEqual(
        monthState,
        correctStates,
        'Month state button should have correct states in various ranges, #19808.'
    );

    // Year
    const yearState = [
        363.5 * day, // (0) inactive
        364 * day,   // (2) active
        367 * day,   // (2) active
        367.5 * day  // (0) inactive
    ].map(range => {
        xAxis.setExtremes(max - range, null);
        return buttons[2].state;
    });
    assert.deepEqual(
        yearState,
        correctStates,
        'Year state button should have correct states in various ranges, #19808.'
    );
});

QUnit.test('RangeSelector.getYTDExtremes', function (assert) {
    var getYTDExtremes = Highcharts.RangeSelector.prototype.getYTDExtremes,
        now = +new Date(),
        month = 30 * 24 * 36e5,
        year = new Date().getFullYear(),
        startOfYear = +new Date(year, 0, 1),
        startOfUTCYear = +new Date(Date.UTC(year, 0, 1)),
        dataMin = now - 24 * month,
        dataMax = now,
        ctx = {
            chart: {
                time: new Highcharts.Time()
            }
        };
    assert.deepEqual(
        getYTDExtremes.call(ctx, dataMax, dataMin),
        {
            min: startOfYear,
            max: now
        },
        'From start of current year to current date. Local timezone.'
    );

    assert.deepEqual(
        getYTDExtremes.call(ctx, dataMax, dataMin, true),
        {
            min: startOfUTCYear,
            max: now
        },
        'From start of current year to current date. UTC.'
    );

    dataMax = now - 1; // Current date minus 1 millisecond
    assert.deepEqual(
        getYTDExtremes.call(ctx, dataMax, dataMin),
        {
            min: startOfYear,
            max: dataMax
        },
        'dataMax is lower than current date.'
    );

    dataMin = startOfYear + 1; // Start of year plus 1 millisecond
    assert.deepEqual(
        getYTDExtremes.call(ctx, dataMax, dataMin),
        {
            min: dataMin,
            max: dataMax
        },
        'dataMin is higher than start of year.'
    );
});
