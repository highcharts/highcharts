$(function () {
    QUnit.test('Updating series.visible in series.update() should also update visibility.', function (assert) {
        var chart = $("#container").highcharts({
            series: [{
                data: [29.9, 71.5, 106.4]
            }, {
                data: [144.0, 176.0, 135.6],
                visible: false
            }]

        }).highcharts();

        chart.series[1].update({
            visible: true
        });

        assert.ok(
            chart.series[1].group.attr("visibility") !== "hidden",
            'Series is visible'
        );
    });
});