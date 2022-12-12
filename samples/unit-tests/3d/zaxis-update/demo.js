QUnit.test(
    '3D logarithmic zAxis miscalculated points\' plotting Z.(#4562)',
    function (assert) {
        var chart = $('#container')
            .highcharts({
                chart: {
                    type: 'scatter',
                    options3d: {
                        enabled: true,
                        alpha: 20,
                        beta: 30,
                        depth: 200,
                        viewDistance: 10
                    }
                },
                zAxis: {
                    type: 'logarithmic'
                },
                series: [
                    {
                        data: [
                            [1, 1, 1],
                            [1, 1, 2],
                            [1, 1, 5],
                            [2, 3, 2],
                            [2, 6, 4],
                            [4, 5, 7],
                            [4, 2, 8],
                            [7, 1, 3],
                            [7, 1, 5],
                            [8, 1, 5]
                        ]
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            chart.series[0].points[0].isInside,
            true,
            'Correct position'
        );
    }
);

QUnit.test('zAxis update through chart.update() (#6566)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            options3d: {
                enabled: true
            }
        },
        zAxis: {
            min: 10,
            max: 20
        },
        series: [
            {
                data: [
                    [5, 5, 5],
                    [10, 10, 10],
                    [15, 15, 15],
                    [20, 20, 20],
                    [25, 25, 25]
                ]
            }
        ]
    });

    let updates = 0;

    Highcharts.addEvent(Highcharts.Axis, 'afterInit', () => updates++);

    chart.update({
        zAxis: {
            min: 0,
            max: 30,
            labels: {
                enabled: false
            }
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].isInside &&
            chart.series[0].points[4].isInside,
        true,
        'zAxis updated'
    );

    assert.strictEqual(
        chart.zAxis[0].isZAxis,
        true,
        '#14793: isZAxis should still be true after update'
    );

    assert.strictEqual(
        updates,
        1,
        'zAxis should only have updated once'
    );
});