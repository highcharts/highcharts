$(function () {
    QUnit.test("Series should inherit visibility from parent when is linked." , function (assert) {

        var chart = $('#container').highcharts({
            series: [{
                data: [1, 2, 3],
                id: 'a',
                visible: false
            }, {
                data: [0, 1, 0],
                type: 'column',
                linkedTo: 'a'
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].visible,
            chart.series[1].visible,
            'Linked series is hidden'
        );
    });
});