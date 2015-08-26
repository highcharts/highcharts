$(function () {
    QUnit.test("Removing series didn't update :previous reference.", function (assert) {
        var UNDEFINED,
            chart = $('#container').highcharts({
                series: [{
                    data: [3, 4]
                }, {
                    data: [2, 3]
                }, {
                    linkedTo: ':previous',
                    data: [2, 1]
                }]
            }).highcharts();

        chart.series[1].remove();

        assert.strictEqual(
            chart.series[1].index,
            1,
            'Proper index'
        );
        
    });

});