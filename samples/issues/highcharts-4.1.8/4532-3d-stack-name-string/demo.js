$(function () {
    QUnit.test("JS error when stack ID's are strings in Highcharts 3D.", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 6,
                    beta: 15,
                    viewDistance: 0,
                    depth: 40
                }
            },
            series: [{
                data: [5, 10],
                stack: "m1"
            }, {
                data: [2, 4],
                stack: "m1"
            }]
        }).highcharts();


        assert.strictEqual(
            chart.series[0].points && chart.series[0].points.length === 2,
            true,
            'No error.'
        );

    });

});