QUnit.test('Pie borderColor null(#1828)', function (assert) {
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

QUnit.test('Styled mode for pie type series', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                styledMode: true
            },
            series: [{
                type: 'pie',
                allowPointSelect: true,
                data: [1, 3, 2, 4]
            }]
        }),
        startingColor = chart.series[0].points[2].graphic.getStyle('fill');

    chart.series[0].points[2].update({
        selected: true,
        sliced: true
    });

    assert.strictEqual(
        chart.series[0].points[2].graphic.getStyle('fill'),
        startingColor,
        'Selected slice has the same color as before the selection (#6005)'
    );
});