// Highcharts 4.0.1, Issue #3017
// Column range - centered data labels
// Skipped when testing for v11. Chart was not being inverted, so the test was
// not doing what it was supposed to do. Furthermore, the data label positioning
// is likely covered by visual tests.
QUnit.skip('Columnrange align datalabels (#3017)', function (assert) {
    TestTemplate.test(
        'highcharts/columnrange',
        {
            chart: {
                inverted: true
            },
            series: [
                {
                    data: [
                        [0, 1],
                        [2, 3],
                        [1, 2]
                    ],
                    dataLabels: {
                        enabled: true,
                        inside: true,
                        allowOverlap: true,
                        align: 'center'
                    }
                }
            ]
        },
        function (template) {
            var chart = template.chart,
                series = chart.series[0],
                points = series.points,
                label,
                labelBox,
                labelOffset,
                point,
                pointBox,
                pointOffset;

            for (var i = 0, ie = points.length; i < ie; ++i) {
                label = points[i].dataLabel;
                labelBox = label.getBBox();
                labelOffset = Highcharts.offset(label.element);

                point = points[i].graphic;
                pointBox = point.getBBox();
                pointOffset = Highcharts.offset(point.element);

                assert.close(
                    labelOffset.top,
                    pointOffset.top + (pointBox.width - labelBox.width) / 2,
                    {
                        // close tolerance
                        Chrome: 4.5,
                        Edge: 1.5,
                        Firefox: 5.5,
                        MSIE: 2.5,
                        Safari: 2.5,
                        '': 1
                    }[TestUtilities.browser || ''],
                    'Data label #' +
                        i +
                        ' should be horizontal aligned in the' +
                        ' center of the column.'
                );

                assert.close(
                    labelOffset.left,
                    pointOffset.left + (pointBox.height - labelBox.height) / 2,
                    {
                        // close tolerance
                        Chrome: 9,
                        Edge: 7.5,
                        Firefox: 9.5,
                        MSIE: 7.5,
                        Safari: 8.5,
                        '': 1
                    }[TestUtilities.browser || ''],
                    'Data label #' +
                        i +
                        ' should be vertical aligned in the' +
                        ' middle of the column.'
                );
            }
        }
    );
});

QUnit.test('Change of label alignment after add(#4605)', function (assert) {
    var chart,
        options = {
            chart: {
                type: 'columnrange'
            },
            yAxis: {
                min: -20,
                max: 20
            },
            plotOptions: {
                columnrange: {
                    // cropThreshold: Number.MAX_VALUE,
                    dataLabels: {
                        // allowOverlap: true,
                        // crop: false,
                        // overflow: 'none',
                        enabled: true,
                        inside: true
                    }
                }
            },
            series: [
                {
                    data: [
                        [-10, 40],
                        [-15, 15],
                        [-30, 10],
                        [-20.1, 20.1],
                        [-25, 25],
                        [-125, 125]
                    ]
                }
            ]
        };

    function allLabelsVisible(chart) {
        var allVis = true;

        chart.series[0].points.forEach(function (point) {
            if (
                point.dataLabelUpper.attr('y') < -10 ||
                point.dataLabel.attr('y') < -10
            ) {
                allVis = false;
            }
        });

        return allVis;
    }

    chart = $('#container').highcharts(options).highcharts();
    assert.equal(allLabelsVisible(chart), true, 'All labels are visible');

    options.chart.inverted = true;
    chart = $('#container').highcharts(options).highcharts();
    assert.equal(
        allLabelsVisible(chart),
        true,
        'All labels are visible when inverted'
    );
});

QUnit.test('#14050: Empty dataLabels', function (assert) {
    [
        [],
        [undefined, { enabled: false }],
        [{ enabled: false }, undefined],
        [undefined, undefined]
    ].forEach(function (labels) {
        Highcharts.chart('container', {
            series: [
                {
                    data: [
                        [1, 2],
                        [4, 5],
                        [3, 7],
                        [5, 6]
                    ],
                    dataLabels: labels,
                    type: 'arearange'
                }
            ]
        });
    });

    assert.ok(true, 'Does not throw when passed empty dataLabels');
});

QUnit.test('#14359: Correct datalabel alignment', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'columnrange',
            inverted: false
        },
        series: [
            {
                data: [[-9.0, 8.6]],
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        ]
    });
    // getting options
    var stacking = chart.series[0].stacking;
    assert.strictEqual(
        typeof stacking,
        'undefined',
        'Stacking should be undefined'
    );
});
