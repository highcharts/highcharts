QUnit.test('#6930 - scrollbar had wrong extremes when data was not set.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                scrollbar: {
                    enabled: true
                },
                min: 1497132000000,
                max: 1497218399000,
                type: "datetime"
            },
            series: [{
                data: []
            }]
        }),
        scrollbar = chart.xAxis[0].scrollbar;

    assert.strictEqual(
        scrollbar.from === 0,
        true,
        'Scrollbar starts from left button.'
    );
    assert.strictEqual(
        scrollbar.to === 1,
        true,
        'Scrollbar ends at right edge.'
    );

});

// Highstock 4.0.1, Issue #3040
// Scrolling outside data range possible
QUnit.test('Scrolling outside range (#3040)', function (assert) {

    TestTemplate.test('highcharts/line', {

        legend: {
            enabled: false
        },

        scrollbar: {
            enabled: true
        },

        xAxis: {
            type: "datetime",
            ordinal: false
        },

        series: [{
            data: [1, 4, 3, 4, 5, 5, 4, 34, 23, 2, 3, 3, 4, 45, 5, 6],
            pointStart: Date.UTC(2014, 4, 5),
            pointInterval: 24 * 36e5
        }]

    }, function (template) {

        var chart = template.chart;

        chart.update({
            xAxis: {
                min: Date.UTC(2014, 4, 1),
                max: Date.UTC(2014, 4, 31)
            }
        });

        chart.xAxis[0].setExtremes(
            Date.UTC(2014, 4, 1), Date.UTC(2014, 4, 4), true, false
        );

        assert.ok(
            chart.scroller.range > 0,
            'There should be a visible range after a lower out of range.'
        );

        chart.xAxis[0].setExtremes(
            Date.UTC(2014, 4, 20), Date.UTC(2014, 4, 25), true, false
        );

        assert.ok(
            chart.scroller.range > 0,
            'There should be a visible range after a higher out of range.'
        );

        chart.xAxis[0].setExtremes(
            Date.UTC(2014, 4, 1), Date.UTC(2014, 4, 7), true, false
        );

        assert.ok(
            chart.scroller.range > 0,
            'There should be a visible range.'
        );

    });

    TestTemplate.test('highstock/line', {

        legend: {
            enabled: false
        },

        navigator: {
            enabled: false
        },

        xAxis: {
            type: "datetime",
            ordinal: false
        },

        series: [{
            data: [1, 4, 3, 4, 5, 5, 4, 34, 23, 2, 3, 3, 4, 45, 5, 6],
            pointStart: Date.UTC(2014, 4, 5),
            pointInterval: 24 * 36e5
        }]

    }, function (template) {

        var chart = template.chart;

        chart.update({
            xAxis: {
                min: Date.UTC(2014, 4, 1),
                max: Date.UTC(2014, 4, 31)
            }
        });

        chart.xAxis[0].setExtremes(
            Date.UTC(2014, 4, 1), Date.UTC(2014, 4, 4), true, false
        );

        assert.ok(
            chart.scroller.range > 0,
            'There should be a visible range after a lower out of range.'
        );

        chart.xAxis[0].setExtremes(
            Date.UTC(2014, 4, 20), Date.UTC(2014, 4, 25), true, false
        );

        assert.ok(
            chart.scroller.range > 0,
            'There should be a visible range after a higher out of range.'
        );

        chart.xAxis[0].setExtremes(
            Date.UTC(2014, 4, 1), Date.UTC(2014, 4, 7), true, false
        );

        assert.ok(
            chart.scroller.range > 0,
            'There should be a visible range.'
        );

    });

});
