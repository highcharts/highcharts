
$(function () {
    QUnit.test("Data module with decimapPoint and negative numbers", function (assert) {
        var chart = $("#container").highcharts({
            data: {
                table: 'datatable',
                decimalPoint: ','
            },
            chart: {
                type: 'column'
            }
        }).highcharts();

        assert.equal(
            chart.series[0].points.map(function (point) {
                return point.y;
            }).join(','),
            '-3.4,-1.2,5.1,-1.1,-3.12',
            'Series 1 correct data'
        );
        assert.equal(
            chart.series[1].points.map(function (point) {
                return point.y;
            }).join(','),
            '-4.24,-1.5,11.1,-1.1,-2.9',
            'Series 2 correct data'
        );
    });
});