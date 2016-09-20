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
