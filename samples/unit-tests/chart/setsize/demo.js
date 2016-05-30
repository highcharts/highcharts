/* eslint func-style:0 */
$(function () {

    QUnit.test('3D pies stay in place on redraw (#5350)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                width: 600,
                height: 400,
                borderWidth: 1
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [1, 4, 2, 5]
            }]
        });


        var x = chart.series[0].points[0].graphic.getBBox().x;

        assert.strictEqual(
            typeof x,
            'number',
            'Pie has an X position'
        );

        chart.setSize(400, 400, false);

        assert.ok(
            chart.series[0].points[0].graphic.getBBox().x < x,
            'Pie has moved'
        );


    });

});