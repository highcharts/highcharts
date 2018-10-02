QUnit.test('tooltip.destroy #5855', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]
            }],
            tooltip: {
                split: true
            }
        }),
        series1 = chart.series[0],
        series2 = chart.series[1],
        p1 = series1.points[0],
        p2 = series2.points[0],
        tooltip = chart.tooltip;
    tooltip.refresh([p1, p2]);
    assert.strictEqual(
        typeof series1.tt,
        'object',
        'series[0].tt is exists'
    );
    assert.strictEqual(
        typeof series2.tt,
        'object',
        'series[1].tt is exists'
    );
    assert.strictEqual(
        typeof tooltip.tt,
        'object',
        'tooltip.tt is exists'
    );


    tooltip.destroy();

    assert.strictEqual(
        series1.tt,
        undefined,
        'series[0].tt is destroyed'
    );
    assert.strictEqual(
        series2.tt,
        undefined,
        'series[1].tt is destroyed'
    );
    assert.strictEqual(
        tooltip.tt,
        undefined,
        'tooltip.tt is destroyed'
    );
});

QUnit.test('Split tooltip and tooltip.style. #5838', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3]
            }, {
                data: [3, 2, 1]

            }],
            tooltip: {
                split: true
            }
        }),
        series1 = chart.series[0],
        series2 = chart.series[1],
        p1 = series1.points[0],
        p2 = series2.points[0],
        el,
        value;

    chart.tooltip.refresh([p1, p2]);
    el = chart.tooltip.tt.text.element;

    value = window.getComputedStyle(el).getPropertyValue('color');
    assert.strictEqual(
        value,
        'rgb(51, 51, 51)',
        'tooltip default color.'
    );

    el = chart.tooltip.tt.element;
    value = window.getComputedStyle(el);


    assert.notEqual(
        document.getElementsByClassName('highcharts-label-box')[4]
            .getAttribute('class')
            .indexOf('highcharts-shadow'),
        -1,
        'Shadow should be applied'
    );

    chart.update({
        tooltip: {
            style: {
                color: '#FF0000'
            }
        }
    });

    chart.tooltip.refresh([
        chart.series[0].points[0],
        chart.series[1].points[0]
    ]);

    el = chart.tooltip.tt.text.element;
    value = window.getComputedStyle(el).getPropertyValue('color');
    assert.strictEqual(
        value,
        'rgb(255, 0, 0)',
        'tooltip color from style.'
    );
});

QUnit.test('Split tooltip returning false. #6115', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        series: [{
            data: [1, 2, 3]
        }, {
            data: [3, 2, 1]

        }],
        tooltip: {
            split: true,
            formatter: function () {
                var tooltips = this.points.map(function (point) {
                    return point.y;
                });
                tooltips.unshift(false);
                return tooltips;
            }
        }
    });

    chart.tooltip.refresh([
        chart.series[0].points[0],
        chart.series[1].points[0]
    ]);

    assert.strictEqual(
        chart.tooltip.label.element.childNodes.length,
        2,
        'Two tooltips'
    );
});

QUnit.test('Split tooltip with useHTML (#7238)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        series: [{
            data: [1, 2, 3]
        }],
        tooltip: {
            split: true,
            useHTML: true
        }
    });

    chart.series[0].points[0].onMouseOver();

    assert.strictEqual(
        chart.series[0].tt.text.element.tagName,
        'SPAN',
        'The label is a span'
    );
});

QUnit.test(
    'Split tooltip on flags, having noSharedTooltip flag',
    function (assert) {
        var chart = Highcharts.chart('container', {

            tooltip: {
                split: true
            },

            series: [{
                data: [1, 3, 2, 4],
                id: 'dataseries'
            }, {
                type: 'flags',
                data: [{
                    x: 2,
                    title: 'A',
                    text: 'Flag tooltip'
                }],
                onSeries: 'dataseries'
            }]
        });


        chart.series[1].points[0].onMouseOver();

        assert.strictEqual(
            chart.series[1].tt.text.element.tagName,
            'text',
            'We have a flag tooltip'
        );
    }
);
