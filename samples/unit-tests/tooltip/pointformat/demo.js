QUnit.test('Repetetive formats and pointer-events', function (assert) {
    Highcharts.setOptions({
        lang: {
            decimalPoint: ','
        }
    });

    const chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                width: 200,
                height: 200
            },
            series: [{
                data: [1.11, 1.2]
            }]
        }),
        points = chart.series[0].points,
        controller = new TestController(chart);

    chart.update({
        tooltip: {
            headerFormat: '',
            pointFormat: '{point.y} - {point.y}',
            valuePrefix: 'NOK '
        }
    });

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'NOK 1,11 - NOK 1,11',
        `Formatting should be preserved when repeated (#8101) and tooltip should
        be updated (#18876).`
    );

    // Reset
    Highcharts.setOptions({
        lang: {
            decimalPoint: '.'
        }
    });

    chart.update({
        tooltip: {
            hideDelay: 0,
            outside: true,
            style: {
                pointerEvents: 'auto'
            },
            useHTML: true,
            headerFormat: '',
            pointFormat: '<div style="width: 200px; height: 300px; background-color: blue;">Hello</div>'
        }
    });

    controller.moveTo(
        chart.plotLeft + points[1].plotX,
        chart.plotTop + points[1].plotY + 10
    );

    controller.moveTo(
        chart.plotLeft + points[1].plotX,
        chart.plotTop + chart.plotHeight + 10
    );

    controller.moveTo(
        chart.plotLeft + points[0].plotX,
        chart.plotTop + points[0].plotY + 10
    );

    assert.notEqual(
        chart.tooltip.label.visibility,
        'hidden',
        'Tooltip should show after hovering over a point even with pointer-events set (#19025)'
    );
});
