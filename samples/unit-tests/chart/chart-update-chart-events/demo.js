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
});