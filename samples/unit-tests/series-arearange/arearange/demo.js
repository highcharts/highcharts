QUnit.test('Range series data labels(#4421)', function (assert) {
    var data = [],
        i;
    for (i = 0; i < 100; i++) {
        data.push([i, i + 100]);
    }

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'arearange'
        },
        rangeSelector: {
            selected: 0
        },
        series: [
            {
                data: data,
                dataLabels: {
                    enabled: true
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].dataLabelUpper.attr('opacity'),
        1,
        'First label visible'
    );
    assert.strictEqual(
        chart.series[0].points[1].dataLabelUpper.attr('opacity'),
        0,
        'Second label hidden'
    );

    const series = chart.series[0];

    series.update({
        dataLabels: {
            enabled: false
        },
        label: {
            enabled: true,
            onArea: true
        },
        data: [
            [1, 2],
            [1, 2],
            [1, 2]
        ]
    });

    const isLabelInsideArea = label => {
        const {
            x: areaX, y: areaY,
            width: areaWidth, height: areaHeight
        } = series.area.element.getBBox();

        const { width: labelWidth, height: labelHeight } = label.getBBox();

        return label.y > chart.plotTop + areaY &&
            label.y + labelHeight < chart.plotTop + areaY + areaHeight &&
            label.x > chart.plotLeft + areaX &&
            label.x + labelWidth < chart.plotLeft + areaX + areaWidth;
    };

    assert.ok(
        isLabelInsideArea(series.labelBySeries),
        'Series label is inside the area when onArea: true (#14602)'
    );

    series.update({
        label: {
            onArea: false
        }
    });

    assert.ok(
        !isLabelInsideArea(series.labelBySeries),
        'Series label is not inside the area when onArea: false (#14602)'
    );

    series.update({
        data: [
            [1, 1, 1],
            [1.5, 1.40, 1.60],
            [2, 2, 2],
            [2.5, 2.40, 2.60],
            [3, 3, 3]
        ],
        label: {
            onArea: true
        }
    });

    assert.ok(
        !series.labelBySeries,
        'Series label is destroyed when onArea: true and there is no place to render it (#14602)'
    );
});

QUnit.test(
    'Area range with compare (#4922) and NaN (#11513)',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            chart: {
                type: 'arearange'
            },

            plotOptions: {
                series: {
                    compare: 'percent'
                }
            },

            series: [
                {
                    data: [
                        [0, NaN, NaN], // #11513
                        [0, 3, 4],
                        [1, 4, 6],
                        [2, 2, 3]
                    ]
                }
            ]
        });

        assert.strictEqual(
            typeof chart.yAxis[0].min,
            'number',
            'The Y axis extremes should be valid (#11513)'
        );

        assert.ok(
            typeof chart.series[0].graph.element.getAttribute('d'),
            'string',
            'We have a graph'
        );
        assert.ok(
            typeof chart.series[0].area.element.getAttribute('d'),
            'string',
            'We have an area'
        );
    }
);