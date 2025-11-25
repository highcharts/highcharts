import DataTable from '/base/code/es-modules/Data/DataTable.js';
import SortModifier from '/base/code/es-modules/Data/Modifiers/SortModifier.js';

QUnit.test('DataTable clone', function (assert) {
    const table = new DataTable({ id: 'table' });

    table.setRows([[ 'row1', 1 ]]);
    table.setCell('1', 0, 100);

    const tableClone = table.clone();

    assert.notStrictEqual(
        table,
        tableClone,
        'Cloned table should be a new instance.'
    );

    assert.strictEqual(
        table.converter,
        tableClone.converter,
        'Cloned and original table should have the same converter reference.'
    );

    assert.deepEqual(
        table.hcEvents,
        tableClone.hcEvents,
        'Cloned and original table should have the same events.'
    );

    assert.strictEqual(
        table.id,
        tableClone.id,
        'Cloned and original table should have the same id.'
    );

    assert.strictEqual(
        table.versionTag,
        tableClone.versionTag,
        'Cloned and original table should have the same versionTag.'
    );
});


QUnit.test('DataTable Column Rename', function (assert) {
    const table = new DataTable({
        columns: {
            column1: [ true ],
            existingColumn: [ true ]
        }
    });

    // Move
    assert.ok(
        table.changeColumnId('column1', 'newColumn'),
        'Table should move cells of a column to a new column.'
    );
    assert.deepEqual(
        table.getColumns(['column1', 'newColumn']),
        { newColumn: [true] },
        'Table should only return renamed column.'
    );

    // Force move
    assert.ok(
        table.changeColumnId('newColumn', 'existingColumn'),
        'Table should move cell of a column to an existing column (with force).'
    );
    assert.deepEqual(
        table.getColumns(['newColumn', 'existingColumn']),
        { existingColumn: [true] }
    );

    // Fail when trying to move an non existing column
    table.setColumn('existingColumn', [ true ])

    assert.notOk(
        table.changeColumnId('nonexistant', 'existingColumn'),
        'Table should fail when trying to move a non-existant column.'
    );

    assert.deepEqual(
        table.getColumns(['nonexistant', 'existingColumn']),
        { existingColumn: [true] },
        'Table should retrieve only existing column.'
    );

});

QUnit.test('DataTable Column Retrieve', function (assert) {
    const table = new DataTable({
            columns: {
                id: [ 0, 1 ],
                a: [ 'a0', 'a1' ],
                b: [ 0.0002, 'b1' ],
                c: [
                    'c0',
                    new DataTable({
                        id: [ 0, 1, 2 ],
                        ca: [ 'ca0', 'ca1', 'ca2' ]
                    })
                ]
            }
        }),
        columns = table.getColumns();

    assert.deepEqual(
        Object.keys(columns),
        ['id', 'a', 'b', 'c'],
        'Result has column names in correct order.'
    );

    Object
        .values(columns)
        .forEach(column => assert.strictEqual(
            column.length,
            2,
            'Result has correct amount of column cells.'
        ));

});

