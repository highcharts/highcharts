QUnit.test('Negative timezoneOffset', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        xAxis: {
            type: 'datetime'
        },
        time: {
            timezoneOffset: -3 * 60
        },
        series: [
            {
                data: [
                    {
                        x: 1493031600000,
                        y: 39.9
                    },
                    {
                        x: 1493031630000,
                        y: 81.5
                    }
                ]
            }
        ]
    });

    var ticks = chart.xAxis[0].tickPositions.map(function (pos) {
        return chart.xAxis[0].ticks[pos].label.element.textContent;
    });

    assert.deepEqual(ticks, ['14:00:00', '14:00:30'], 'Two ticks');


});

QUnit.test('Crossing DST with a wide pointRange (#7432)', function (assert) {
    Highcharts.setOptions({
        time: {
            timezone: 'Europe/Copenhagen'
        }
    });

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 600
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%d<br>%H:%M}'
            }
        },
        series: [
            {
                data: [
                    [Date.UTC(2017, 9, 29, 23), 10],
                    [Date.UTC(2017, 9, 30, 23), 8]
                ]
            }
        ]
    });

    assert.notEqual(
        chart.xAxis[0].ticks[
            chart.xAxis[0].tickPositions[0]
        ].label.element.textContent.indexOf('00:00'),
        -1,
        'Tick should land on midnight'
    );
    assert.notEqual(
        chart.xAxis[0].ticks[
            chart.xAxis[0].tickPositions[1]
        ].label.element.textContent.indexOf('00:00'),
        -1,
        'Tick should land on midnight'
    );

    Highcharts.setOptions({
        time: {
            timezone: undefined
        }
    });
});

// Highcharts v4.0.3, Issue #3359
// Default datetime axis formatter glitch when timezoneOffset is negative
// Skipped, doesn't work in browser
QUnit.skip('Midnight ticks should show date (#3359)', function (assert) {
    function initChart(timezoneOffset) {
        Highcharts.setOptions({
            global: {
                timezoneOffset: timezoneOffset
            }
        });
        var chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },
            xAxis: {
                type: 'datetime'
            },
            series: [
                {
                    data: Array.apply(null, { length: 48 }).map(Math.random),
                    pointStart: Date.UTC(2013, 0, 1, 12),
                    pointInterval: 36e5 // one hour
                }
            ]
        });
        return chart;
    }

    function getCurrentTickLabels(children) {
        var tickLabels = [];
        for (var i = 0; i < children.length; i++) {
            tickLabels.push(children[i].textContent);
        }
        return tickLabels;
    }
    var defaultHighchartsOptions = Highcharts.getOptions().global
        .timezoneOffset;
    var minus60OffsetXLabels = [
        '16:00',
        '2. Jan',
        '08:00',
        '16:00',
        '3. Jan',
        '08:00'
    ];
    var plus60OffsetXLabels = [
        '16:00',
        '2. Jan',
        '08:00',
        '16:00',
        '3. Jan',
        '0…08:00'
    ];
    var chartMinus60OffsetXLabels = getCurrentTickLabels(
        initChart(-60).xAxis[0].labelGroup.element.childNodes || []
    );
    var chartPlus60OffsetXLabels = getCurrentTickLabels(
        initChart(60).xAxis[0].labelGroup.element.childNodes || []
    );
    assert.deepEqual(
        chartMinus60OffsetXLabels,
        minus60OffsetXLabels,
        'Midnight ticks is not showing properly'
    );
    assert.notDeepEqual(
        chartPlus60OffsetXLabels,
        minus60OffsetXLabels,
        'The timezone offset is not working as it should'
    );

    assert.deepEqual(
        chartPlus60OffsetXLabels,
        plus60OffsetXLabels,
        'Midnight ticks is not showing properly'
    );
    // reset options
    initChart(defaultHighchartsOptions);
});
