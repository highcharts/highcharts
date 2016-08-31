$(function () {
    QUnit.test('Pie slices should update colors after setData() or point.update().', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'pie'
            },
            series: [{
                data: [{
                    y: 55,
                    name: 'Item 1',
                    color: 'red'
                }]
            }]
        }).highcharts();

        chart.series[0].setData([{
            y: 12,
            name: 'Item 1',
            color: "blue"
        }]);

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr("fill"),
            "blue",
            'Proper color for a slice.'
        );
    });
});