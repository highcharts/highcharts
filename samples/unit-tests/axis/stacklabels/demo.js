QUnit.test('Stack labels on non-data axis', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 100,
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [-10, -10, -15]
        }]
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('y'),
        '0',
        'Y attribute is set (#8834)'
    );
    assert.strictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('visibility'),
        'hidden',
        'Stack label is hidden (#8834)'
    );
});

QUnit.test('Stack labels crop and overflow features #8912', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 300,
            height: 260
        },

        yAxis: {
            stackLabels: {
                enabled: true,
                allowOverlap: true
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            data: [29.9123464, 71.5123464, 106.4123464, 129.2123464]
        }, {
            data: [144.0123464, 176.0123464, 135.6123464, 148.5123464]
        }]
    });

    var stacks = chart.yAxis[0].stacks,
        firstStackLabelBBox = stacks.column[0].label.element.getBBox(),
        lastStackLabelBBox = stacks.column[3].label.element.getBBox();

    assert.strictEqual(
        firstStackLabelBBox.x >= 0,
        true,
        'Stack label should be inside plot area'
    );
    assert.strictEqual(
        lastStackLabelBBox.x + lastStackLabelBBox.width <= chart.plotWidth,
        true,
        'Stack label should be inside plot area'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'allow'
            }
        }
    });
    stacks = chart.yAxis[0].stacks;
    var firstStackLabel = stacks.column[0].label,
        lastStackLabel = stacks.column[3].label;

    assert.strictEqual(
        firstStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    assert.strictEqual(
        lastStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden',
                crop: false
            }
        }
    });

    stacks = chart.yAxis[0].stacks;
    firstStackLabelBBox = stacks.column[0].label.element.getBBox();
    lastStackLabelBBox = stacks.column[3].label.element.getBBox();

    assert.strictEqual(
        firstStackLabelBBox.x >= 0,
        false,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabelBBox.x + lastStackLabelBBox.width <= chart.plotWidth,
        false,
        'Stack label should be outside plot area'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    stacks = chart.yAxis[0].stacks;
    firstStackLabelBBox = stacks.column[0].label.element.getBBox();
    lastStackLabelBBox = stacks.column[3].label.element.getBBox();

    assert.strictEqual(
        firstStackLabelBBox.x >= 0,
        true,
        'Stack label should be inside plot area'
    );

    assert.strictEqual(
        lastStackLabelBBox.x + lastStackLabelBBox.width <= chart.plotWidth,
        false,
        'Stack label should outside plot area'
    );
    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden',
                crop: true
            }
        }
    });
    stacks = chart.yAxis[0].stacks;
    firstStackLabel = stacks.column[0].label;
    lastStackLabel = stacks.column[3].label;

    assert.strictEqual(
        firstStackLabel.visibility,
        'visible',
        'Stack label should be visible'
    );

    assert.strictEqual(
        lastStackLabel.visibility,
        'hidden',
        'Stack label should be hidden'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'justify',
                crop: true
            }
        }
    });

    stacks = chart.yAxis[0].stacks;
    firstStackLabelBBox = stacks.column[0].label.element.getBBox();
    lastStackLabelBBox = stacks.column[3].label.element.getBBox();

    assert.strictEqual(
        firstStackLabelBBox.x >= 0,
        true,
        'Stack label should be inside plot area'
    );

    assert.strictEqual(
        lastStackLabelBBox.x + lastStackLabelBBox.width <= chart.plotWidth,
        true,
        'Stack label should be inside plot area'
    );
});
