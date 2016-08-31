$(function () {
    QUnit.test("Bubble with null", function (assert) {
        var chart = $('#container').highcharts({

            chart: {
                type: 'bubble'
            },

            title: {
                text: 'Highcharts with nulls'
            },

            series: [{
                data: [
                    [0, 0, -1],
                    [0, 1, null],
                    [0, 2, 0],
                    [0, 3, 1]
                ]
            }]

        }).highcharts();


        assert.strictEqual(
            chart.series[0].group.element.childNodes.length,
            3,
            'No element created for null point'
        );

        // Also when sizeByAbsoluteValue is true
        chart.series[0].update({ sizeByAbsoluteValue: true });

        assert.strictEqual(
            chart.series[0].group.element.childNodes.length,
            3,
            'No element created for null point'
        );

    });

});