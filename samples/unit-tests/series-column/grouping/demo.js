
// Highcharts 4.1.10, Issue #4799:
// Column series on multiple axes with and without grouping render wrong
QUnit.test('Non-grouped column is centered (#4799)', function (assert) {
    var chart = $("#container").highcharts({
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        series: [{
            data: [2, 3, 4]
        }, {
            data: [2, 3, 4]
        }, {
            data: [1, 2, 3],
            grouping: false
        }]
    }).highcharts();

    var bBox = chart.series[2].points[0].graphic.getBBox();
    assert.ok(
        Math.abs(
            (bBox.x + bBox.width / 2) -
            chart.xAxis[0].toPixels(0, true)
        ) < 1,
        'Last series\' column is centered'
    );
});
