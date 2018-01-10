// Test both, ordinal and non-ordinal axes:
Highcharts.each([true, false], function (ordinal) {


    // Highstock modifies "series" property, so use separate object each time:
    function getOptions() {
        return {
            chart: {
                width: 600
            },
            rangeSelector: {
                buttons: [{
                    type: 'millisecond',
                    count: 10,
                    text: '1s'
                }],
                selected: 0
            },
            xAxis: {
                overscroll: 5,
                ordinal: ordinal
            },
            navigator: {
                xAxis: {
                    overscroll: 5
                }
            },
            series: [{
                data: [
                    29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 48.5, 16.4,
                    194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
                    135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 54.4, 54.4, 154.4
                ]
            }]
        };
    }


    QUnit.test('Ordinal: ' + ordinal + ' - Extremes from rangeSelector buttons', function (assert) {
        var options = getOptions(),
            xAxis;

        xAxis = Highcharts.stockChart('container', options).xAxis[0];

        assert.strictEqual(
            xAxis.max - xAxis.min,
            options.rangeSelector.buttons[0].count,
            'Correct range with preselected button (1s)'
        );

        options = getOptions();
        options.rangeSelector.selected = null;

        xAxis = Highcharts.stockChart('container', options).xAxis[0];

        assert.strictEqual(
            xAxis.max - xAxis.min,
            xAxis.series[0].options.data.length - 1 + options.xAxis[0].overscroll,
            'Correct range with ALL'
        );
    });

    QUnit.test('Ordinal: ' + ordinal + ' - Extremes after addPoint()', function (assert) {
        var options = getOptions(),
            chart;

        chart = Highcharts.stockChart('container', options);

        chart.series[0].addPoint(15, false, false);
        chart.series[0].addPoint(15, false, false);
        chart.series[0].addPoint(12);


        assert.strictEqual(
            chart.xAxis[0].max,
            chart.xAxis[0].dataMax + chart.xAxis[0].options.overscroll,
            'Correct max'
        );

        assert.strictEqual(
            chart.xAxis[0].min,
            chart.xAxis[0].dataMax + chart.xAxis[0].options.overscroll - 10,
            'Correct min'
        );
    });

    QUnit.test('Ordinal: ' + ordinal + ' - Extremes after scrollbar button click', function (assert) {
        var done = assert.async(),
            options = getOptions(),
            event = {
                trigger: 'scrollbar'
            },
            chart;

        chart = Highcharts.stockChart('container', options);

        chart.scrollbar.buttonToMinClick(event);
        chart.scrollbar.buttonToMinClick(event);
        chart.scrollbar.buttonToMinClick(event);

        setTimeout(function () {
            // Scrollbar button calls setExtremes with timeout(0):
            assert.strictEqual(
                chart.xAxis[0].max !== chart.xAxis[0].dataMax + chart.xAxis[0].options.overscroll,
                true,
                'Button click does not go backto the max'
            );
            done();
        });
    });

    QUnit.test('Ordinal: ' + ordinal + ' - Extremes for uneven data', function (assert) {
        var options = getOptions(),
            xAxis;

        options.rangeSelector.selected = null;
        options.series[0].data = [
            [0, 5], [10, 5], [20, 5], [400, 5], [401, 5], [402, 5], [404, 5]
        ];

        xAxis = Highcharts.stockChart('container', options).xAxis[0];

        assert.strictEqual(
            xAxis.max - xAxis.min,
            xAxis.dataMax + options.xAxis[0].overscroll,
            'Correct range with ALL'
        );
    });
});

