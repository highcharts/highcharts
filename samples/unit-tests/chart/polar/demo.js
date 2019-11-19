QUnit.test('Polar chart with no data (#5226)', function (assert) {
    assert.expect(0);
    Highcharts.chart('container', {
        chart: {
            polar: true
        },

        series: [{
            type: 'line',
            name: 'Line',
            data: []
        }]
    });
});
QUnit.test("Polar and categorized chart should not render extra alternate band.(#2248)", function (assert) {
    var chart = $('#container').highcharts({
            chart: {
                polar: true
            },
            xAxis: {
                // This alternateGridColor is wrong:
                alternateGridColor: '#FFC0C0',
                categories: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
                // The X axis line is a circle instead of a polygon
                lineWidth: 0
            },
            yAxis: {
                //This is correct:
                alternateGridColor: '#C0FFC0',
                gridLineInterpolation: 'polygon',
                title: {
                    text: 'Y-axis'
                }
            },
            series: [{
                name: 'Serie 1',
                data: [7.0, 6.9, 9.5, 14.5, 18.2]
            }, {
                name: 'Serie 2',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0]
            }, {
                name: 'Serie 3',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5]
            }]
        }).highcharts(),
        UNDEFINED;

    assert.strictEqual(
        chart.xAxis[0].alternateBands[4],
        UNDEFINED,
        "Zero extra bands.");
});

QUnit.test('Paddings and extremes', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            polar: true
        },
        xAxis: {
            maxPadding: 0,
            minPadding: 0
        },
        series: [{
            data: [67, 29, 70, 91, 59, 53, 17, 63, 20, 31, 31]
        }]

    });

    // Axis setExtremes caused padded axis (#5662)
    assert.strictEqual(
        chart.xAxis[0].max,
        11,
        'Axis initially padded as per autoConnect (#5662).'
    );


    chart.xAxis[0].setExtremes(4, 10);

    assert.strictEqual(
        chart.xAxis[0].max,
        10,
        'Data max same as before, but padding is now gone because we have hard extremes (#5662).'
    );

    // #7996
    chart.series[0].setData([2, 1, 2, 1, 2, 2], false);
    chart.xAxis[0].setExtremes(null, null);

    Highcharts.each([15, 120, 135, 225, 285, 300], function (startAngle) {
        chart.update({
            pane: {
                startAngle: startAngle
            }
        });
        assert.strictEqual(
            chart.xAxis[0].autoConnect,
            true,
            'Extra space added when startAngle=' + startAngle + ' (#7996).'
        );
    });
});

// Highcharts 3.0.10, Issue #2848
// Polar chart with reversed yAxis
QUnit.test('Polar reversed yaxis (#2848)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            height: 350,
            polar: true,
            type: 'line'
        },
        yAxis: {
            reversed: true
        },
        series: [{
            name: 'Allocated Budget',
            data: [43000, 19000, 60000, 35000, 17000, 10000],
            pointPlacement: 'on'
        }, {
            name: 'Actual Spending',
            data: [50000, 39000, 42000, 31000, 26000, 14000],
            pointPlacement: 'on'
        }]
    });

    function increaseHeight() {

        chart.update({
            chart: {
                height: (chart.plotHeight + 1)
            }
        });

        assert.ok(
            chart.yAxis[0].translationSlope < 0.002,
            'There should be no increase to the translation slope of the yAxis.'
        );

    }

    for (var i = 0; i < 100; ++i) {
        increaseHeight();
    }

});

QUnit.test('Polar with overlapping axis labels', assert => {

    const data = [];

    for (let i = 0; i < 100; i++) {
        data.push({
            name: 'name' + i,
            y: i % 20
        });
    }

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'line',
            polar: true
        },
        title: {
            text: 'Polar Chart - overlapping axis label (With Category)'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            type: 'column',
            data: data
        }]
    });

    assert.ok(
        chart.xAxis[0].tickPositions.some(
            pos => chart.xAxis[0].ticks[pos]
                .label
                .element
                .getAttribute('opacity') === '0'
        ),
        'The axis should have some hidden labels'
    );

    chart.xAxis[0].update({
        labels: {
            allowOverlap: true
        }
    });

    assert.notOk(
        chart.xAxis[0].tickPositions.some(
            pos => chart.xAxis[0].ticks[pos]
                .label
                .element
                .getAttribute('opacity') === '0'
        ),
        'The axis should have no hidden labels'
    );
});

QUnit.test('Data validation', assert => {
    const chart = Highcharts.chart('container', {

        chart: {
            polar: true
        },

        yAxis: {
            min: -10
        },

        series: [{
            data: [15, 20, 5, 2, -25]
        }]

    });

    // #10082
    assert.deepEqual(
        chart.series[0].points.map(p => p.isNull),
        [false, false, false, false, true],
        'Values below Y axis mininum should be treated as null'
    );

    chart.series[0].points[4].update(25);
    assert.deepEqual(
        chart.series[0].points.map(p => p.isNull),
        [false, false, false, false, false],
        '... and it should respond to update'
    );

    chart.series[0].points[2].update(-25);
    assert.deepEqual(
        chart.series[0].points.map(p => p.isNull),
        [false, false, true, false, false],
        '... both ways'
    );
});


QUnit.test('Polar and pie in panes (#11897)', assert => {
    Highcharts.chart('container', {
        chart: {
            polar: true
        },
        pane: {
            center: ['25%', '50%']
        },
        series: [{
            type: 'column',
            data: [1, 2, 3]
        }, {
            type: 'pie',
            data: [1, 2, 3],
            center: ['75%', '50%']
        }]
    });

    assert.ok(true, "No errors (#11897).");
});

QUnit.test(
    'Polar and clipping',
    assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                polar: true
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        const oldLen = chart.container.querySelectorAll('defs clipPath').length;

        chart.series[0].setData([4, 3, 1]);

        assert.strictEqual(
            chart.container.querySelectorAll('defs clipPath').length,
            oldLen,
            'On data update new clip paths should not be created (#12335)'
        );

    }
);