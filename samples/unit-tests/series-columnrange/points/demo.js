// Highcharts 5.0.13, Issue #6835
// Axis.SetExtremes on inverted columnrange causes some columns to dissapear
QUnit.test('Long columns and bars (#6835)', function (assert) {

    TestTemplate.test('highcharts/columnrange', {
        chart: {
            inverted: true,
            width: 1200
        },
        yAxis: {
            reversed: false,
            min: 99.170523,
            max: 99.170536
        },
        series: [{
            data: [
                [99.1, 99.3],
                [99.0, 99.8]
            ]
        }]
    }, function (template) {

        var chart = template.chart;

        assert.ok(
            chart.series[0].points[1].graphic.getBBox().height > 1000,
            'Second column should have a height.'
        );

        assert.ok(
            chart.series[0].points[1].graphic.getBBox().height < 150000,
            'Height should be acceptable.'
        );

    });

});
