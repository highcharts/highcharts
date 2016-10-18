$(function () {
    QUnit.test('Reversed solid gauge', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'solidgauge'
            },

            title: {
                text: 'Reversed gauge'
            },

            pane: {
                startAngle: 90,
                endAngle: -90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            yAxis: {
                reversed: true,
                min: 0,
                max: 200
            },

            series: [{
                name: 'Speed',
                data: [50]
            }]

        }).highcharts();


        assert.strictEqual(
            chart.series[0].points[0].shapeArgs.start,
            -Math.PI * 0.75,
            'Start at 50'
        );
        assert.strictEqual(
            chart.series[0].points[0].shapeArgs.end,
            0,
            'End at 0'
        );

    });
});