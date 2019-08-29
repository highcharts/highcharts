QUnit.test('Legend vertical align top with no title', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 300
        },
        title: null,
        legend: {
            verticalAlign: 'top'
        },
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.ok(
        chart.legend.group.translateY < 100,
        'Legend is aligned top'
    );
});

// Highcharts 4.0.4, Issue #3499
// Legend is drawn on the wrong side of the chart when placed in corners
QUnit.test('Legend should be drawn below chart (#3499)', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            visible: false
        },
        legend: {
            layout: 'horizontal',
            align: 'left',
            verticalAlign: 'bottom'
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }]
    });

    var legendXCoordinate = chart.legend.group.alignAttr.translateX + 5,
        xAxisLineXCoordinate = chart.xAxis[0].axisLine.element.getBBox().x;

    assert.ok(
        xAxisLineXCoordinate < legendXCoordinate,
        "The legend is drawn on the wrong side of the chart"
    );
});