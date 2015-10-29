$(function () {
    QUnit.test('Parts of 3d pie should have correct zIndexes.', function (assert) {

        $('#container').highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 0,
                    beta: -60
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    slicedOffset: 42,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                depth: 200,
                data: [{
                    y: 1,
                    sliced: true
                },
                3, 8, 2, 1]
            }]
        });

        var chart = $('#container').highcharts(),
            points = chart.series[0].points;

        assert.strictEqual(
            points[1].graphic.side2.zIndex < points[3].graphic.out.zIndex,
            true,
            'Correct sequence of pie\'s parts - 1/2'
        );

        assert.strictEqual(
            points[0].graphic.side2.zIndex < points[4].graphic.out.zIndex,
            true,
            'Correct sequence of pie\'s parts - 2/2'
        );

    });
});