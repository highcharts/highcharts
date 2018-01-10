QUnit.test('#6487: Column\'s data label with contrast after justification.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 400
            },
            series: [{
                data: [15, 14.5, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4],
                type: 'column',
                colorByPoint: true,
                dataLabels: {
                    enabled: true,
                    inside: false,
                    style: {
                        textOutline: null
                    }
                }
            }],
            yAxis: {
                endOnTick: false,
                max: 15.3
            }
        }),
        point = chart.series[0].points[1];

    assert.strictEqual(
        Highcharts.Color(
            point.dataLabel.element.childNodes[0].style.color
        ).get(),
        Highcharts.Color(
            chart.renderer.getContrast(point.color)
        ).get(),
        'Correct color for justified label on a column.'
    );
});
