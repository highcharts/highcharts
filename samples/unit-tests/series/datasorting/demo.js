QUnit.test('Data sorting ', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },
            series: [{
                type: 'column',
                data: [1, 2, 3],
                dataSorting: {
                    enabled: true
                }
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.xData[0],
        2,
        'Series should be correctly sorted.'
    );

    chart.update({
        xAxis: {
            type: 'category'
        },
        series: [{
            dataSorting: {
                matchByName: true
            },
            data: [
                ['A', 3],
                ['B', 5]
            ]
        }]
    });

    assert.strictEqual(
        series.points[0].x === 1 && series.points[1].x === 0,
        true,
        'Series should be sorted after changed xAxis to category type.'
    );

    series.setData([
        ['C', 2],
        ['A', 4]
    ]);

    assert.strictEqual(
        series.points[0].name,
        'A',
        'Points should be correctly matched by name.'
    );

    chart.update({
        series: [{
            data: [1, 5],
            linkedTo: 'mainSeries',
            dataSorting: {
                enabled: false
            }
        }, {
            id: 'mainSeries',
            dataSorting: {
                enabled: true
            },
            type: 'scatter',
            data: [1, 5]
        }]
    }, true, true);

    assert.strictEqual(
        series.points[1].x === 0 &&
        chart.series[1].points[0].x === 1,
        true,
        'Second series should be sorted.'
    );

    chart.update({
        chart: {
            polar: true
        },
        series: [{
            data: [5, 4, 6, 1],
            dataSorting: {
                enabled: true
            }
        }]
    }, true, true);

    assert.strictEqual(
        series.points[2].x,
        0,
        'Series should be sorted in polar chart.'
    );

});
