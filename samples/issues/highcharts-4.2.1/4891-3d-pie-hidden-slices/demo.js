$(function () {
    QUnit.test('Pie points\' graphic should have visibility=hidden when slices are hidden.', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    }
                },
                plotOptions: {
                    pie: {
                        depth: 25
                    }
                },
                series: [{
                    data: [2, 4]
                }]
            }).highcharts(),
            points = chart.series[0].points;

        $.each(points, function (i, p) {
            p.setVisible(false);
        });

        assert.strictEqual(
            points[0].graphic.top.attr('visibility'),
            'hidden',
            'Hidden first slice.'
        );

        assert.strictEqual(
            points[1].graphic.top.attr('visibility'),
            'hidden',
            'Hidden second slice.'
        );
    });
});