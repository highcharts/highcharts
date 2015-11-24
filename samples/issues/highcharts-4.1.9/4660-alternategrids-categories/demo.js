$(function () {
    QUnit.test("Non-polar and categorized chart should render last alternate plotBand." , function (assert) {
        var chart = $('#container').highcharts({
                xAxis: {
                    alternateGridColor: '#FDFFD5',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]
            }).highcharts(),
            UNDEFINED;

        assert.strictEqual(
            chart.xAxis[0].alternateBands[10] !== UNDEFINED,
            true,
            "No missing plotBands.");
    });

});
