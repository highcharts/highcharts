/* global TestController */
QUnit.test('Check tooltip for flags with useHTML: true (#6303).', function (assert) {
    assert.expect(4); // 2 per flag
    var done = assert.async(4),
        chart = Highcharts.chart('container', {
            chart: {
                width: 500,
                height: 300
            },
            series: [{
                data: [1, 2, 3],
                id: 's1'
            }, {
                useHTML: true,
                type: 'flags',
                onSeries: 's1',
                data: [{
                    x: 1,
                    title: 'XXXXXXXXXXXXXXXX'
                }],
                width: 20,
                height: 120
            }, {
                useHTML: true,
                type: 'flags',
                data: [{
                    x: 1,
                    title: 'XXXXXXXXXXXXXXXX'
                }],
                width: 20,
                height: 120
            }],
            tooltip: {
                formatter: function () {
                    assert.ok(true, "Tooltip displayed for flag");
                    done();
                    return 'OK';
                }
            }
        }),
        controller = TestController(chart),
        plotLeft = chart.plotLeft,
        plotTop = chart.plotTop,
        flag1 = chart.series[1].points[0],
        flag2 = chart.series[2].points[0],
        flagOnSeries = {
            svg: {
                x: plotLeft + flag1.plotX + 5,
                y: plotTop + flag1.plotY
            },
            html: {
                x: plotLeft + flag1.graphic.div.offsetLeft - 20,
                y: plotTop + flag1.graphic.div.offsetTop +
                    flag1.graphic.div.firstChild.clientHeight / 2
            }
        },
        flagOnAxis = {
            svg: {
                x: plotLeft + flag2.plotX + 5,
                y: plotTop + flag2.plotY
            },
            html: {
                x: plotLeft + flag2.graphic.div.offsetLeft - 20,
                y: plotTop + flag2.graphic.div.offsetTop +
                    flag2.graphic.div.firstChild.clientHeight / 2
            }
        };

    controller.trigger('mouseover', flagOnSeries.svg.x, flagOnSeries.svg.y); // flag (on series) - SVG
    controller.trigger('mouseover', flagOnAxis.svg.x, flagOnAxis.svg.y); // flag (on axis) - SVG
    controller.trigger('mouseover', flagOnSeries.html.x, flagOnSeries.html.y); // flag (on series) - HTML
    controller.trigger('mouseover', flagOnAxis.html.x, flagOnAxis.html.y); // flag (on axis) - HTML
});