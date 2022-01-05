QUnit.test('Arc shape', function (assert) {
    let selectionShape;
    
    const chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'xy',
                polar: true,
                events: {
                    selection: function () {
                        selectionShape =
                            this.pointer.selectionMarker.element.getAttribute('d');
                    }
                }
            },
            series: [{
                type: 'column',
                data: [8, 7, 6, 5, 4, 3, 2, 1]
            }],
        }),
        controller = new TestController(chart);

    let [centerX, centerY] = chart.pane[0].center;

    centerX += chart.plotLeft;
    centerY += chart.plotTop;

    controller.mouseDown(centerX - 50, centerY);
    controller.mouseMove(centerX + 100, centerY);
    controller.mouseUp();

    assert.ok(
        /\sA|a\s/g.test(selectionShape),
        'Selection should be arc shaped'
    );
});
