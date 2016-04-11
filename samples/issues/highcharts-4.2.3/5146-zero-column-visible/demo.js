jQuery(function () {

    QUnit.test('Zero column visible', function (assert) {

        var chart = Highcharts.chart('container', {
            series: [{
                type: 'column',
                borderWidth: 0,
                data: [0, -1, -2, -3, -4]
            }]
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('height'),
            0,
            'No height'
        );
    });
});