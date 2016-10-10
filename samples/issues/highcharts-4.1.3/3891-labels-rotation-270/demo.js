$(function () {
    QUnit.test('Text height', function (assert) {

        var chart = Highcharts.chart('container', {
            xAxis: {
                labels: {
                    rotation: 270
                },
                categories: ['January', 'February', 'March']
            },

            series: [{
                data: [1, 3, 2]
            }]
        });

        assert.equal(
            chart.xAxis[0].ticks[0].label.rotation,
            270,
            'Rotation set to 270'
        );
    });

});
