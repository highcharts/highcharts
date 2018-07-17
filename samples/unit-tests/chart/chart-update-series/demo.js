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

