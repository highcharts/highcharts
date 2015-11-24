$(function () {
    QUnit.test("Polar and categorized chart should not render extra alternate band." , function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    polar: true
                },
                xAxis: {
                    // This alternateGridColor is wrong:
                    alternateGridColor:'#FFC0C0',
                    categories: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
                    // The X axis line is a circle instead of a polygon
                    lineWidth:0
                },
                yAxis: {
                    //This is correct:
                    alternateGridColor:'#C0FFC0',
                    gridLineInterpolation: 'polygon',
                    title: {
                        text: 'Y-axis'
                    }
                },
                series: [{
                    name: 'Serie 1',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2]
                }, {
                    name: 'Serie 2',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0]
                }, {
                    name: 'Serie 3',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5]
                }]
            }).highcharts(),
            UNDEFINED;

        assert.strictEqual(
            chart.xAxis[0].alternateBands[4],
            UNDEFINED,
            "Zero extra bands.");
    });

});
