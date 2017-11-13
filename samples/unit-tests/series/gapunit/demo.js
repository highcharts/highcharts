

QUnit.test('Gap unit', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            data: [
                [0, 0],
                [10, 1],
                [20, 2],
                [60, 6],
                [70, 7]
            ]
        }]
    });

    var series = chart.series[0];
    assert.strictEqual(
        series.graph.attr('d').lastIndexOf('M'),
        0,
        'No gap'
    );


    series.update({
        gapSize: 2
    });
    assert.notEqual(
        series.graph.attr('d').lastIndexOf('M'),
        0,
        'Has gap'
    );

    series.update({
        gapUnit: 'value'
    });

    assert.strictEqual(
        series.graph.attr('d').lastIndexOf('L'),
        -1,
        'All gaps'
    );

});

QUnit.test('Gap size for multiple series (#4747)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        "xAxis": {
            "min": 0
        },
        plotOptions: {
            series: {
                gapSize: 1,
                lineWidth: 10
            }
        },
        "series": [{
            name: 'Spacing = 1',
            data: [
                [0, 1],
                [1, 1],
                [2, 1],
                [4, 1],
                [5, 1],
                [6, 1]
            ]
        }, {
            name: 'Spacing = 2',
            data: [
                [0, 2],
                [2, 2],
                [4, 2],
                [8, 2],
                [10, 2],
                [12, 2]
            ]
        }, {
            name: 'Spacing = 3',
            data: [
                [0, 3],
                [3, 3],
                [6, 3],
                [9, 3],
                [15, 3],
                [18, 3]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].graph.attr('d').match(/M/g).length,
        2,
        'series[0] has two moveTo statements'
    );
    assert.strictEqual(
        chart.series[1].graph.attr('d').match(/M/g).length,
        2,
        'series[1] has two moveTo statements'
    );
    assert.strictEqual(
        chart.series[2].graph.attr('d').match(/M/g).length,
        2,
        'series[2] has two moveTo statements'
    );
});