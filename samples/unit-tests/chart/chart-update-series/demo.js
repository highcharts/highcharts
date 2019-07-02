/* eslint func-style:0 */


QUnit.test('Test updating series by id', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last',
            id: 'last'
        }]
    });

    assert.strictEqual(
        chart.series[1].type,
        'column',
        'Initial type is column'
    );

    chart.update({
        series: [{
            id: 'last',
            type: 'line'
        }]
    });

    assert.strictEqual(
        chart.series[1].type,
        'line',
        'Id given, type changed to line'
    );

    chart.update({
        series: [{
            type: 'line'
        }]
    });

    assert.strictEqual(
        chart.series[0].type,
        'line',
        'No id, type changed to line'
    );

    chart.series[0].points[0].tagged = 'oh, yes';
    chart.update({
        chart: {
            type: 'column'
        }
    });
    assert.strictEqual(
        chart.series[0].points[0].tagged,
        'oh, yes',
        'When not changing chart type, the point should survive (#9197)'
    );

    chart.series[0].update({
        dataLabels: {
            enabled: true
        }
    });
    chart.series[0].points[0].tagged = 'oh, yes, again';
    chart.series[0].update({
        dataLabels: {
            enabled: true
        },
        data: [1, 2, 3, 4]
    });
    assert.strictEqual(
        chart.series[0].points[0].tagged,
        'oh, yes, again',
        'When not changing series props, the point should survive'
    );

});

QUnit.test('Updating axes and series', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3],
            yAxis: 0
        }, {
            data: [3, 2, 1],
            yAxis: 1
        }, {
            data: [2, 2, 2],
            yAxis: 2
        }],
        yAxis: [{}, {}, {}]
    });

    chart.update({
        series: [{
            data: [1, 2, 3],
            yAxis: 0
        }],
        yAxis: [{}]

    }, true, true, true);

    assert.strictEqual(
        chart.series.length,
        1,
        'The updated chart should have one series (#9097)'
    );
    assert.strictEqual(
        chart.yAxis.length,
        1,
        'The updated chart should have one Y axis (#9097)'
    );
});

QUnit.test('Updating series with indexes', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            index: 2,
            data: [1, 2, 3]
        }, {
            index: 1,
            data: [3, 2, 1]
        }]
    });

    chart.update({
        series: [{
            index: 2,
            data: [1, 1, 1]
        }, {
            index: 1,
            data: [2, 2, 2]
        }, {
            index: 4,
            data: [3, 3, 3]
        }]
    }, true, true, false);

    assert.strictEqual(
        chart.series.length,
        3,
        'The updated chart should have three series (#9226)'
    );
});

QUnit.test('Chart.update and series events (#11088)', assert => {
    const counters = {
        initial: 0,
        updated: 0,
        updated2: 0
    };
    const chart =  Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 300
        },
        series: [{
            type: 'column',
            data: [3, 2, 1]
        }],
        plotOptions: {
            series: {
                events: {
                    click: () => counters.initial++
                }
            }
        }
    });
    let controller = new TestController(chart);
    controller.moveTo(100, 120);
    controller.click(100, 120, undefined, true);

    assert.strictEqual(
        counters.initial,
        1,
        'Initial click handler should fire'
    );

    chart.update({
        plotOptions: {
            series: {
                events: {
                    click: () => counters.updated++
                }
            }
        }
    });

    controller = new TestController(chart);
    controller.moveTo(100, 130);
    controller.click(100, 130, undefined, true);

    assert.strictEqual(
        counters.initial,
        1,
        'Initial click handler should not fire'
    );
    assert.strictEqual(
        counters.updated,
        1,
        'Updated click handler should fire'
    );

    chart.series[0].update({
        pointStart: 2019,
        events: {
            click: () => counters.updated2++
        }
    });

    controller.moveTo(100, 140);
    controller.click(100, 140, undefined, true);
    assert.strictEqual(
        counters.updated,
        1,
        'With new points, updated click handler should not fire'
    );
    assert.strictEqual(
        counters.updated2,
        1,
        'With new points, updated click handler should fire'
    );

});
