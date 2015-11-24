$(function () {
    QUnit.test('innerSize cannot be greater than size.', function (assert) {

        $('#container').highcharts({
            chart: {
                width: 200,
                type: 'pie'
            },
            plotOptions: {
                pie: {
                    innerSize: 200
                }
            },
            series: [{
                data: [1,2,3,4,5,6]
            }]
        });

        var chart = $('#container').highcharts(),
            center = chart.series[0].center;

        assert.strictEqual(
            center[3] > center[2],
            false,
            'Ok - innerSize is not greater than size'
        );

    });
});