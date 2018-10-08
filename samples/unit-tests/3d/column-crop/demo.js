
QUnit.test('3D columns crop outside plotArea', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            animation: false,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 0,
                depth: 300,
                viewDistance: 5
            }
        },
        scrollbar: {
            enabled: true
        },
        plotOptions: {
            column: {
                animation: false,
                grouping: false,
                groupZPadding: 10,
                pointPadding: 0.2,
                depth: 40,
                dataLabels: {
                    enabled: true
                }
            }
        },
        xAxis: {
            min: 0,
            max: 5
        },
        yAxis: {
            min: 2,
            max: 5
        },
        series: [{
            showInLegend: true,
            data: [{
                x: 5,
                y: 5
            }, {
                x: 5,
                y: 10
            }, {
                x: 7,
                y: 10
            }]
        }]
    });

    var testColumnCrop = function (chart, string) {
        var shapeArgs0 = chart.series[0].data[0].shapeArgs;
        var shapeArgs1 = chart.series[0].data[1].shapeArgs;
        assert.strictEqual(
            (
                shapeArgs0.x >= -0.5 &&
                shapeArgs1.x >= -0.5 &&
                shapeArgs0.x + shapeArgs0.width <= chart.xAxis[0].len + 0.5 &&
                shapeArgs0.y + shapeArgs0.height <= chart.yAxis[0].len + 0.5 &&
                shapeArgs1.x + shapeArgs1.width <= chart.xAxis[0].len + 0.5 &&
                shapeArgs1.y + shapeArgs1.height <= chart.yAxis[0].len + 0.5
            ),
            true,
            string + ' are cropped outside plotArea'
        );

        chart.yAxis[0].update({
            reversed: true
        });

        shapeArgs0 = chart.series[0].data[0].shapeArgs;
        shapeArgs1 = chart.series[0].data[1].shapeArgs;
        assert.strictEqual(
            (
                shapeArgs0.x === shapeArgs1.x &&
                shapeArgs0.y === shapeArgs1.y &&
                shapeArgs0.height === shapeArgs1.height &&
                shapeArgs0.width === shapeArgs1.width
            ),
            true,
            string + ' are cropped outside plotArea with reversed axis'
        );

        chart.yAxis[0].setExtremes(5, 10);

        shapeArgs0 = chart.series[0].data[0].shapeArgs;
        assert.strictEqual(
            (
                shapeArgs0.x !== 0 ||
                shapeArgs0.y !== 0
            ),
            true,
            '0 ' + string + ' are visible inside plotArea'
        );
    };
    chart.yAxis[0].setExtremes(2, 5);
    testColumnCrop(chart, 'Columns');

    chart.update({
        chart: {
            inverted: true
        },
        yAxis: {
            reversed: false
        }
    });

    chart.yAxis[0].setExtremes(2, 5);

    testColumnCrop(chart, 'Bars');

    // dataLabels testing

    chart.yAxis[0].setExtremes(7, 12);
    chart.update({
        chart: {
            inverted: false
        },
        yAxis: {
            reversed: true
        }
    });
    var point0 = chart.series[0].points[0];

    assert.strictEqual(
        (
            point0.outside3dPlot &&
            point0.dataLabel.alignAttr.y <= -9e9
        ),
        true,
        'DataLabels are hidden outside plotArea with reversed axis'
    );

    chart.addSeries({
        stacking: 'normal',
        data: [{
            x: 5,
            y: 8
        }],
        zIndex: 3
    });

    assert.strictEqual(
        (
            point0.outside3dPlot &&
            point0.dataLabel.alignAttr.y <= -9e9
        ),
        true,
        'DataLabels are hidden outside plotArea with stacking enabled'
    );

    chart.yAxis[0].setExtremes(null, null);
    chart.series[0].remove();

    chart.update({
        yAxis: {
            min: null,
            max: null
        },
        xAxis: {
            min: null,
            max: null
        }
    });

    var oldTitleX = Number(chart.yAxis[0].axisTitle.element.attributes.x.value);
    var oldTitleY = Number(chart.yAxis[0].axisTitle.element.attributes.y.value);

    // toggle series visibility
    chart.series[0].setVisible();
    chart.series[0].setVisible();

    var newTitleX = Number(chart.yAxis[0].axisTitle.element.attributes.x.value);
    var newTitleY = Number(chart.yAxis[0].axisTitle.element.attributes.y.value);

    if (Highcharts.isFirefox) {
        assert.close(
            newTitleX,
            oldTitleX,
            0.5,
            'yAxis title is on the same position after toggling series visibility'
        );
        assert.close(
            newTitleY,
            oldTitleY,
            0.5,
            'yAxis title is on the same position after toggling series visibility'
        );
    } else {
        assert.strictEqual(
        (
            oldTitleX === newTitleX &&
            oldTitleY === newTitleY
        ),
        true,
        'yAxis title is on the same position after toggling series visibility'
        );
    }

    chart.update({
        chart: {
            options3d: {
                alpha: 5,
                beta: 10
            }
        },
        yAxis: {
            reversed: false
        },
        xAxis: {
            type: 'category',
            categories: [
                'One Two Three Four Five Six',
                'One Two Three Four Five Six',
                'One Two Three Four Five Six',
                'One Two Three Four Five Six'
            ]
        },
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    var labelWidth = chart.xAxis[0].ticks[0].label.getBBox().width;
    var yAxisFirstLine = chart.yAxis[0].gridGroup.element.childNodes[0].getBBox();
    var xAxisFirstLine = chart.xAxis[0].gridGroup.element.childNodes[0].getBBox();

    assert.ok(
        labelWidth < xAxisFirstLine.x - yAxisFirstLine.x + 1,
        'xAxis label width should be smaller than available slot width'
    );

    // Testing scrollbar moving when the chart has two linked x axes.
    var controller = new TestController(chart);

    chart.addAxis({
        type: 'category',
        categories: ["0.0", "0.3", "0.0", "0.1", "0.3"],
        opposite: true,
        linkedTo: 0
    }, true);

    chart.update({
        xAxis: {
            minRange: 1
        }
    });
    chart.xAxis[0].setExtremes(0, 2);

    // Scrollbar dimensions
    var sbDim = {
        x: chart.scrollbar.x,
        y: chart.scrollbar.y,
        w: chart.scrollbar.width,
        h: chart.scrollbar.height
    };

    var clickX = sbDim.x + sbDim.w / 2;
    var clickY = sbDim.y + sbDim.h / 2;

    controller.pan([clickX, clickY], [clickX + 40, clickY]);

    var done = assert.async();
    setTimeout(function () {
        assert.ok(true, 'Console should be clear.');
        done();
    });
});
