QUnit.test('getTitlePosition', function (assert) {
    var getTitlePosition = Highcharts.Axis.prototype.getTitlePosition,
        fontMetrics = Highcharts.Renderer.prototype.fontMetrics,
        xAxis = {
            axisTitleMargin: 30,
            chart: {
                renderer: {
                    fontMetrics: fontMetrics
                }
            },
            height: 265,
            horiz: true,
            left: 93,
            len: 729,
            offset: 0,
            opposite: undefined,
            options: {
                title: {
                    align: 'middle',
                    style: {
                        fontSize: 'x-large'
                    }
                }
            },
            side: 2,
            top: 53,
            width: 729
        },
        yAxis = {
            axisTitleMargin: 45.859375,
            chart: {
                renderer: {
                    fontMetrics: fontMetrics
                }
            },
            height: 265,
            horiz: false,
            left: 93,
            len: 265,
            offset: -0,
            opposite: undefined,
            options: {
                title: {
                    align: 'middle',
                    style: {
                        fontSize: 'x-large'
                    }
                }
            },
            side: 3,
            top: 53,
            width: 729
        };
    assert.deepEqual(
        getTitlePosition.call(xAxis),
        {  "x": 457.5, "y": 360 },
        'xAxis returns expected position'
    );
    assert.deepEqual(
        getTitlePosition.call(yAxis),
        {  "x": 47.140625, "y": 185.5 },
        'yAxis returns expected position'
    );
});
