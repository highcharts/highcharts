import DataParser from '/base/js/Data/Parsers/DataParser.js';
import DataSeriesConverter from '/base/js/Data/DataSeriesConverter.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import OldTownTable from '/base/js/Data/OldTownTable.js';

QUnit.test('OldTownTable and OldTownTableRow events', function (assert) {

    const registeredEvents = [];

    /** @param {OldTownTableRow.CellEventObject|OldTownTable.RowEventObject} e */
    function registerEvent(e) {
        registeredEvents.push(e.type);
    }

    /** @param {OldTownTableRow} row */
    function registerTableRow(row) {
        row.on('clearRow', registerEvent);
        row.on('afterClearRow', registerEvent);
        row.on('deleteCell', registerEvent);
        row.on('afterDeleteCell', registerEvent);
        row.on('setCell', registerEvent);
        row.on('afterSetCell', registerEvent);
        row.on('afterChangeRow', registerEvent);
    }

    /** @param {OldTownTable} table */
    function registerTable(table) {
        table.on('clearTable', registerEvent);
        table.on('afterClearTable', registerEvent);
        table.on('deleteRow', registerEvent);
        table.on('afterDeleteRow', registerEvent);
        table.on('insertRow', registerEvent);
        table.on('afterInsertRow', registerEvent);
        table.on('afterUpdateRow', registerEvent);
        table.getAllRows().forEach(registerTableRow);
    }

    const dataTable = OldTownTable.fromJSON({
        $class: 'OldTownTable',
        rows: [{
            $class: 'OldTownTableRow',
            id: 'a',
            text: 'text'
        }]
    });
    const dataRow = new OldTownTableRow({
        $class: 'OldTownTableRow',
        id: 'b',
        text: 'text'
    });

    registerTable(dataTable);
    registerTableRow(dataRow);

    registeredEvents.length = 0;
    dataTable.insertRow(dataRow);
    assert.deepEqual(
        registeredEvents,
        [
            'insertRow',
            'afterInsertRow',
        ],
        'Events for OldTownTable.insertRow should be in expected order.'
    );

    registeredEvents.length = 0;
    dataTable.getRow('a').setCell('text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'afterSetCell',
            'afterUpdateRow', // table gets informed first because of initial JSON
            'afterChangeRow',
        ],
        'Events for OldTownTableRow.setCell (1) should be in expected order.'
    );

    registeredEvents.length = 0;
    assert.strictEqual(
        dataTable.getRowCount(),
        2,
        'Table should contain two rows.'
    );
    dataTable.deleteRow('a');
    assert.strictEqual(
        dataTable.getRowCount(),
        1,
        'Table should contain one row.'
    );
    assert.deepEqual(
        registeredEvents,
        [
            'deleteRow',
            'afterDeleteRow'
        ],
        'Events for OldTownTableRow.deleteRow should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.setCell('new', 'new');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'afterSetCell',
            'afterChangeRow',
            'afterUpdateRow',
        ],
        'Events for OldTownTableRow.setCell (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.setCell('text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'setCell',
            'afterSetCell',
            'afterChangeRow',
            'afterUpdateRow',
        ],
        'Events for OldTownTableRow.setCell (3) should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.deleteCell('new');
    assert.deepEqual(
        registeredEvents,
        [
            'deleteCell',
            'afterDeleteCell',
            'afterChangeRow',
            'afterUpdateRow',
        ],
        'Events for OldTownTableRow.deleteCell should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.clear();
    assert.deepEqual(
        registeredEvents,
        [
            'clearRow',
            'afterClearRow',
            'afterChangeRow',
            'afterUpdateRow',
        ],
        'Events for OldTownTableRow.clear should be in expected order.'
    );

    registeredEvents.length = 0;
    dataTable.replaceRow(dataRow, new OldTownTableRow());
    assert.deepEqual(
        registeredEvents,
        [
            'deleteRow',
            'afterDeleteRow',
            'insertRow',
            'afterInsertRow'
        ],
        'Events for OldTownTableRow.replaceRow should be in expected order.'
    );

    registeredEvents.length = 0;
    dataTable.clear();
    assert.deepEqual(
        registeredEvents,
        [
            'clearTable',
            'afterClearTable'
        ],
        'Events for OldTownTable.clear should be in expected order.'
    );

});

