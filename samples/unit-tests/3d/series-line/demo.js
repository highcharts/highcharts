
QUnit.test('3D line series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'line',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40
            }
        },

        title: {
            text: '3D line'
        },

        yAxis: {
            min: 0,
            max: 10
        },


        series: [{
            data: [
                [0, 5],
                [1, 3],
                [2, 4]
            ]
        }, {
            data: [
                [0, 6],
                [1, 4],
                [2, 5]
            ]
        }]
    });

    var path = chart.series[0].graph.attr('d');

    chart.series[0].hide();
    chart.series[0].show();

    assert.strictEqual(
        chart.series[0].graph.attr('d'),
        path,
        'Graph should not change after toggle (#7477)'
    );

});
