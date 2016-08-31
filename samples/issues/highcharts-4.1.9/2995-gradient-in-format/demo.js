
$(function () {
    QUnit.test("Preserve gradients in format strings", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            series: [{
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgb(255, 0, 255)'],
                        [1, 'rgb(200, 200, 255)']
                    ]
                },
                data: [1, 2, 3]
            }]
        }).highcharts();

        assert.strictEqual(
            Highcharts.format('fill="{series.color}"', { series: chart.series[0] }),
            'fill="url(#highcharts-1)"',
            'Gradient is preserved in string handling'
        );

    });
});