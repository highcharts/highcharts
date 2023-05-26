import DataTable from '/base/code/es-modules/Data/DataTable.js';
import SortModifier from '/base/code/es-modules/Data/Modifiers/SortModifier.js';

QUnit.test('DataTable clone', function (assert) {
    const table = new DataTable({ id: 'table' });

    table.setRows([[ 'row1', 1 ]]);
    table.setCell('1', 0, 100);
    table.setColumnAlias('x', 'x-alias');

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
        table.aliasMap,
        tableClone.aliasMap,
        'Cloned and original table should have the same aliasMap elements.'
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

QUnit.test('DataTable Column Aliases', function (assert) {
    const table = new DataTable();

    table.setColumnAlias('x', 'population');
    table.setColumnAlias('y', 'gdp');
    table.setColumnAlias('z', 'id');
    table.setColumnAlias('f', 'population');

    table.setRows([{
        id: 'My Land',
        population: 41251,
        gdp: 150
    }, {
        id: 'Your Land',
        population: 21251,
        gdp: 950
    }, {
        id: 'Our Land',
        population: new DataTable(),
        gdp: 950,
        nonexistant: 1
    }]);

    table.setColumnAlias('beta', 'nonexistant');
    assert.strictEqual(
        table.setColumnAlias('beta', 'a'),
        false,
        'Returns false when attempting to add an existing alias.'
    );

    assert.deepEqual(
        table.getColumn('x'),
        table.getColumns(['population'])['population'],
        'Table should return correct column for alias.'
    );

    table.setColumnAlias('population', 'gdp')
    assert.deepEqual(
        table.getColumn('population'),
        table.getColumn('gdp'),
        'Table should prioritize alias.'
    );

    table.deleteColumnAlias('population');
    assert.notDeepEqual(
        table.getColumn('population'),
        table.getColumn('gdp'),
        'Table should return canonical name, after alias is removed.'
    );

    table.setCell('population', table.getRowIndexBy('id', 'Our Land'), 4),
    assert.strictEqual(
        table.getCell('population', table.getRowIndexBy('id', 'Our Land')),
        4,
        'Table should set cell value for column name.'
    );
    table.setCell('x', table.getRowIndexBy('id', 'Our Land'), 10),
    assert.strictEqual(
        table.getCell('x', table.getRowIndexBy('id', 'Our Land')),
        10,
        'Table should set cell value for column alias.'
    );
    assert.strictEqual(
        table.getCell('population', table.getRowIndexBy('id', 'Our Land')),
        table.getCell('x', table.getRowIndexBy('id', 'Our Land')),
        'Table should return cell value for column name and alias.'
    );

    table.setRows(
        [{
            id: 'All Land',
            population: 4
        }],
        table.getRowIndexBy('id', 'All Land')
    );
    assert.strictEqual(
        table.getRowIndexBy('id', 'All Land'),
        3,
        'Table should insert a new row with cell values.'
    )

    // Insert new column with two cells more than the current row count
    const colArray = [
        'Tourmalet',
        'Du Fromage',
        'des Montagnes',
        'Ventoux',
        'Grand Cucheron',
        'des Aravis'
    ];

    table.setColumn('Cols', colArray);

    assert.strictEqual(
        table.getRowCount(),
        colArray.length,
        'Table should count inserted rows.'
    );

    assert.ok(
        table.deleteColumns(['Cols']),
        'Table should have deleted column. (1)'
    );

    assert.strictEqual(
        typeof table.getColumns(['Cols']).Cols,
        'undefined',
        'Table should have deleted column. (2)'
    );

    const expectedValues = table.getColumns(['population']);
    assert.deepEqual(
        table.deleteColumns(['population']),
        expectedValues,
        'Table should return cell values of deleted column.'
    );

    assert.strictEqual(
        typeof table.getColumn('population'),
        'undefined',
        'Table should have removed column "population".'
    )

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
        table.renameColumn('column1', 'newColumn'),
        'Table should move cells of a column to a new column.'
    );
    assert.deepEqual(
        table.getColumns(['column1', 'newColumn']),
        { newColumn: [true] },
        'Table should only return renamed column.'
    );

    // Force move
    assert.ok(
        table.renameColumn('newColumn', 'existingColumn'),
        'Table should move cell of a column to an existing column (with force).'
    );
    assert.deepEqual(
        table.getColumns(['newColumn', 'existingColumn']),
        { existingColumn: [true] }
    );

    // Force move following alias
    table.setColumn('newColumn', []);
    table.setColumnAlias('existingColumnAlias', 'newEmptyColumn');

    assert.ok(
        table.renameColumn('existingColumn', 'existingColumnAlias'),
        'Table should rename column to an alias.'
    );
    assert.deepEqual(
        table.getColumns([ 'existingColumn', 'existingColumnAlias' ]),
        { existingColumnAlias: [ true ] },
        'Table should retrieve only renamed column.'
    );

    // fail when trying to move an non existing column
    table.setColumn('existingColumn', [ true ])

    assert.notOk(
        table.renameColumn('nonexistant', 'existingColumn'),
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
        'DataTable should contain two row.'
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

QUnit.test('DataTable.getCellAsNumber', function (assert) {
    const table = new DataTable({
        columns: {
            A: [false, true, -1, 0, 1, NaN, '', '0', 'a', null, ,void 0 ]
        }
    });

    assert.strictEqual(
        table.getRowCount(),
        12,
        'Table should contain 12 rows.'
    );

    assert.deepEqual(
        [
            table.getCellAsNumber('A', 0),
            table.getCellAsNumber('A', 0, true),
            table.getCellAsNumber('A', 1),
            table.getCellAsNumber('A', 1, true)
        ],
        [0, 0, 1, 1],
        'Table should return boolean as number.'
    );

    assert.deepEqual(
        [
            table.getCellAsNumber('A', 2),
            table.getCellAsNumber('A', 2, true),
            table.getCellAsNumber('A', 3),
            table.getCellAsNumber('A', 3, true),
            table.getCellAsNumber('A', 4),
            table.getCellAsNumber('A', 4, true)
        ],
        [-1, -1, 0, 0, 1, 1],
        'Table should return number.'
    );

    assert.strictEqual(
        table.getCellAsNumber('A', 5),
        null,
        'Table should return NaN as null by default.'
    );

    assert.ok(
        isNaN(table.getCellAsNumber('A', 5, true)),
        'Table should return NaN on request.'
    );

    assert.deepEqual(
        [
            table.getCellAsNumber('A', 6),
            table.getCellAsNumber('A', 6, true),
            table.getCellAsNumber('A', 7),
            table.getCellAsNumber('A', 7, true),
            table.getCellAsNumber('A', 8),
            table.getCellAsNumber('A', 8, true)
        ],
        [null, NaN, 0, 0, null, NaN],
        'Table should return string as number or null.'
    );

    assert.ok(
        isNaN(table.getCellAsNumber('A', 9, true)),
        'Table should return null as NaN on request.'
    );

    assert.ok(
        isNaN(table.getCellAsNumber('A', 10, true)),
        'Table should return undefined cell as NaN on request.'
    );

    assert.ok(
        isNaN(table.getCellAsNumber('A', 11, true)),
        'Table should return undefined as NaN on request.'
    );

});

QUnit.test('DataTable.getColumnAsNumbers', function (assert) {
    const table = new DataTable({
        columns: {
            test1: [null, 1, 2],
            test2: [void 0, 1, 2],
            test3: [null, 1, '2'],
            test4: [0, null, 2],
            test5: ['0', 1, null],
            test6: [null, '1', 2],
            test7: [void 0, '1', 2]
        }
    });

    assert.deepEqual(
        table.getColumnAsNumbers('test1'),
        [null, 1, 2],
        'Table should return column "test1" without conversion.'
    );

    assert.deepEqual(
        table.getColumnAsNumbers('test2'),
        [void 0, 1, 2],
        'Table should return column "test2" without conversion.'
    );

    assert.deepEqual(
        table.getColumnAsNumbers('test3'),
        [null, 1, '2'],
        'Table should return column "test3" without conversion.'
    );

    assert.deepEqual(
        table.getColumnAsNumbers('test4'),
        [0, null, 2],
        'Table should return column "test4" without conversion.'
    );

    assert.deepEqual(
        table.getColumnAsNumbers('test5'),
        [0, 1, null],
        'Table should return column "test5" after conversion.'
    );

    assert.deepEqual(
        table.getColumnAsNumbers('test6'),
        [null, 1, 2],
        'Table should return column "test6" after conversion.'
    );

    assert.deepEqual(
        table.getColumnAsNumbers('test7'),
        [null, 1, 2],
        'Table should return column "test7" after conversion. (#1)'
    );

    assert.ok(
        isNaN(table.getColumnAsNumbers('test7', true)[0]),
        'Table should return column "test7" after conversion. (#2)'
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
        table.modified.getColumns(),
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
                table.modified.getColumns(),
                {
                    x: [2, 0, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns.'
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
                table.modified.getColumns(),
                {
                    x: [0, 2, 1],
                    y: [3, 2, 1] 
                },
                'Modified table should contain sorted columns.'
            )
            return table;
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});
