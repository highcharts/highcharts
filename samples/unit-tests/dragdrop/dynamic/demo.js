
QUnit.test('Dragdrop enabled in dynamic chart', function (assert) {

    var chart = Highcharts.chart('container', {
            series: []
        }),
        assertNoEvents = function () {
            assert.notOk(chart.unbindDragDropMouseUp, 'No mouse up event');
            assert.notOk(chart.unbindDragDropTouchEnd, 'No touch end event');
            assert.notOk(chart.hasAddedDragDropEvents, 'No events added flag');
        };

    assertNoEvents();

    chart.addSeries({
        data: [1, 2, 3]
    });

    assertNoEvents();

    chart.series[0].remove();

    assertNoEvents();

    chart.addSeries({
        data: [4, 5, 6]
    });

    assertNoEvents();

    chart.addSeries({
        data: [7, 8, 9],
        dragDrop: {
            draggableY: true
        }
    });

    assert.ok(chart.unbindDragDropMouseUp, 'Has mouse up event');
    assert.ok(chart.unbindDragDropTouchEnd, 'Has touch end event');
    assert.ok(chart.hasAddedDragDropEvents, 'Has events added flag');
});
