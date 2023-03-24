QUnit.test('Dragdrop with Highcharts Maps MapPoints', function (assert) {
    const chart = Highcharts.mapChart('container', {
            series: [{
                type: 'mappoint',
                dataLabels: {
                    enabled: true
                },
                dragDrop: {
                    draggableX: true,
                    draggableY: true
                },
                data: [{
                    name: 'Krakow',
                    lon: 19.944981,
                    lat: 50.064651
                }]
            }]
        }),
        controller = new TestController(chart),
        point = chart.series[0].points[0],
        x = point.plotX + chart.plotLeft,
        y = point.plotY + chart.plotTop;
    let oldPointPlotX = point.plotX,
        oldPointPlotY = point.plotY;

    controller.mouseMove(x, y);
    controller.mouseDown(x, y);
    controller.mouseMove(x + 100, y + 100);
    controller.mouseUp(x + 100, y + 100);

    assert.strictEqual(
        point.plotX - 100,
        oldPointPlotX,
        'Dragdrop should work with MapPoint without any projection (#18074).'
    );

    assert.strictEqual(
        point.plotY - 100,
        oldPointPlotY,
        'Dragdrop should work with MapPoint without any projection (#18074).'
    );

    chart.mapView.update({
        projection: {
            name: 'WebMercator'
        }
    });

    oldPointPlotX = point.plotX;
    oldPointPlotY = point.plotY;
    controller.mouseDown(x + 100, y + 100, void 0, true);
    controller.mouseMove(x, y, void 0, true);
    controller.mouseUp(x, y, void 0, true);

    assert.ok(
        point.plotX < oldPointPlotX && point.plotY < oldPointPlotY,
        'Dragdrop should work with MapPoint with projection (#18074).'
    );
});
