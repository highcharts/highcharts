
$(function () {
    QUnit.test("Use HTML in color axis data labels caused misposition.", function (assert) {
        var chart = $('#container').highcharts({

            chart: {
                type: 'heatmap'
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: '#663366',
                labels: {
                    useHTML: true
                }
            },
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: [
                    [0, 0, 10],
                    [0, 1, 19],
                    [1, 0, 8],
                    [1, 1, 24]
                ]
            }]

        }).highcharts();

        var top = $(chart.colorAxis[0].ticks[0].label.element).offset().top;
        assert.strictEqual(
            typeof top,
            'number',
            "Test is working."
        );
        assert.strictEqual(
            top > 200,
            true,
            "Label is below 200 px."
        );
    });
});