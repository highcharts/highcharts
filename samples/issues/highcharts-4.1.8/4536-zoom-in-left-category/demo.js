
$(function () {
    QUnit.test("Zooming too tight on left category should show full category.", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                minRange: 0.99
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }, {
                data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2]
            }, {
                data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.xAxis[0].min,
            0,
            "Starting min"
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            11,
            "Starting max"
        );


        chart.xAxis[0].setExtremes(0, 0.5);
        assert.strictEqual(
            chart.xAxis[0].min,
            0,
            "Ending min"
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            0.99,
            "Ending max"
        );
        assert.strictEqual(
            typeof chart.xAxis[0].minPixelPadding,
            'number',
            "Category padding is a number"
        );
        assert.strictEqual(
            chart.xAxis[0].minPixelPadding > 0,
            true,
            "Category padding is more than 0"
        );
    });
});