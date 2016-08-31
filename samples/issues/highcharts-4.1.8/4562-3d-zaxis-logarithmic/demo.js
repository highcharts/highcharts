$(function () {
    QUnit.test("3D logarithmic zAxis miscalculated points' plotting Z.", function (assert) {
        var chart = $('#container').highcharts({
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
            series: [{
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
            }]
        }).highcharts();


        assert.strictEqual(
            chart.series[0].points[0].isInside,
            true,
            'Correct position'
        );

    });

});