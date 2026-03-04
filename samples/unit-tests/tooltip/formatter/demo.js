QUnit.test('Formatter general', function (assert) {
    const chart = Highcharts.chart('container', {
            tooltip: {
                formatter: function () {
                    return undefined;
                }
            },
            series: [
                {
                    data: [1, 2, 3]
                }
            ]
        }),
        point = chart.series[0].points[0];

    chart.tooltip.refresh(point);

    // Test whether tooltip.refresh raises an exception.
    assert.ok(
        true,
        'Tooltip.refresh passes when formatter returns undefined. #5922'
    );

    chart.update({
        tooltip: {
            formatter: (tooltip, point) => (
                tooltip && point ? '###' : ''
            )
        }
    });

    chart.tooltip.refresh(point);

    assert.strictEqual(
        chart.container.querySelector('.highcharts-tooltip').textContent,
        '###',
        'ES6 formatter works for tooltip.'
    );
});

QUnit.test('Return false from tooltip.formatter (#5915)', function (assert) {
    var chart = Highcharts.chart('container', {
            tooltip: {
                formatter: function () {
                    return this.y > 2 ? 'Display' : false;
                }
            },
            series: [
                {
                    data: [1, 3]
                }
            ]
        }),
        p1 = chart.series[0].points[0],
        p2 = chart.series[0].points[1],
        tooltip = chart.tooltip;

    tooltip.refresh(p1);
    assert.strictEqual(
        chart.container.querySelector('.highcharts-tooltip'),
        null,
        'No tooltip yet'
    );

    tooltip.refresh(p2);
    assert.strictEqual(
        chart.container.querySelector('.highcharts-tooltip').nodeName,
        'g',
        'Tooltip added'
    );
});
