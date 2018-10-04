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

