
$(function () {
    QUnit.test('StaggerLines on opposite xAxis should be placed between title and axis line.', function (assert) {
        var chart = $('#container').highcharts({
                xAxis: {
                    categories: [],
                    opposite: true,
                    labels: {
                        staggerLines: 3
                    }
                },
                series: [{
                    data: [1, 2, 3, 1, 2, 3]
                }]
            }).highcharts(),
            labelsBox = chart.xAxis[0].labelGroup.getBBox(),
            titleBox = chart.title.getBBox();


        assert.strictEqual(
            labelsBox.y > titleBox.y + titleBox.height,
            true,
            'All labels below the title.'
        );

        assert.strictEqual(
            labelsBox.y + labelsBox.height < chart.plotTop,
            true,
            'All labels above the axis line.'
        );
    });
});