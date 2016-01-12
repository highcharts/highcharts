
$(function () {
    QUnit.test('Pie borderColor null', function (assert) {
        var chart = $("#container").highcharts({
            chart: {
                type: 'pie'
            },
            series: [{
                data: [1, 2, 3, 4, 5],
                borderColor: null,
                borderWidth: 1
            }]
        }).highcharts();

        Highcharts.each(chart.series[0].points, function (point, i) {
            assert.equal(
                point.graphic.element.getAttribute('stroke'),
                point.graphic.element.getAttribute('fill'),
                'Point ' + i + ' has correct stroke'
            );
        });
    });
});