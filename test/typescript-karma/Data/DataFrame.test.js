import DataFrame from '/base/js/Data/DataFrame.js';

QUnit.test('DataFrame.events', function (assert) {

    const registeredEvents = [];

    /** @param {DataFrame.EventObject} e */
    function registerEvent(e) {
        registeredEvents.push(e.type);
    }

    /** @param {DataFrame} frame */
    function registerFrame(frame) {
        frame.on('clearFrame', registerEvent);
        frame.on('afterClearFrame', registerEvent);
        frame.on('cloneFrame', registerEvent);
        frame.on('afterCloneFrame', registerEvent);
        frame.on('deleteColumn', registerEvent);
        frame.on('afterDeleteColumn', registerEvent);
        frame.on('deleteRow', registerEvent);
        frame.on('afterDeleteRow', registerEvent);
        frame.on('setCell', registerEvent);
        frame.on('afterSetCell', registerEvent);
        frame.on('setColumn', registerEvent);
        frame.on('afterSetColumn', registerEvent);
        frame.on('setRow', registerEvent);
        frame.on('afterSetRow', registerEvent);
    }

    const frame = new DataFrame({
        id: [ 'a' ],
        text: [ 'text' ]
    });

    registerFrame(frame);

    registeredEvents.length = 0;
    frame.setRow(void 0, ['b', 'text']);
    assert.deepEqual(
        registeredEvents,
        [
            'setRow',
            'afterSetRow',
        ],
        'Events for DataFrame.setRow should be in expected order.'
    );

    registeredEvents.length = 0;
    frame.setCell(frame.getRowIndexBy('id', 'a'), 'text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'setRow',
            'afterSetRow',
            'afterSetCell'
        ],
        'Events for DataFrame.setCell (1) should be in expected order.'
    );

    registeredEvents.length = 0;
    assert.strictEqual(
        frame.getRowCount(),
        2,
        'Frame should contain two rows.'
    );
    frame.deleteRow(0);
    assert.strictEqual(
        frame.getRowCount(),
        1,
        'Frame should contain one row.'
    );
    assert.deepEqual(
        registeredEvents,
        [
            'deleteRow',
            'afterDeleteRow'
        ],
        'Events for DataFrame.deleteRow should be in expected order.'
    );

    registeredEvents.length = 0;
    frame.setColumn('new', [ 'new' ]);
    assert.deepEqual(
        registeredEvents,
        [
            'setColumn',
            'afterSetColumn'
        ],
        'Events for DataFrame.setColumn should be in expected order.'
    );

    registeredEvents.length = 0;
    frame.setCell(0, 'text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'setRow',
            'afterSetRow',
            'afterSetCell'
        ],
        'Events for DataFrame.setCell (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    frame.deleteColumn('new');
    assert.deepEqual(
        registeredEvents,
        [
            'deleteColumn',
            'afterDeleteColumn'
        ],
        'Events for DataFrame.deleteColumn should be in expected order.'
    );

    registeredEvents.length = 0;
    frame.clear();
    assert.deepEqual(
        registeredEvents,
        [
            'clearFrame',
            'afterClearFrame'
        ],
        'Events for DataFrame.clear should be in expected order.'
    );

    registeredEvents.length = 0;
    frame.clone();
    assert.deepEqual(
        registeredEvents,
        [
            'cloneFrame',
            'afterCloneFrame'
        ],
        'Events for DataFrame.clone should be in expected order.'
    );

});
