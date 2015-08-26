$(function () {
    QUnit.test("Apply minPointLength for a waterfall series" , function (assert) { 
        var len = 10,
            chart = $('#container').highcharts({
                chart: {
                    type: 'waterfall',
                    animation: false
                },
                plotOptions:{
                    series:{
                        minPointLength: len
                    }
                },
                series: [{
                    animation: false,
                    data: [{
                        name: 'Start',
                        y: 1200
                    }, {
                        name: 'Product Revenue',
                        y: 769000
                    }, {
                        name: 'Service Revenue',
                        y: 1200
                    }, {
                        name: 'Positive Balance',
                        isIntermediateSum: true,
                    }, {
                        name: 'Fixed Costs',
                        y: -342000
                    }, {
                        name: 'Variable Costs',
                        y: -233000
                    }, {
                        name: 'Balance',
                        isSum: true,
                    }]
                }]
            }).highcharts(),
            points = chart.series[0].points,
            yAxis = chart.yAxis[0];

        assert.strictEqual(
            10,
            parseInt(points[0].graphic.attr("height"), 10),
            "First point has proper height"
        );

        assert.strictEqual(
            10,
            parseInt(points[2].graphic.attr("height"), 10),
            "Third point has proper height"
        );

        assert.strictEqual(
            Math.round(yAxis.toPixels(0) - yAxis.toPixels(points[3].y) + 2 * len), // two minPointLength points
            parseInt(points[3].graphic.attr("height"), 10),
            "isIntermediateSum point has proper height"
        );

        assert.strictEqual(
            Math.round(yAxis.toPixels(0) - yAxis.toPixels(points[6].y) + 2 * len), // two minPointLength points
            parseInt(points[6].graphic.attr("height"), 10),
            "isSum point has proper height"
        );
    });
    
});
