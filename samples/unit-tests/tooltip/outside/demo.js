QUnit.test('Outside tooltip and styledMode (#11783)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            styledMode: true,
            width: 200,
            height: 200
        },

        tooltip: {
            outside: true
        },

        series: [
            {
                data: [1, 3, 2, 4]
            }
        ]
    });

    var point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.renderer.box.querySelector('.highcharts-tooltip-box')
            .nodeName,
        'path',
        'A label box should be generated'
    );
});

QUnit.test('Outside tooltip styling', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 400,
            style: {
                fontFamily: 'Papyrus',
                zIndex: 1334
            }
        },
        tooltip: {
            outside: true
        },
        series: [
            {
                data: [1, 3, 2, 4]
            }
        ]
    });

    var point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.renderer.box.querySelector('.highcharts-tooltip')
            .parentNode.style.fontFamily,
        'Papyrus',
        'Tooltip container should inherit chart style'
    );

    assert.strictEqual(
        chart.tooltip.container.style.zIndex,
        '1337',
        '#11494: Tooltip container zIndex should be based on chart.style.zIndex'
    );

    chart.tooltip.update({
        style: {
            zIndex: 1881
        }
    });
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.container.style.zIndex,
        '1881',
        '#11494: Setting tooltip.style.zIndex should also work'
    );
});

QUnit.test('Tooltip with default positioner and set outside true on correct position (#16944)', assert => {
    const chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                height: 400
            },
            tooltip: {
                padding: 0,
                borderWidth: 0
            },
            series: [{
                data: [5, 3, 4, 7, 2]
            }]
        }),
        point = chart.series[0].points[1],
        tooltip = chart.tooltip;

    tooltip.refresh(point);

    assert.strictEqual(
        Math.round(chart.plotLeft + point.plotX - tooltip.label.width / 2),
        Math.round(tooltip.now.anchorX - tooltip.label.width / 2),
        'Tooltip position should appear at point with default positioner'
    );

    chart.update({
        tooltip: {
            outside: true
        }
    });

    tooltip.refresh(point);

    const tooltipAbsolute = tooltip.now.x + tooltip.now.anchorX,
        pointerLeft = chart.pointer.getChartPosition().left,
        pointX = point.plotX + chart.plotLeft + pointerLeft;

    assert.strictEqual(
        Math.round(tooltipAbsolute),
        Math.round(pointX),
        'Tooltip position should appear at point with outside true'
    );

    chart.update({
        chart: {
            margin: 50
        }
    });

    chart.container.style.margin = '200px';

    tooltip.refresh(point);

    assert.strictEqual(
        Math.round(tooltipAbsolute),
        Math.round(pointX),
        'Tooltip position should appear at point with sets margin for chart and container'
    );
});

QUnit.test('Tooltip when markers are outside, #17929.', function (assert) {
    const chart =  Highcharts.chart('container', {
            chart: {
                marginTop: 80,
                width: 300
            },
            title: {
                text: ''
            },
            yAxis: {
                tickInterval: 1,
                min: 0,
                max: 8
            },
            series: [{
                type: 'scatter',
                marker: {
                    enabled: true,
                    radius: 40
                },
                data: [8, 8, 8]
            }]
        }),
        point = chart.series[0].points[0],
        controller = new TestController(chart);

    controller.moveTo(chart.plotLeft + point.plotX, point.plotY + 50);
    assert.notOk(
        chart.tooltip.isHidden,
        `When hovering over a marker that is partially outside the plot area,
        the tooltip still should be shown, #17929.`
    );
});
