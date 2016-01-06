$(function () {
    QUnit.test('3d pie with zeroes', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            series: [{
                type: 'pie',
                depth: 50,
                borderColor: 'green',
                data: [null,1]
            }]
        },function () {
            this.series[0].addPoint({ y: 2 });
        }).highcharts();

        assert.strictEqual(
            chart.series[0].points.length,
            3,
            'Rendered succesfully'
        );
        assert.strictEqual(
            chart.series[0].points[0].graphic instanceof Highcharts.SVGElement,
            false,
            'Null point does not have graphic'
        );
        assert.strictEqual(
            chart.series[0].points[0].connector instanceof Highcharts.SVGElement,
            false,
            'Null point does not have connector'
        );
        assert.strictEqual(
            chart.series[0].points[0].dataLabel instanceof Highcharts.SVGElement,
            false,
            'Null point does not have data label'
        );
        assert.strictEqual(
            chart.series[0].points[1].graphic instanceof Highcharts.SVGElement,
            true,
            'Not null point has graphic'
        );
        assert.strictEqual(
            chart.series[0].points[1].connector instanceof Highcharts.SVGElement,
            true,
            'Not null point has connector'
        );
        assert.strictEqual(
            chart.series[0].points[1].dataLabel instanceof Highcharts.SVGElement,
            true,
            'Not null point has data label'
        );
    });
});