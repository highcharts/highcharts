QUnit.test('Axis offsets - test series clips.(#4371)', function (assert) {
    var chart = $('#container')
            .highcharts({
                xAxis: {
                    offset: -150
                },
                yAxis: {
                    offset: -150
                },
                series: [
                    {
                        data: [
                            [-3, 3],
                            [-2, 2],
                            [-1, 1],
                            [0, 0],
                            [1, 1],
                            [2, 2],
                            [3, 3]
                        ]
                    }
                ]
            })
            .highcharts(),
        clipID = chart.series[0].group.attr('clip-path').replace(/"/g, ''),
        clipElement = document.querySelectorAll(
            clipID.substring(4, clipID.length - 1) + ' rect'
        )[0],
        clip = {
            width: clipElement.getAttribute('width'),
            height: clipElement.getAttribute('height'),
            id: clipID
        };

    assert.strictEqual(
        chart.plotWidth === parseInt(clip.width, 10) &&
            chart.plotHeight === parseInt(clip.height, 10),
        true,
        'CLip path has proper width and height'
    );

    // #6967: an axis pushed out with `offset` plus title.offset 0 must still
    // reserve room for its labels, or they clip off the left edge. Wide
    // labels make the reservation shortfall visible.
    chart.yAxis[0].update({
        offset: 60,
        labels: {
            format: '{value}.000000'
        },
        title: {
            text: 'Values',
            offset: 0
        }
    });
    assert.ok(
        chart.yAxis[0].labelGroup.getBBox().x >= 0,
        'Offset axis labels stay inside with title.offset 0 (#6967).'
    );

    // #6967: at offset 0 the title overlaps the labels and reserves no extra
    // space, so removing it must not change plotLeft.
    chart.yAxis[0].update({ offset: 0 });
    const plotLeftWithTitle = chart.plotLeft;
    chart.yAxis[0].update({ title: { text: null } });
    assert.strictEqual(
        plotLeftWithTitle,
        chart.plotLeft,
        'title.offset 0 reserves label width, not label + title (#6967).'
    );
});
