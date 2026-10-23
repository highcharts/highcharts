QUnit.test('Chart events', assert => {
    const stack = [];
    const chart = Highcharts.chart('container', {
        chart: {
            events: {
                redraw: () => stack.push('Redraw.1'),
                update: e => stack.push(`Update.${!!e.hasChanged}`),
                afterUpdate: () => stack.push('AfterUpdate')
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
            'Redraw.1',
            'Update.true',
            'AfterUpdate'
        ],
        'Updated without redraw, the update events should fire but no redraw'
    );

    chart.redraw();
    assert.deepEqual(
        stack,
        [
            'Redraw.1',
            'Update.true',
            'AfterUpdate',
            'Redraw.2'
        ],
        'Redrew, only the replaced event should fire (#6538)'
    );

    chart.update({});
    assert.deepEqual(
        stack,
        [
            'Redraw.1',
            'Update.true',
            'AfterUpdate',
            'Redraw.2',
            'Update.false'
        ],
        'Empty chart.update({}) should be a no-op, neither ' +
        'afterUpdate nor redraw should fire (#24805)'
    );

    chart.update({ chart: { width: 300 } });
    assert.deepEqual(
        stack,
        [
            'Redraw.1',
            'Update.true',
            'AfterUpdate',
            'Redraw.2',
            'Update.false',
            'Update.false'
        ],
        'chart.update() with options matching current state should be a ' +
        'no-op, neither afterUpdate nor redraw should fire (#24805)'
    );
});