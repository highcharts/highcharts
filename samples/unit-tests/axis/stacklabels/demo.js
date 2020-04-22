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

    assert.strictEqual(
        firstStackLabel.alignAttr.x + firstStackLabel.padding,
        0,
        'Stack label should be inside plot area left'
    );
    assert.close(
        lastStackLabel.alignAttr.x +
        lastStackLabel.width - lastStackLabel.padding,
        chart.plotWidth,
        0.5,
        'Stack label should be inside plot area right'
        // 0.5 is a difference taken from the stackLabel.width which value is not rounded
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
        firstStackLabel.alignAttr.x +
        firstStackLabel.padding >= 0,
        false,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabel.alignAttr.x +
        lastStackLabel.width - lastStackLabel.padding <= chart.plotWidth,
        false,
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
        firstStackLabel.padding >= 0,
        true,
        'Stack label should be outside plot area'
    );

    assert.strictEqual(
        lastStackLabel.alignAttr.x +
        lastStackLabel.width - lastStackLabel.padding <= chart.plotWidth,
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
        firstStackLabel.alignAttr.x +
        firstStackLabel.padding >= 0,
        true,
        'Stack label should be inside plot area left'
    );
    assert.strictEqual(
        lastStackLabel.alignAttr.x +
        lastStackLabel.width - lastStackLabel.padding <= chart.plotWidth,
        true,
        'Stack label should be inside plot area right'
    );
});

QUnit.test('Stack labels overlapping issue #11982', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 200
        },

        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        series: [{
            stacking: 'normal',
            data: [25.2, 24, 25, 26, 25, 25, 23, 27, 25, 25, 25, 25, 25, 25]
        }]
    });


    assert.strictEqual(
        chart.yAxis[0].stacks['column,,,'][2].label.y === -9999 ||
        chart.yAxis[0].stacks['column,,,'][2].label.opacity === 0,
        true,
        'This stack-label should be hidden because of overlapping #11982'
    );
});

QUnit.test('StackLabels outside xAxis min & max range are displayed #12294', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            height: 400
        },
        xAxis: {
            min: 2,
            max: 8
        },
        yAxis: {
            stackLabels: {
                enabled: true,
                padding: 5
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointPadding: 0,
                groupPadding: 0
            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2]
        }]
    });

    var testValue = chart.yAxis[0].stacks['column,,,'][4].label.alignAttr;
    // StackedLabel has incorrect position after resize chart container #12337
    chart.update({
        chart: {
            height: 150
        }
    });

    chart.update({
        chart: {
            height: 400
        }
    });

    var column = chart.yAxis[0].stacks['column,,,'],
        padding = chart.yAxis[0].options.stackLabels.padding;

    assert.strictEqual(
        column[0].label.visibility,
        'hidden',
        'This stack-label should be hidden because of x min #12294'
    );

    assert.strictEqual(
        column[10].label.visibility,
        'hidden',
        'This stack-label should be hidden because of x max #12294'
    );

    assert.strictEqual(
        column[4].label.alignAttr.x,
        testValue.x,
        'This stack-label alignAttr should be the same after chart resize #12337'
    );

    assert.strictEqual(
        column[4].label.alignAttr.y,
        testValue.y,
        'This stack-label alignAttr should be the same after chart resize #12337'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    column = chart.yAxis[0].stacks['column,,,'];

    assert.strictEqual(
        column[4].label.text.x,
        padding,
        'This stack-label text x attribute should be equal to set padding #12308'
    );
});
