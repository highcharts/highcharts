$(function () {
    QUnit.test("Negative color should be updated with point's value" , function (assert) {

        var color = '#00ff00',
            negativeColor = '#ff0000',
            chart = $('#container').highcharts({
                series: [{
                    type: 'column',
                    data: [5, 10, -5, -10],
                    color: color,
                    negativeColor: negativeColor
                }]
            }).highcharts(),
            points = chart.series[0].points;

        chart.series[0].setData([5, -10, -5, 10]);


        assert.strictEqual(
            points[0].graphic.attr("fill"),
            color,
            "Positive color"
        );
        assert.strictEqual(
            points[1].graphic.attr("fill"),
            negativeColor,
            "Negative color"
        );
        assert.strictEqual(
            points[2].graphic.attr("fill"),
            negativeColor,
            "Negative color"
        );
        assert.strictEqual(
            points[3].graphic.attr("fill"),
            color,
            "Positive color"
        );

    });
});