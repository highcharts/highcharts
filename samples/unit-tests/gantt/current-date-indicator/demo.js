(function () {
    var today,
        day,
        defaultConfig;


    /**
     * Sets common test variables
     */
    QUnit.testStart(function () {
        today = new Date();
        day = 1000 * 60 * 60 * 24;

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
    });

    /**
     * Checks that the value updates on Axis.redraw().
     */
    QUnit.test('Value', function (assert) {
        var chart = Highcharts.chart('container', defaultConfig),
            axis = chart.xAxis[0],
            cdi = axis.plotLinesAndBands[0],
            wait = 1, // Comparing milliseconds, so 1 millisecond is enough
            oldValue,
            newValue,
            clock = TestUtilities.lolexInstall();

        try {
            oldValue = cdi.options.value.getTime();

            // Run lolex ticker
            setTimeout(function () { }, wait);

            TestUtilities.lolexRunAndUninstall(clock);

            axis.redraw();

            newValue = cdi.options.value.getTime();

            assert.ok(
                newValue > oldValue,
                'Value is greater after Axis.redraw()'
            );

        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    });

    /**
     * Checks that the label text updates on Axis.redraw().
     */
    QUnit.test('Label text', function (assert) {
        var config = Highcharts.merge(defaultConfig);

        config.xAxis[0].currentDateIndicator = {
            label: {
                format: '%H:M:S.%L'
            }
        };
        var chart = Highcharts.chart('container', config),
            axis = chart.xAxis[0],
            cdi = axis.plotLinesAndBands[0],
            wait = 1,
            oldLabelText,
            newLabelText,
            clock = TestUtilities.lolexInstall();

        try {
            oldLabelText = cdi.label.textStr;

            // Run lolex ticker
            setTimeout(function () {}, wait);
            TestUtilities.lolexRunAndUninstall(clock);

            axis.redraw();

            newLabelText = cdi.label.textStr;

            assert.notEqual(
                newLabelText,
                oldLabelText,
                'label text gets updated on Axis.redraw()'
            );
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    });

    /**
     * Checks that the default and custom label formats are applied
     */
    QUnit.test('Format', function (assert) {
        // %a, %b %d %Y, %H:%M:%S
        var formatRegex = new RegExp(
                // 'Tue, Dec 06 2016, '
                /^[A-Z][a-z]{2}, [A-Z][a-z]{2} [0-9]{2} [0-9]{4}, /.source +
                // '21:35:12'
                /[0-9]{2}:[0-9]{2}$/.source
            ),
            customFormat,
            chart = Highcharts.chart('container', defaultConfig),
            axis = chart.xAxis[0],
            cdi = axis.plotLinesAndBands[0];

        assert.ok(
            formatRegex.test(cdi.label.textStr),
            'Default format is correct'
        );

        // Custom format
        formatRegex = new RegExp(
            /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.source
        );
        customFormat = '%Y-%d-%m %H:%M:%S';
        chart = Highcharts.chart('container', Highcharts.merge(defaultConfig, {
            xAxis: [{
                currentDateIndicator: {
                    label: {
                        format: customFormat
                    }
                }
            }]
        }));

        axis = chart.xAxis[0];
        cdi = axis.plotLinesAndBands[0];

        assert.ok(
            formatRegex.test(cdi.label.textStr),
            'Custom format is correct'
        );
    });

    /**
     * Checks that a custom format has precedence and that a custom formatter is
     * applied if no custom format was added.
     */
    QUnit.test('Formatter', function (assert) {
        // Today: Tue, Dec 06 2016
        var formatRegex = /^Today: [A-Z][a-z]{2}, [A-Z][a-z]{2} [0-9]{2} [0-9]{4}$/,
            customFormat,
            chart,
            axis,
            cdi;

        // Custom formatter
        defaultConfig.xAxis[0].currentDateIndicator = {
            label: {
                formatter: function () {
                    var dateFormat = '%a, %b %d %Y',
                        date = Highcharts.dateFormat(
                            dateFormat,
                            this.options.value
                        );
                    return 'Today: ' + date;
                }
            }
        };

        chart = Highcharts.chart('container', defaultConfig);
        axis = chart.xAxis[0];
        cdi = axis.plotLinesAndBands[0];

        assert.ok(
            formatRegex.test(cdi.label.textStr),
            'Custom formatter is applied when no custom format is defined'
        );

        // Custom format
        formatRegex = new RegExp(
            /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.source
        );
        customFormat = '%Y-%d-%m %H:%M:%S';
        chart = Highcharts.chart('container', Highcharts.merge(defaultConfig, {
            xAxis: [{
                currentDateIndicator: {
                    label: {
                        format: customFormat
                    }
                }
            }]
        }));

        axis = chart.xAxis[0];
        cdi = axis.plotLinesAndBands[0];

        assert.ok(
            formatRegex.test(cdi.label.textStr),
            'Formatter is ignored when custom format is defined'
        );
    });

    QUnit.test('#14166: Per-chart time options', function (assert) {
        var chart = Highcharts.chart('container', defaultConfig);
        var t0 = Date.parse(chart.xAxis[0].plotLinesAndBands[0].label.textStr);

        chart = Highcharts.chart('container', Highcharts.merge(defaultConfig, {
            time: {
                timezoneOffset: -5
            }
        }));
        var t1 = Date.parse(chart.xAxis[0].plotLinesAndBands[0].label.textStr);

        assert.ok(t1 - t0 >= 300000, 'Per-chart time options work');
    });
}());
