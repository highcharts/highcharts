import DataTable from '/base/js/Data/DataTable.js';

QUnit.test('DataTable Clone', function (assert) {

    const table = new DataTable({});

    table.setRow([ 'row1', 1 ]);
    table.setCell(0, '1', 100);
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

    table.setRowObjects([{
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

    assert.ok(
        table.setCell(table.getRowIndexBy('id', 'Our Land'), 'population', 4),
        'Table should set cell value for column name.'
    );
    assert.ok(
        table.setCell(table.getRowIndexBy('id', 'Our Land'), 'x', 10),
        'Table should set cell value for column alias.'
    );
    assert.strictEqual(
        table.setCell(table.getRowIndexBy('id', 'Our Land'), 'population'),
        table.setCell(table.getRowIndexBy('id', 'Our Land'), 'x'),
        'Table should return cell value for column name and alias.'
    );

    assert.ok(
        table.setRowObject(
            {
                id: 'All Land',
                population: 4
            },
            table.getRowIndexBy('id', 'All Land')
        ),
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
        table.deleteColumn('Cols'),
        'Table should have deleted column. (1)'
    );

    assert.notOk(
        table.getColumn('Cols'),
        'Table should have deleted column. (2)'
    );

    const expectedValues = table.getColumn('population');
    assert.deepEqual(
        table.deleteColumn('population'),
        expectedValues,
        'Table should return cell values of deleted column.'
    );

    assert.notOk(
        table.getColumn('population'),
        'Table should remove column "population".'
    )

});

QUnit.test('DataTable Column Rename', function (assert) {

    const table = new DataTable({
        column1: [ true ],
        existingColumn: [ true ]
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
    });

    const columns = table.getColumns();

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

    const registeredEvents = [];

    /** @param {DataTable.EventObject} e */
    function registerEvent(e) {
        registeredEvents.push(e.type);
    }

    /** @param {DataTable} table */
    function registerTable(table) {
        table.on('clearTable', registerEvent);
        table.on('afterClearTable', registerEvent);
        table.on('clearRows', registerEvent);
        table.on('afterClearRows', registerEvent);
        table.on('cloneTable', registerEvent);
        table.on('afterCloneTable', registerEvent);
        table.on('clearColumn', registerEvent);
        table.on('afterClearColumn', registerEvent);
        table.on('deleteColumn', registerEvent);
        table.on('afterDeleteColumn', registerEvent);
        table.on('deleteRow', registerEvent);
        table.on('afterDeleteRow', registerEvent);
        table.on('setCell', registerEvent);
        table.on('afterSetCell', registerEvent);
        table.on('setColumn', registerEvent);
        table.on('afterSetColumn', registerEvent);
        table.on('setRow', registerEvent);
        table.on('afterSetRow', registerEvent);
    }

    const table = new DataTable({
        id: [ 'a' ],
        text: [ 'text' ]
    });

    registerTable(table);

    registeredEvents.length = 0;
    table.setRow(['b', 'text']);
    table.setRowObject({
        id: 'c',
        text: 'text'
    });
    assert.deepEqual(
        registeredEvents,
        [
            'setRow',
            'afterSetRow',
            'setRow',
            'afterSetRow',
        ],
        'Events for DataTable.setRow and DataTable.setRowObject should be in expected order.'
    );

    registeredEvents.length = 0;
    table.setCell(table.getRowIndexBy('id', 'a'), 'text', 'test');
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
        'Frame should contain three rows.'
    );
    table.deleteRow(0);
    assert.strictEqual(
        table.getRowCount(),
        2,
        'Frame should contain two row.'
    );
    assert.deepEqual(
        registeredEvents,
        [
            'deleteRow',
            'afterDeleteRow'
        ],
        'Events for DataTable.deleteRow should be in expected order.'
    );

    registeredEvents.length = 0;
    table.setColumn('new', [ 'new' ]);
    assert.deepEqual(
        registeredEvents,
        [
            'setColumn',
            'afterSetColumn'
        ],
        'Events for DataTable.setColumn should be in expected order.'
    );

    registeredEvents.length = 0;
    table.setCell(0, 'text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'afterSetCell'
        ],
        'Events for DataTable.setCell (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    table.deleteColumn('new');
    assert.deepEqual(
        registeredEvents,
        [
            'deleteColumn',
            'afterDeleteColumn'
        ],
        'Events for DataTable.deleteColumn should be in expected order.'
    );

    registeredEvents.length = 0;
    table.clear();
    assert.deepEqual(
        registeredEvents,
        [
            'clearTable',
            'afterClearTable'
        ],
        'Events for DataTable.clear should be in expected order.'
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

});

QUnit.test('DataTable JSON', function (assert) {

    const json = {
        $class: 'DataTable',
        columns: {
            A: [ 'a0', 'a1', 'a2'],
            B: [ 0.0002, 'b1', 'b2'],
            C: [
                false,
                {
                    $class: 'DataTable',
                    columns: {
                        CA: [ 'ca0', 'ca1', 'ca2' ]
                    },
                    id: 'table2'
                },
                'c2'
            ]
        },
        id: 'table1'
    };

    const table = DataTable.fromJSON(json);

    assert.strictEqual(
        table.getRowCount(),
        3,
        'Table should contain three rows.'
    );

    assert.deepEqual(
        table.getRow(0),
        [
            'a0',
            0.0002,
            false
        ],
        'First row should contain three columns.'
    );

    const tableC1 = table.getColumn('C')[1];

    assert.deepEqual(
        tableC1.getColumn('CA'),
        [ 'ca0', 'ca1', 'ca2' ],
        'Inner table should contain three rows.'
    );

    assert.deepEqual(
        table.toJSON(),
        json,
        'Exported JSON of table should be equal to imported JSON.'
    );

});

QUnit.test('DataTable.setRows', function (assert) {

    const table = new DataTable({
        column1: [ true ],
        existingColumn: [ true ]
    });

    const tableClone = table.clone();

    assert.strictEqual(
        tableClone.getRowCount(),
        table.getRowCount(),
        'Cloned table should have same rows length.'
    );

    tableClone.clearRows();

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
