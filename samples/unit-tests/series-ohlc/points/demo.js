QUnit.test('directTouch', function (assert) {
    const lineWidth = 11,
        halfWidth = lineWidth / 2,
        points = Highcharts.stockChart('container', {
            series: [
                {
                    type: 'ohlc',
                    data: [
                        [1, 100, 200, 100, 200],
                        [2, 200, 100, 200, 100]
                    ],
                    lineWidth: lineWidth
                }
            ]
        }).series[0].points,
        path2 = points[0].graphic.attr('d').split(' ').map(parseFloat),
        path1 = points[1].graphic.attr('d').split(' ').map(parseFloat);

    assert.strictEqual(
        path1[2] <= path1[8] + halfWidth,
        true,
        'Stem should start at least where open is rendered (#7204)'
    );
    assert.strictEqual(
        path1[5] >= path1[14] - halfWidth,
        true,
        'Stem should end at least where close is rendered (#7204)'
    );

    assert.strictEqual(
        path2[2] <= path2[14] + halfWidth,
        true,
        'Stem should end at least where open is rendered (#7204)'
    );
    assert.strictEqual(
        path2[5] >= path2[8] - halfWidth,
        true,
        'Stem should end at least where close is rendered (#7204)'
    );
});
