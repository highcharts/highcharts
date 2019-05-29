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

    var stackLabels,
        firstStackLabel,
        lastStackLabel;

    stackLabels =  chart.yAxis[0].stackTotalGroup.element.childNodes;
    firstStackLabel = stackLabels[0];
    lastStackLabel = stackLabels[stackLabels.length - 1];

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(firstStackLabel.getAttribute('x')) -
        firstStackLabel.getBBox().width / 2,
        parseFloat(firstStackLabel.getAttribute('y')) -
        firstStackLabel.getBBox().height / 2),
        true,
        'Stack label is inside plot area'
    );

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(lastStackLabel.getAttribute('x')) +
        lastStackLabel.getBBox().width / 2,
        parseFloat(lastStackLabel.getAttribute('y')) -
        lastStackLabel.getBBox().height / 2),
        true,
        'Stack label is inside plot area'
    );

    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden'
            }
        }
    });
    stackLabels =  chart.yAxis[0].stackTotalGroup.element.childNodes;
    firstStackLabel = stackLabels[0];
    lastStackLabel = stackLabels[stackLabels.length - 1];

    assert.strictEqual(
        firstStackLabel.getAttribute('visibility'),
        'hidden',
        'Stack label should be hidden'
    );

    assert.strictEqual(
        lastStackLabel.getAttribute('visibility'),
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

    stackLabels =  chart.yAxis[0].stackTotalGroup.element.childNodes;
    firstStackLabel = stackLabels[0];
    lastStackLabel = stackLabels[stackLabels.length - 1];

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(firstStackLabel.getAttribute('x')) -
        firstStackLabel.getBBox().width / 2,
        parseFloat(firstStackLabel.getAttribute('y')) -
        firstStackLabel.getBBox().height / 2),
        false,
        'Stack label is outside plot area'
    );

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(lastStackLabel.getAttribute('x')) +
        lastStackLabel.getBBox().width / 2,
        parseFloat(lastStackLabel.getAttribute('y')) -
        lastStackLabel.getBBox().height / 2),
        false,
        'Stack label is outside plot area'
    );

    chart.update({
        chart: {
            inverted: true
        }
    });
    stackLabels =  chart.yAxis[0].stackTotalGroup.element.childNodes;
    firstStackLabel = stackLabels[0];
    lastStackLabel = stackLabels[stackLabels.length - 1];

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(firstStackLabel.getAttribute('x')) +
        firstStackLabel.getBBox().width,
        parseFloat(firstStackLabel.getAttribute('y')) -
        firstStackLabel.getBBox().height),
        true,
        'Stack label is inside plot area'
    );

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(lastStackLabel.getAttribute('x')) +
        lastStackLabel.getBBox().width,
        parseFloat(lastStackLabel.getAttribute('y')) -
        lastStackLabel.getBBox().height),
        false,
        'Stack label is outside plot area'
    );
    chart.update({
        yAxis: {
            stackLabels: {
                overflow: 'hidden',
                crop: true
            }
        }
    });
    stackLabels =  chart.yAxis[0].stackTotalGroup.element.childNodes;
    firstStackLabel = stackLabels[0];
    lastStackLabel = stackLabels[stackLabels.length - 1];

    assert.strictEqual(
        firstStackLabel.getAttribute('visibility'),
        'visible',
        'Stack label should be visible'
    );

    assert.strictEqual(
        lastStackLabel.getAttribute('visibility'),
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

    stackLabels =  chart.yAxis[0].stackTotalGroup.element.childNodes;
    firstStackLabel = stackLabels[0];
    lastStackLabel = stackLabels[stackLabels.length - 1];

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(firstStackLabel.getAttribute('x')) +
        firstStackLabel.getBBox().width,
        parseFloat(firstStackLabel.getAttribute('y')) -
        firstStackLabel.getBBox().height),
        true,
        'Stack label is inside plot area'
    );

    assert.strictEqual(
        chart.isInsidePlot(parseFloat(lastStackLabel.getAttribute('x')) +
        lastStackLabel.getBBox().width,
        parseFloat(lastStackLabel.getAttribute('y')) -
        lastStackLabel.getBBox().height),
        true,
        'Stack label is inside plot area'
    );
});