QUnit.test('DataTable Events', function (assert) {
    const done = assert.async(),
        registeredEvents = [];

    /** @param {DataTable.EventObject} e */
    function registerEvent(e) {
        registeredEvents.push(e.type);
    }

    /** @param {DataTable} table */
    function registerTable(table) {
        const eventsToRegister = [
            'cloneTable', 'afterCloneTable',
            'deleteColumns', 'afterDeleteColumns',
            'deleteRows', 'afterDeleteRows',
            'setCell', 'afterSetCell',
            'setColumns', 'afterSetColumns',
            'setModifier', 'afterSetModifier',
            'setRows', 'afterSetRows'
        ];
        while (eventsToRegister.length) {
            table.on(eventsToRegister.shift(), registerEvent);
        }
    }

    const table = new DataTable({
        columns: {
            id: [ 'a' ],
            text: [ 'text' ]
        }
    });

    registerTable(table);

    registeredEvents.length = 0;
    table.setRows([
        ['b', 'text'],
        {
            id: 'c',
            text: 'text'
        }
    ]);
    assert.deepEqual(
        registeredEvents,
        [
            'setRows',
            'afterSetRows'
        ],
        'Events for DataTable.setRows should be in expected order.'
    );

    registeredEvents.length = 0;
    table.setCell('text', table.getRowIndexBy('id', 'a'), 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'afterSetCell'
        ],
        'Events for DataTable.setCell (1) should be in expected order.'
    );

    registeredEvents.length = 0;
    assert.strictEqual(
        table.getRowCount(),
        3,
        'DataTable should contain three rows.'
    );
    table.deleteRows(0);
    assert.strictEqual(
        table.getRowCount(),
        2,
        'DataTable should contain two rows.'
    );
    assert.deepEqual(
        registeredEvents,
        [
            'deleteRows',
            'afterDeleteRows'
        ],
        'Events for DataTable.deleteRows should be in expected order.'
    );

    registeredEvents.length = 0;
    table.setColumn('new', [ 'new' ]);
    assert.deepEqual(
        registeredEvents,
        [
            'setColumns',
            'afterSetColumns'
        ],
        'Events for DataTable.setColumn should be in expected order.'
    );

    registeredEvents.length = 0;
    table.setCell('text', 0, 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'afterSetCell'
        ],
        'Events for DataTable.setCell (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    table.deleteColumns(['new']);
    assert.deepEqual(
        registeredEvents,
        [
            'deleteColumns',
            'afterDeleteColumns'
        ],
        'Events for DataTable.deleteColumns should be in expected order.'
    );

    registeredEvents.length = 0;
    table.clone();
    assert.deepEqual(
        registeredEvents,
        [
            'cloneTable',
            'afterCloneTable'
        ],
        'Events for DataTable.clone should be in expected order.'
    );

    registeredEvents.length = 0;
    table
        .setModifier(new SortModifier())
        .then((table) => {
            assert.deepEqual(
                registeredEvents,
                [
                    'setModifier',
                    'cloneTable',
                    'afterCloneTable',
                    'afterSetModifier'
                ],
                'Events for DataTable.setModifier should be in expected order.'
            );
            return table;
        })
        .then((table) => {
            registeredEvents.length = 0;
            return table.setModifier();
        })
        .then((table) => {
            assert.deepEqual(
                registeredEvents,
                [
                    'setModifier',
                    'afterSetModifier'
                ],
                'Events for DataTable.setModifier should be in expected order.'
            );
            return table;
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('DataTable.getRows', function (assert) {
    const table = new DataTable({ columns: { 'a': [ 0 ] } });

    const rowObject = table
        .getRowObject(undefined, ['Non-Existing Column']);

    assert.deepEqual(
        Object.keys(rowObject),
        ['Non-Existing Column'],
        'Table should return row with non-existing column.'
    );

    const cellArray = table
        .getRow(undefined, ['Non-Existing Column']);

    assert.deepEqual(
        cellArray,
        [ undefined ],
        'Table should return row with non-existing column.'
    );

});

QUnit.test('DataTable.setRows', function (assert) {
    const table = new DataTable({
            columns: {
                column1: [ true ],
                existingColumn: [ true ]
            }
        }),
        tableClone = table.clone();

    assert.strictEqual(
        tableClone.getRowCount(),
        table.getRowCount(),
        'Cloned table should have same rows length.'
    );

    tableClone.deleteRows();

    assert.deepEqual(
        tableClone.getRowCount(),
        0,
        'Clone is empty and has no rows.'
    );

    tableClone.setRows(table.getRows());

    assert.deepEqual(
        tableClone.getRow(0),
        table.getRow(0),
        'Row values are the same after clone.'
    );
});

QUnit.test('DataTable.setColumns', function (assert) {
    const table = new DataTable({
        columns: {
            x: [0, 1, 2],
            y: [3, 1, 2]
        }
    });

    let columns;

    table.setColumns({
        x: [8, 9],
        y: [0, 1]
    }, 0);

    assert.deepEqual(
        table.getColumns(),
        {
            x: [8, 9, 2],
            y: [0, 1, 2]
        },
        'Table should contain three rows of valid values.'
    );

    table.setColumns({
        x: [8, 7]
    });

    assert.deepEqual(
        table.getColumns(),
        {
            x: [8, 7],
            y: [0, 1]
        },
        'Table should contain two rows of valid values.'
    );

    table.setColumns({
        x: new Float32Array([10, 9, 8, 7, 6, 5])
    });

    columns = table.getColumns();
    
    assert.ok(
        columns.x instanceof Float32Array,
        'x column should be a Float32Array.'
    );

    assert.strictEqual(
        columns.x.length,
        6,
        'x column should contain 6 values.'
    )

    table.setColumns({
        x: [0, 1, 2]
    }, 0, void 0, true);
    columns = table.getColumns();

    assert.ok(
        columns.x instanceof Float32Array,
        'x column should stay a Float32Array when typeAsOriginal is true.'
    );

    assert.deepEqual(
        table.getColumns(void 0, false, true), // Get all columns as arrays
        {
            x: [0, 1, 2, 7, 6, 5],
            y: [0, 1, void 0, void 0, void 0, void 0]
        },
        'Table should contain six rows of valid values.'
    );

    table.setColumns({
        x: [5, 5, 5]
    }, 0);
    columns = table.getColumns();

    assert.ok(
        Array.isArray(columns.x),
        'x column should be transformed to a conventional array.'
    );

    assert.deepEqual(
        columns,
        {
            x: [5, 5, 5, 7, 6, 5],
            y: [0, 1, void 0, void 0, void 0, void 0]
        },
        'Table should be valid after x column type change.'
    );
});

QUnit.test('DataTable.setModifier', function (assert) {
    const done = assert.async(),
        modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            columns: {
                x: [0, 1, 2],
                y: [3, 1, 2]
            }
        });

    assert.deepEqual(
        table.getModified().getColumns(),
        {
            x: [0, 1, 2],
            y: [3, 1, 2]
        },
        'Modified table should contain unsorted columns.'
    );

    table
        .setModifier(modifier)
        .then((table) => {
            assert.deepEqual(
                table.getModified().getColumns(),
                {
                    x: [2, 0, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns.'
            );

            assert.deepEqual(
                [
                    table.getModified().originalRowIndexes,
                    table.getModified().localRowIndexes
                ],
                [void 0, void 0],
                'Table sorted with `orderInColumn` option should not change ' +
                'the row indexes of the original table.'
            );

            return table;
        })
        .then((table) => {
            delete modifier.options.orderInColumn;
            modifier.options.direction = 'desc';
            return table.setModifier(modifier);
        })
        .then((table) => {
            assert.deepEqual(
                table.getModified().getColumns(),
                {
                    x: [0, 2, 1],
                    y: [3, 2, 1] 
                },
                'Modified table should contain sorted columns.'
            );

            assert.strictEqual(
                table.getModified().getLocalRowIndex(1), 2,
                'Sorted table should allow to retrieve the local row index' +
                'from the original row index.'
            );

            assert.strictEqual(
                table.getModified().getOriginalRowIndex(2), 1,
                'Sorted table should allow to retrieve the original row index' +
                'from the local row index.'
            );

            table.getModified().deleteRowIndexReferences();
            assert.deepEqual(
                [
                    table.getModified().originalRowIndexes,
                    table.getModified().localRowIndexes
                ],
                [void 0, void 0],
                'The `deleteRowIndexReferences` method should remove row ' +
                'index references.'
            );
            return table;
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});

QUnit.test('DataTable.setRow insert argument', function (assert) {
    const table = new DataTable({
        columns: {
            ID: [1, 2, 3],
            Name: ['John', 'Jane', 'Alice']
        }
    });

    assert.deepEqual(
        table.getColumn('ID'),
        [1, 2, 3],
        'Initial ID column values are correct.'
    );

    // Insert a new row at position 0 (beginning)
    table.setRow({ ID: 99 }, 0, true);

    assert.deepEqual(
        table.getColumn('ID'),
        [99, 1, 2, 3],
        'New row inserted at the beginning when insert=true.'
    );

    assert.deepEqual(
        table.getColumn('Name'),
        [null, 'John', 'Jane', 'Alice'],
        'If no value is provided, the new row is filled with `null`.'
    );
});

QUnit.test('Metadata in a cloned table', function (assert) {
    // Arrange
    const table = new DataTable({
        columns: {
            ID: [1, 2, 3],
            Name: ['John', 'Jane', 'Alice']
        },
        metadata: {
            ID: {
                dataType: 'number'
            }
        }
    });

    // Act
    const tableClone = table.clone();

    // Assert
    assert.deepEqual(
        tableClone.metadata,
        table.metadata,
        'Cloned table should have the same metadata.'
    );
});