QUnit.test('OldTownTable JSON support', function (assert) {

    const json = {
        $class: 'OldTownTable',
        rows: [{
            $class: 'OldTownTableRow',
            id: 'a',
            column1: 'value1',
            column2: 0.0002,
            column3: false
        }, {
            $class: 'OldTownTableRow',
            id: 'b',
            column1: 'value1',
            column2: 'value2',
            column3: {
                $class: 'OldTownTable',
                rows: [{
                    $class: 'OldTownTableRow',
                    id: 'ba',
                    column1: 'value1'
                }, {
                    $class: 'OldTownTableRow',
                    id: 'bb',
                    column1: 'value1'
                }, {
                    $class: 'OldTownTableRow',
                    id: 'bc',
                    column1: 'value1'
                }]
            }
        }, {
            $class: 'OldTownTableRow',
            id: 'c',
            column1: 'value1',
            column2: 'value2',
            column3: 'value3'
        }]
    };

    const table = OldTownTable.fromJSON(json);

    const rowA = table.getRow('a');
    const rowB = table.getRow('b');
    const rowC = table.getRow('c');

    assert.deepEqual(
        [
            table.getRowCount(),
            rowA && rowA.id,
            rowB && rowB.id,
            rowC && rowC.id,
        ], [
        3,
        'a',
        'b',
        'c',
    ],
        'Table should contain three rows.'
    );

    assert.deepEqual(
        rowA && rowA.getAllCells(),
        {
            'column1': 'value1',
            'column2': 0.0002,
            'column3': false
        },
        'First row should contain three columns.'
    );

    const tableB3 = rowB.getCell('column3');
    const rowBA = tableB3.getRow('ba');
    const rowBB = tableB3.getRow('bb');
    const rowBC = tableB3.getRow('bc');

    assert.deepEqual(
        [
            tableB3.getRowCount(),
            rowBA && rowBA.id,
            rowBB && rowBB.id,
            rowBC && rowBC.id,
        ], [
        3,
        'ba',
        'bb',
        'bc',
    ],
        'Inner table should contain three rows.'
    );

    assert.deepEqual(
        table.toJSON(),
        json,
        'Exported JSON of table should be equal to imported JSON.'
    );

});

QUnit.test('OldTownTable.getColumns', function (assert) {

    const table = new OldTownTable([
            new OldTownTableRow({
                id: 'a',
                column1: 'value1',
                column2: 0.0002,
                column3: false
            }),
            OldTownTableRow.NULL,
            new OldTownTableRow({
                id: 'b',
                column1: 'value1',
                column2: 'value2',
                column3: new OldTownTable([
                    new OldTownTableRow({
                        id: 'ba',
                        column1: 'value1'
                    }),
                    new OldTownTableRow({
                        id: 'bb',
                        column1: 'value1'
                    }),
                    new OldTownTableRow({
                        id: 'bc',
                        column1: 'value1'
                    })
                ])
            })
        ]);

    const columns = table.getColumns();

    assert.deepEqual(
        Object.keys(columns),
        ['id', 'column1', 'column2', 'column3'],
        'Result has correct column names'
    );

    Object
        .values(columns)
        .forEach(column => assert.strictEqual(
            column.length,
            3,
            'Result has correct amount of column values'
        ));

});

QUnit.test('OldTownTable column methods', function (assert) {
    const table = new OldTownTable();

    table.aliasMap = {
        'x': 'population',
        'y': 'gdp',
        'z': 'id',
        'f': 'population'
    }

    table.insertRow(OldTownTableRow.fromJSON({
        $class: 'OldTownTableRow',
        id: 'Norway',
        population: 41251,
        gdp: 150
    }))

    table.insertRow(OldTownTableRow.fromJSON({
        $class: 'OldTownTableRow',
        id: 'Sweden',
        population: 21251,
        gdp: 950
    }))

    table.insertRow(OldTownTableRow.fromJSON({
        $class: 'OldTownTableRow',
        id: 'Finland',
        population: (new OldTownTable()).toJSON(),
        gdp: 950,
        nonexistant: 1
    }));

    table.createColumnAlias('nonexistant', 'beta')
    assert.strictEqual(
        table.createColumnAlias('a', 'beta'),
        false,
        'Returns false when attempting to add an existing alias'
    );

    assert.deepEqual(
        table.getColumn('x'),
        table.getColumns(['population'])['population'],
        'OldTownTable should return correct rows for alias.'
    );

    table.createColumnAlias('gdp', 'population')
    assert.deepEqual(
        table.getColumn('population'),
        table.getColumn('gdp'),
        'OldTownTable should prioritize alias.'
    );

    table.deleteColumnAlias('population');
    assert.notDeepEqual(
        table.getColumn('population'),
        table.getColumn('gdp'),
        'After alias is removed, getColumns should get canonical name.'
    );

    assert.ok(
        table.setRowCell('Finland', 'population', 4),
        'Able to set by column name'
    );
    assert.ok(
        table.setRowCell('Finland', 'x', 10),
        'Able to set by column alias'
    );
    assert.strictEqual(
        table.getRowCell('Finland', 'population'),
        table.getRowCell('Finland', 'x'),
        'Able to get by both column name and alias, values are the same'
    );

    assert.ok(
        table.setRowCell('Iceland', 'population', 4),
        'Able to insert cell with new row ID'
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
        'New rows should be inserted'
    );

    assert.ok(
        table.deleteColumn('Cols'),
        'Deleting existing column returns true'
    );

    assert.notOk(
        table.getColumn('Cols'),
        'Column "Cols" should be deleted.'
    );

    const expectedValues = table.getColumn('population');
    assert.deepEqual(
        table.removeColumn('population'),
        expectedValues,
        'RemoveColumn retrieves the same values as getColumns'
    );

    assert.notOk(
        table.getColumn('population'),
        'Column "population" should be removed.'
    )

});

