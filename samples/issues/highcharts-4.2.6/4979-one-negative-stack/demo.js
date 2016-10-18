$(function () {
    QUnit.test('Negative stack with just one point should be also calculated.', function (assert) {

        var chart = $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    column: {
                        borderWidth: 0,
                        stacking: 'percent'
                    }
                },
                series: [{
                    data: [-10]
                }, {
                    data: [10]
                }]
            }).highcharts(),
            oldHeight = chart.series[0].points[0].graphic.getBBox(true).height;

        chart.series[0].addPoint(-10, false);
        chart.series[1].addPoint(10);

        assert.strictEqual(
            oldHeight,
            chart.series[0].points[0].graphic.getBBox(true).height,
            'Correct height for a negative point'
        );
    });
});
