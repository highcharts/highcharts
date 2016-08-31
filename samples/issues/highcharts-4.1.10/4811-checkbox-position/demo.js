
$(function () {
    QUnit.test('Legend checkbox position with title', function (assert) {
        var chart = $("#container").highcharts({

            chart: {},
            legend: {
                title: {
                    text: 'Click line'
                },
                layout: 'vertical',
                align: 'left'
            },
            plotOptions: {
                series: {
                    showCheckbox: true
                }
            },
            series: [{
                data: [1, 3, 2, 4]
            }]

        }).highcharts();

        console.log()
        assert.ok(
            parseInt(chart.series[0].checkbox.style.top, 10) > chart.legend.group.translateY + chart.legend.titleHeight,
            'Checkbox is below title'
        );
    });
});