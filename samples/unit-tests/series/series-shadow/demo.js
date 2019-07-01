QUnit.test('Series shadow', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    shadow: {
                        inside: false,
                        width: 5
                    }
                }
            },
            series: [{
                data: [107, 31, 63]
            }]
        }),
        point = chart.series[0].points[0],
        shadows;

    assert.equal(
        point.graphic.shadows.length,
        chart.userOptions.plotOptions.series.shadow.width,
        'There should be as many shadows as shadow.width'
    );

    assert.deepEqual(
        [
            +point.graphic.shadows[0].getAttribute('stroke-width'),
            +point.graphic.shadows[1].getAttribute('stroke-width'),
            +point.graphic.shadows[2].getAttribute('stroke-width'),
            +point.graphic.shadows[3].getAttribute('stroke-width'),
            +point.graphic.shadows[4].getAttribute('stroke-width')
        ],
        [9, 7, 5, 3, 1],
        'Shadows should have appropriate stroke widths'
    );

    chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            inverted: true
        },
        plotOptions: {
            series: {
                shadow: {
                    inside: false,
                    width: 7,
                    offsetX: 2,
                    offsetY: -3
                }
            }
        },
        series: [{
            data: [107, 31, 63]
        }]
    });

    point = chart.series[0].points[2];

    assert.equal(
        point.graphic.shadows[0].getAttribute('transform'),
        'translate(' + (chart.userOptions.plotOptions.series.shadow.offsetY * -1) +
        ', ' + (chart.userOptions.plotOptions.series.shadow.offsetX * -1) + ')',
        'Shadows should be translated correctly'
    );

    chart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        plotOptions: {
            series: {
                shadow: {
                    inside: true,
                    width: 4,
                    opacity: 0.2
                }
            }
        },
        series: [{
            data: [107, 31, 63]
        }]
    });

    point = chart.series[0].points[2];
    shadows = point.graphic.shadows;

    assert.equal(
        shadows.length,
        chart.userOptions.plotOptions.series.shadow.width,
        'There should be as many inside shadows as shadow.width'
    );

    assert.deepEqual(
        [
            +shadows[0].getAttribute('stroke-width'),
            +shadows[1].getAttribute('stroke-width'),
            +shadows[2].getAttribute('stroke-width'),
            +shadows[3].getAttribute('stroke-width')
        ],
        [4, 3, 2, 1],
        'Shadows inside should have appropriate stroke widths'
    );

    assert.deepEqual(
        [
            shadows[3].getAttribute('transform'),
            +shadows[3].getAttribute('stroke-opacity'),
            shadows[3].getAttribute('width')
        ],
        [
            'translate(0.5,0.5)',
            chart.userOptions.plotOptions.series.shadow.opacity,
            (+point.graphic.element.getAttribute('width') - 1) + 'px'
        ],
        'Shadows should have appropriate attribute values'
    );
});
