QUnit.test('Chart events', assert => {
    const stack = [];
    const chart = Highcharts.chart('container', {
        chart: {
            events: {
                redraw: () => stack.push('Redraw.1')
            },
            width: 200
        }
    });

    assert.deepEqual(
        stack,
        [],
        'No redraw calls initially'
    );

    chart.setSize(300);
    assert.deepEqual(
        stack,
        [
            'Redraw.1'
        ],
        'The initial event should fire'
    );

    chart.update({
        chart: {
            events: {
                redraw: () => stack.push('Redraw.2')
            }
        }
    }, false);

    assert.deepEqual(
        stack,
        [
            'Redraw.1'
        ],
        'Updated without redraw, no event should fire'
    );

    chart.redraw();
    assert.deepEqual(
        stack,
        [
            'Redraw.1',
            'Redraw.2'
        ],
        'Redrew, only the replaced event should fire (#6538)'
    );

    chart.update({});
    assert.deepEqual(
        stack,
        [
            'Redraw.1',
            'Redraw.2'
        ],
        'Empty chart.update({}) should be a no-op (#24805)'
    );

    chart.update({ chart: { width: 300 } });
    assert.deepEqual(
        stack,
        [
            'Redraw.1',
            'Redraw.2'
        ],
        'chart.update() with options matching current state should be a no-op' +
        ' (#24805)'
    );
});