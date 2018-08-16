QUnit.test('textAlign', function (assert) {
    var chart = Highcharts.chart('container', {
            yAxis: [{
                title: {
                    text: 'Vertical Axis'
                }
            }],
            xAxis: [{
                title: {
                    text: 'Horizontal Axis'
                }
            }],
            series: [{
                data: []
            }]
        }),
        horizontalAxis = chart.xAxis[0],
        verticalAxis = chart.yAxis[0];


    function getTitleTextAlign(axis) {
        var align = { start: 'left', middle: 'center', end: 'right' };
        // Ideally there should the renderer should have an alignGetter. Alternative syntax axis.axisTitle.attr('align');
        return align[axis.axisTitle.element.getAttribute('text-anchor')];
    }

    // Test the horizontal axis
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'center',
        'horizontal Axis default textAlign:middle'
    );
    horizontalAxis.update({ title: { align: 'low' } });
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'left',
        'horizontal Axis align:low has textAlign:left'
    );
    horizontalAxis.update({ title: { align: 'middle' } });
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'center',
        'horizontal Axis align:middle has textAlign:center'
    );
    horizontalAxis.update({ title: { align: 'high' } });
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'right',
        'horizontal Axis align:high has textAlign:right'
    );
    horizontalAxis.update({ opposite: true });
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'right',
        'horizontal and opposite Axis align:high has textAlign:right'
    );
    horizontalAxis.update({ title: { align: 'middle' } });
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'center',
        'horizontal and opposite Axis align:middle has textAlign:center'
    );
    horizontalAxis.update({ title: { align: 'low' } });
    assert.strictEqual(
        getTitleTextAlign(horizontalAxis),
        'left',
        'horizontal and opposite Axis align:low has textAlign:left'
    );

    // Test the vertical axis
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'center',
        'vertical Axis default textAlign:middle'
    );
    verticalAxis.update({ title: { align: 'low' } });
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'left',
        'vertical Axis align:low has textAlign:left'
    );
    verticalAxis.update({ title: { align: 'middle' } });
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'center',
        'vertical Axis align:middle has textAlign:center'
    );
    verticalAxis.update({ title: { align: 'high' } });
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'right',
        'vertical Axis align:high has textAlign:right'
    );
    verticalAxis.update({ opposite: true });
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'left',
        'vertical opposite Axis align:high has textAlign:left'
    );
    verticalAxis.update({ title: { align: 'middle' } });
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'center',
        'vertical opposite Axis align:middle has textAlign:center'
    );
    verticalAxis.update({ title: { align: 'low' } });
    assert.strictEqual(
        getTitleTextAlign(verticalAxis),
        'right',
        'vertical opposite Axis align:low has textAlign:right'
    );
});

/*
 * Checks that the option *Axis.title.reserveSpace works as intended
 */
QUnit.test('title.reserveSpace', function (assert) {
    var reserveSpaceTrue,
        reserveSpaceFalse,
        noTitle,
        chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },

            yAxis: [{
                title: {
                    text: 'Left Vertical Axis 1'
                }
            }, {
                title: {
                    text: 'Left Vertical Axis 2'
                },
                linkedTo: 0
            }, {
                title: {
                    text: 'Right Vertical Axis 1'
                },
                linkedTo: 0,
                opposite: true
            }, {
                title: {
                    text: 'Right Vertical Axis 2'
                },
                linkedTo: 0,
                opposite: true
            }],

            xAxis: [{
                title: {
                    text: 'Bottom Horizontal Axis 1'
                }
            }, {
                title: {
                    text: 'Bottom Horizontal Axis 2'
                },
                linkedTo: 0
            }, {
                title: {
                    text: 'Top Horizontal Axis 1'
                },
                linkedTo: 0,
                opposite: true
            }, {
                title: {
                    text: 'Top Horizontal Axis 2'
                },
                linkedTo: 0,
                opposite: true
            }],

            series: [{
                data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }]
        }),
        axes = chart.axes;

    Highcharts.each(axes, function (axis) {
        var axisName = axis.options.title.text,
            dir = axis.horiz ? 'y' : 'x',
            lessThan = axis.opposite && !axis.horiz || !axis.opposite && axis.horiz;

        // Check that reserveSpace is true by default
        assert.strictEqual(
            axis.options.title.reserveSpace,
            undefined,
            axisName + ': title.reserveSpace is true by default'
        );
        reserveSpaceTrue = axis.labelGroup.getBBox()[dir];

        // Set reserveSpace to false
        axis.update(Highcharts.merge(axis.options, {
            title: {
                reserveSpace: false
            }
        }));
        reserveSpaceFalse =  axis.labelGroup.getBBox()[dir];

        // Set title to null
        axis.update(Highcharts.merge(axis.options, {
            title: null
        }));

        noTitle = axis.labelGroup.getBBox()[dir];

        assert.ok(
            lessThan ?
                reserveSpaceTrue < reserveSpaceFalse :
                reserveSpaceTrue > reserveSpaceFalse,
            axisName + ': reserveSpaceTrue ' + dir + ' ' +
                        (lessThan ? '<' : '>') +
                        ' reserveSpaceFalse ' + dir
        );
        assert.equal(
            reserveSpaceFalse,
            noTitle,
            axisName + ': reserveSpaceFalse === noTitle'
        );
    });
});

QUnit.test('Axis title multiline', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 300,
            height: 300
        },
        yAxis: [{
            title: {
                text: 'A really long y axis title for this example. It is wrapped but shouldnt overlap axis labels'
            },
            lineWidth: 3
        }, {
            title: {
                text: 'A really long y axis title for this example. It is wrapped but shouldnt overlap axis labels'
            },
            opposite: true,
            lineWidth: 3,
            linkedTo: 0
        }],
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.ok(
        chart.yAxis[0].axisTitle.element.getElementsByTagName('tspan').length > 1,
        'Title is multiline'
    );

    assert.ok(
        chart.yAxis[1].axisTitle.element.getElementsByTagName('tspan').length > 1,
        'Title is multiline'
    );

    assert.strictEqual(
        chart.yAxis[1].options.title.style.width,
        undefined,
        'Title style width option should be left undefined (#7614)'
    );

    var crammedPlotWidth = chart.plotWidth;
    assert.ok(
        chart.plotWidth < 150,
        'Plot area adapted'
    );

    chart.yAxis[0].update({
        title: {
            style: {
                textOverflow: 'ellipsis'
            }
        }
    });

    assert.ok(
        chart.yAxis[0].axisTitle.element.getElementsByTagName('tspan').length === 1,
        'Title is single line'
    );
    assert.ok(
        chart.plotWidth > crammedPlotWidth,
        'Plot width increased'
    );

});

// Highcharts 4.0.1, Issue #3027
// Category labels are truncated when setting axis title offset
QUnit.test('Axis title offset (#3027)', function (assert) {

    TestTemplate.test('highcharts/column', {
        yAxis: {
            title: {
                align: 'high',
                offset: 0,
                text: 'Rai',
                rotation: 0,
                y: -10
            }
        },
        series: [{
            data: [100, 200, 300]
        }]
    }, function (template) {

        var chart = template.chart,
            labelGroupBox = chart.yAxis[0].labelGroup.getBBox();

        assert.ok(
            labelGroupBox.x >= 0,
            'Labels of y axis should start inside container.'
        );

    });

});