QUnit.test('OldTownTable.renameColumn', function (assert) {

    const table = new OldTownTable();

    table.insertRow(new OldTownTableRow({
        column1: true,
        existingColumn: true
    }));

    // Move
    assert.ok(
        table.renameColumn('column1', 'newColumn'),
        'OldTownTable should move cells of a column to a new column.'
    );
    assert.deepEqual(
        table.getColumns(['column1', 'newColumn']),
        { newColumn: [true] },
        'OldTownTable should only return renamed column.'
    );

    // Force move
    assert.ok(
        table.renameColumn('newColumn', 'existingColumn', true),
        'OldTownTable should move cell of a column to an existing column (with force).'
    );
    assert.deepEqual(
        table.getColumns(['newColumn', 'existingColumn']),
        { existingColumn: [true] }
    );

    // Force move following alias
    table.setColumn('newColumn', []);
    table.createColumnAlias('newEmptyColumn', 'existingColumnAlias');

    assert.ok(
        table.renameColumn('existingColumn', 'existingColumnAlias', true, true),
        'OldTownTable should be able to move the cells of a column to an existing column (by alias with force).'
    );
    assert.deepEqual(
        table.getColumns(['existingColumnAlias', 'existingColumn']),
        { existingColumnAlias: [ true ] }
    );

    // fail when trying to move an non existing column
    table.setColumn('existingColumn', [true])

    assert.notOk(
        table.renameColumn('nonexistant', 'existingColumn'),
        'OldTownTable should fail when trying to move a non-existant column.'
    );
    assert.deepEqual(
        table.getColumns(['nonexistant', 'existingColumn']),
        { existingColumn: [true] }
    );

    assert.notOk(
        table.renameColumn('existingColumn', 'existingColumn'),
        'OldTownTable should fail when trying to move an existing column without force.'
    );

    assert.notOk(
        table.renameColumn('id', 'newIDColumn'),
        'OldTownTable should fail when trying to move a column with the name "id".'
    );
    assert.notOk(
        table.getColumn('newIDColumn'),
        'OldTownTable should fail when trying to move a column with the name "id".'
    );

    assert.notOk(
        table.renameColumn('existingColumn', 'id'),
        'OldTownTable should fail when trying to move a column with the name "id".'
    );
    assert.deepEqual(
        table.getColumns(['existingColumn', 'id']),
        {
            existingColumn: [true],
            id: table.getColumn('id'),
        }
    );
});

QUnit.test('OldTownTable.clone', function (assert) {

    const dataSeriesConverter = new DataSeriesConverter(undefined, {
        columnMap: { y: 'y-test' }
    });

    const table = new OldTownTable([], dataSeriesConverter);
    const row = new OldTownTableRow({ id: 'row1', x: 1 });

    table.insertRow(row);
    table.setRowCell('row1', 'x', 100);
    table.createColumnAlias('x', 'x-alias');

    table.on('deleteRow', function () { console.log('row removed 1!'); });
    table.on('deleteRow', function () { console.log('row removed 2!'); });
    table.on('afterDeleteRow', function () { console.log('row removed 3!'); });

    const tableClone = table.clone();

    assert.notStrictEqual(
        table,
        tableClone,
        'Cloned table should be a new OldTownTable instance.'
    );

    assert.strictEqual(
        table.converter,
        tableClone.converter,
        'Cloned and original table should have the same DataSeriesConverter reference.'
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


QUnit.test('OldTownTable.setTableRows', function (assert) {

    const originalTable = new OldTownTable();

    originalTable.insertRow(new OldTownTableRow({
        column1: true,
        existingColumn: true
    }));

    const newTable = originalTable.clone();

    assert.strictEqual(
        newTable.rows.length,
        0,
        'Cloned table should have rows length of 0'
    );

    newTable.insertRows(originalTable.getAllRows());

    assert.deepEqual(
        newTable.rows,
        originalTable.rows,
        'Rows are the same after copy'
    );


    assert.deepEqual(
        newTable.rowsIdMap,
        originalTable.rowsIdMap,
        'Row id map is the same after copy'
    );

});
