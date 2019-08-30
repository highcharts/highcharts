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


    assert.notStrictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('y'),
        null,
        'Y attribute should be set (#8834)'
    );

    assert.strictEqual(
        chart.container.querySelector('.highcharts-label.highcharts-stack-labels')
            .getAttribute('visibility'),
        'hidden',
        'Stack label should be hidden (#8834)'
    );
});

QUnit.test('Stack labels crop and overflow features #8912', function (assert) {

    let firstStackLabel;
    let lastStackLabel;

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 250,
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
            data: [29.9123464, -71.5123464, 106.4123464, 129.2123464]
        }, {
            data: [144.0123464, -176.0123464, 135.6123464, 148.5123464]
        }, {
            data: [144.0123464, -176.0123464, 135.6123464, 148.5123464].reverse()
        }]
    });

    const getFirstAndLast = () => {
        const stacks = chart.yAxis[0].stacks,
            stackKey = Object.keys(stacks)[0];

        return [
            stacks[stackKey][0].label,
            stacks[stackKey][3].label
        ];
    };

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.close(
        firstStackLabel.alignAttr.x -
        (firstStackLabel.getBBox().width / 2),
        0,
        0.5,
        'Stack label should be inside plot area left'
        //0.5 is a value arised from difference between fonts
    );
    assert.close(
        lastStackLabel.alignAttr.x +
        (lastStackLabel.getBBox().width / 2),
        chart.plotWidth,
        0.5,
        'Stack label should be inside plot area right'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'allow'
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

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

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x -
        (firstStackLabel.getBBox().width / 2) >= 0,
        false,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabel.alignAttr.x +
        (lastStackLabel.getBBox().width / 2) <= chart.plotWidth,        false,
        'Stack label should be outside plot area'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x +
        firstStackLabel.getBBox().width >= 0,
        true,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabel.alignAttr.x +
        lastStackLabel.width <= chart.plotWidth,
        false,
        'Stack label should be outside plot area'
    );
    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden',
                crop: true
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

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
                overflow: 'justify',
                crop: true
            }
        }
    });

    [firstStackLabel, lastStackLabel] = getFirstAndLast();

    assert.strictEqual(
        firstStackLabel.alignAttr.x -
        (firstStackLabel.getBBox().width / 2) >= 0,
        true,
        'Stack label should be inside plot area left'
    );
    assert.strictEqual(
        lastStackLabel.alignAttr.x +
        (lastStackLabel.getBBox().width / 2) <= chart.plotWidth,
        true,
        'Stack label should be inside plot area right'
    );
});
