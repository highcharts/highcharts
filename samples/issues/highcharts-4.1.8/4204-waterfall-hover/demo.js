$(function () {
    QUnit.test("Compare hover color for points with negative and positive values.", function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'waterfall'
                },
                series: [{
                    states: {
                        hover: {
                            brightness: -0.6
                        }
                    },
                    data: [{
                        name: 'Start',
                        y: 120000
                    }, {
                        name: 'Product Revenue',
                        y: 569000
                    }, {
                        name: 'Service Revenue',
                        y: 231000
                    }, {
                        name: 'Positive Balance',
                        isIntermediateSum: true
                    }, {
                        name: 'Fixed Costs',
                        y: -342000
                    }, {
                        name: 'Variable Costs',
                        y: -233000
                    }, {
                        name: 'Balance',
                        isSum: true
                    }]
                }]
            }).highcharts(),
            points = chart.series[0].points;

        points[0].setState("hover");
        points[4].setState("hover");

        assert.strictEqual(
            points[0].graphic.attr("fill"),
            points[4].graphic.attr("fill"),
            "The same hover color for positive and negative bars"
        );

    });
});
