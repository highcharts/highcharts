import DataCursor from '/base/code/es-modules/Data/DataCursor.js';
import DataTable from '/base/code/es-modules/Data/DataTable.js';

QUnit.test('DataCursor.emitCursor', function (assert) {
    const done = assert.async(2),
        event = new Event('event'),
        cursor = new DataCursor(),
        table = new DataTable({
            columns: {
                a: [0, 1, 2],
                b: [10, 11, 12]
            }
        });

    cursor
        .addListener(table.id, 'test2', function (e) {
            const expectedCursor = {
                type: 'range',
                firstRow: 2,
                lastRow: 9,
                state: 'test2'
            };

            assert.strictEqual(
                this,
                cursor,
                'Listener scope should be a DataCursor instance by default.'
            );

            assert.deepEqual(
                e,
                {
                    cursor: expectedCursor,
                    cursors: [],
                    table
                },
                'Emitted event should have expected structure.'
            );

            done();
        })
        .addListener(table.id, 'test3', function (e) {
            const expectedCursor = {
                type: 'range',
                firstRow: 0,
                lastRow: 2,
                state: 'test3'
            };

            assert.strictEqual(
                this,
                cursor,
                'Listener scope should be a DataCursor instance by default.'
            );

            assert.deepEqual(
                e,
                {
                    cursor: expectedCursor,
                    cursors: [expectedCursor],
                    event,
                    table
                },
                'Lasting event should have expected structure.'
            );

            done();
        });

    cursor
        .emitCursor(table, {
            type: 'position',
            column: 'a',
            row: 1,
            state: 'test1'
        })
        .emitCursor(table, {
            type: 'range',
            firstRow: 2,
            lastRow: 9,
            state: 'test2'
        })
        .emitCursor(table, {
            type: 'range',
            firstRow: 0,
            lastRow: 2,
            state: 'test3'
        }, event, true);
});

QUnit.test('DataCursor.isEqual', function (assert) {
    // position
    assert.ok(
        DataCursor.isEqual({
            type: 'position',
            state: 'test1'
        }, {
            type: 'position',
            state: 'test1'
        }),
        'Cursors should be equal.'
    );
    assert.notOk(
        DataCursor.isEqual({
            type: 'position',
            state: 'test2a'
        }, {
            type: 'position',
            state: 'test2b'
        }),
        'Cursors should not be equal.'
    );
    assert.ok(
        DataCursor.isEqual({
            type: 'position',
            column: 'a',
            state: 'test3'
        }, {
            type: 'position',
            column: 'a',
            state: 'test3'
        }),
        'Cursors should be equal.'
    );
    assert.notOk(
        DataCursor.isEqual({
            type: 'position',
            column: 'a',
            state: 'test4'
        }, {
            type: 'position',
            column: 'b',
            state: 'test4'
        }),
        'Cursors should not be equal.'
    );
    assert.notOk(
        DataCursor.isEqual({
            type: 'position',
            column: 'a',
            row: 0,
            state: 'test5'
        }, {
            type: 'position',
            column: 'a',
            state: 'test5'
        }),
        'Cursors should not be equal.'
    );
    assert.ok(
        DataCursor.isEqual({
            type: 'position',
            column: 'a',
            row: 0,
            state: 'test6'
        }, {
            type: 'position',
            column: 'a',
            row: 0,
            state: 'test6'
        }),
        'Cursors should be equal.'
    );
    assert.notOk(
        DataCursor.isEqual({
            type: 'position',
            column: 'a',
            row: 0,
            state: 'test7'
        }, {
            type: 'position',
            column: 'b',
            row: NaN,
            state: 'test7'
        }),
        'Cursors should not be equal.'
    );
    // mixed
    assert.notOk(
        DataCursor.isEqual({
            type: 'position',
            column: 'a',
            row: 0,
            state: 'test8'
        }, {
            type: 'range',
            columns: ['a'],
            firstRow: 0,
            lastRow: 0,
            state: 'test8'
        }),
        'Cursors should not be equal.'
    );
    // range
    assert.ok(
        DataCursor.isEqual({
            type: 'range',
            firstRow: 0,
            lastRow: 1,
            state: 'test9'
        }, {
            type: 'range',
            columns: void 0,
            firstRow: 0,
            lastRow: 1,
            state: 'test9'
        }),
        'Cursors should be equal.'
    );
    assert.notOk(
        DataCursor.isEqual({
            type: 'range',
            firstRow: 0,
            lastRow: 1,
            state: 'test10'
        }, {
            type: 'range',
            firstRow: 1,
            lastRow: 2,
            state: 'test10'
        }),
        'Cursors should not be equal.'
    );
    assert.ok(
        DataCursor.isEqual({
            type: 'range',
            columns: [],
            firstRow: 0,
            lastRow: 1,
            state: 'test11'
        }, {
            type: 'range',
            columns: [],
            firstRow: 0,
            lastRow: 1,
            state: 'test11'
        }),
        'Cursors should be equal.'
    );
    assert.notOk(
        DataCursor.isEqual({
            type: 'range',
            columns: ['a'],
            firstRow: 0,
            lastRow: 1,
            state: 'test12'
        }, {
            type: 'range',
            columns: ['b'],
            firstRow: 0,
            lastRow: 1,
            state: 'test12'
        }),
        'Cursors should not be equal.'
    );
});
QUnit.test('DataCursor.isInRange', function (assert) {
    const cursorRange /*: DataCursor.CursorRange*/ = {
        type: 'range',
        columns: ['a', 'b', 'c'],
        firstRow: 0,
        lastRow: 9,
        state: 'state2'
    };

    assert.ok(
        DataCursor.isInRange({
            type: 'position',
            column: 'a',
            state: 'test1'
        }, cursorRange),
        'Cursor should be in range.'
    );
    assert.notOk(
        DataCursor.isInRange({
            type: 'position',
            column: 'z',
            state: 'test2'
        }, cursorRange),
        'Cursor should not be in range.'
    );
    assert.ok(
        DataCursor.isInRange({
            type: 'position',
            column: 'b',
            row: 2,
            state: 'test3'
        }, cursorRange),
        'Cursor should be in range.'
    );
    assert.notOk(
        DataCursor.isInRange({
            type: 'position',
            column: 'b',
            row: 20,
            state: 'test4'
        }, cursorRange),
        'Cursor should not be in range.'
    );
    assert.notOk(
        DataCursor.isInRange({
            type: 'position',
            column: 'z',
            row: 2,
            state: 'test4'
        }, cursorRange),
        'Cursor should not be in range.'
    );
});

QUnit.test('DataCursor.toRange', function (assert) {
    assert.deepEqual(
        DataCursor.toRange({
            type: 'position',
            column: 'a',
            state: 'test1'
        }),
        {
            type: 'range',
            columns: ['a'],
            firstRow: 0,
            lastRow: Number.MAX_VALUE,
            state: 'test1'
        },
        'Cursor range should have expected structure.'
    );
    assert.deepEqual(
        DataCursor.toRange({
            type: 'position',
            column: 'b',
            row: 343,
            state: 'test2'
        }),
        {
            type: 'range',
            columns: ['b'],
            firstRow: 343,
            lastRow: 343,
            state: 'test2'
        },
        'Cursor range should have expected structure.'
    );
    assert.deepEqual(
        DataCursor.toRange({
            type: 'position',
            row: 729,
            state: 'test2'
        }),
        {
            type: 'range',
            firstRow: 729,
            lastRow: 729,
            state: 'test2'
        },
        'Cursor range should have expected structure.'
    );
});
