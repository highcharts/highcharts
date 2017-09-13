QUnit.test('variwide', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'variwide'
        },

        xAxis: {
            type: 'category'
        }

    });

    assert.strictEqual(
        chart.series.length,
        0,
        'No series'
    );

    chart.addSeries({
        data: [
            [1, 1],
            [2, 2],
            [3, 3]
        ]
    });


    assert.strictEqual(
        chart.series[0].points.length,
        3,
        'Series successfully added'
    );

    chart.series[0].addPoint({
        y: 20,
        z: 50
    });

    assert.deepEqual(
        chart.series[0].points.length,
        4,
        'addPoint'
    );

    chart.series[0].removePoint(0);
    assert.deepEqual(
        chart.series[0].points.length,
        3,
        'removePoint'
    );
});

QUnit.test('variwide null points', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'variwide'
        },

        xAxis: {
            type: 'category'
        },

        series: [{
            data: [
                [1, 1],
                [2, null],
                [null, 3],
                [null, null],
                [3, 3]
            ]
        }]

    });

    assert.strictEqual(
        chart.series[0].points.map(function (p) {
            return p.isNull ? 'null' : 'valid';
        }).join(','),
        'valid,null,null,null,valid',
        'Nulls detected'
    );

});
