import DataTableRow from '/base/js/Data/DataTableRow.js';
import DataTable from '/base/js/Data/DataTable.js';
import DataSeriesConverter from '/base/js/Data/DataSeriesConverter.js';

QUnit.test('DataTable and DataTableRow events', function (assert) {

    const registeredEvents = [];

    /** @param {DataTableRow.CellEventObject|DataTable.RowEventObject} e */
    function registerEvent(e) {
        registeredEvents.push(e.type);
    }

    /** @param {DataTableRow} row */
    function registerTableRow(row) {
        row.on('clearRow', registerEvent);
        row.on('afterClearRow', registerEvent);
        row.on('deleteCell', registerEvent);
        row.on('afterDeleteCell', registerEvent);
        row.on('insertCell', registerEvent);
        row.on('afterInsertCell', registerEvent);
        row.on('updateCell', registerEvent);
        row.on('afterUpdateCell', registerEvent);
    }

    /** @param {DataTable} table */
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

    const dataTable = DataTable.fromJSON({
        $class: 'DataTable',
        rows: [{
            $class: 'DataTableRow',
            id: 'a',
            text: 'text'
        }]
    });
    const dataRow = new DataTableRow({
        $class: 'DataTableRow',
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
        'Events for DataTable.insertRow should be in expected order.'
    );

    registeredEvents.length = 0;
    dataTable.getRow('a').updateCell('text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'updateCell',
            'afterUpdateRow', // table gets informed first because of initial JSON
            'afterUpdateCell',
        ],
        'Events for DataTableRow.updateCell (1) should be in expected order.'
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
        'Events for DataTableRow.deleteRow should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.insertCell('new', 'new');
    assert.deepEqual(
        registeredEvents,
        [
            'insertCell',
            'afterInsertCell',
            'afterUpdateRow',
        ],
        'Events DataTableRow.insertCell should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.updateCell('text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'updateCell',
            'afterUpdateCell',
            'afterUpdateRow',
        ],
        'Events DataTableRow.updateCell (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.deleteCell('new');
    assert.deepEqual(
        registeredEvents,
        [
            'deleteCell',
            'afterDeleteCell',
            'afterUpdateRow',
        ],
        'Events DataTableRow.updateCell (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.clear();
    assert.deepEqual(
        registeredEvents,
        [
            'clearRow',
            'afterClearRow',
            'afterUpdateRow',
        ],
        'Events DataTableRow.clear should be in expected order.'
    );

    registeredEvents.length = 0;
    dataTable.clear();
    assert.deepEqual(
        registeredEvents,
        [
            'clearTable',
            'afterClearTable'
        ],
        'Events DataTable.clear should be in expected order.'
    );

});

QUnit.test('DataTable JSON support', function (assert) {

    const json = {
        $class: 'DataTable',
        rows: [{
            $class: 'DataTableRow',
            id: 'a',
            column1: 'value1',
            column2: 0.0002,
            column3: false
        }, {
            $class: 'DataTableRow',
            id: 'b',
            column1: 'value1',
            column2: 'value2',
            column3: {
                $class: 'DataTable',
                rows: [{
                    $class: 'DataTableRow',
                    id: 'ba',
                    column1: 'value1'
                }, {
                    $class: 'DataTableRow',
                    id: 'bb',
                    column1: 'value1'
                }, {
                    $class: 'DataTableRow',
                    id: 'bc',
                    column1: 'value1'
                }]
            }
        }, {
            $class: 'DataTableRow',
            id: 'c',
            column1: 'value1',
            column2: 'value2',
            column3: 'value3'
        }]
    };

    const table = DataTable.fromJSON(json);

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

QUnit.test('DataTable.toColumns', function (assert) {

    const table = DataTable.fromJSON({
        $class: 'DataTable',
        rows: [{
            $class: 'DataTableRow',
            id: 'a',
            column1: 'value1',
            column2: 0.0002,
            column3: false
        }, {
            $class: 'DataTableRow',
            id: 'b',
            column1: 'value1',
            column2: 'value2',
            column3: {
                $class: 'DataTable',
                rows: [{
                    $class: 'DataTableRow',
                    id: 'ba',
                    column1: 'value1'
                }, {
                    $class: 'DataTableRow',
                    id: 'bb',
                    column1: 'value1'
                }, {
                    $class: 'DataTableRow',
                    id: 'bc',
                    column1: 'value1'
                }]
            }
        }]
    });

    const columns = table.toColumns();

    assert.deepEqual(
        Object.keys(columns),
        ['id', 'column1', 'column2', 'column3'],
        'Result has correct column names'
    );

    Object.keys(columns).forEach(key => {
        const column = columns[key];
        assert.strictEqual(
            column.length,
            2,
            'Result has correct amount of column values'
        );
    });

});

QUnit.test('DataTable column methods', function (assert) {
    const table = new DataTable();

    table.aliasMap = {
        'x': 'population',
        'y': 'gdp',
        'z': 'id',
        'f': 'population'
    }

    table.insertRow(DataTableRow.fromJSON({
        $class: 'DataTableRow',
        id: 'Norway',
        population: 41251,
        gdp: 150
    }))

    table.insertRow(DataTableRow.fromJSON({
        $class: 'DataTableRow',
        id: 'Sweden',
        population: 21251,
        gdp: 950
    }))

    table.insertRow(DataTableRow.fromJSON({
        $class: 'DataTableRow',
        id: 'Finland',
        population: (new DataTable()).toJSON(),
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
        table.getColumns('x'),
        [table.toColumns()['population']],
        'Alias retrieves correct columns'
    );

    table.createColumnAlias('gdp', 'population')
    assert.deepEqual(
        table.getColumns('population'),
        [table.toColumns()['gdp']],
        'Column alias is prioritized'
    );

    table.removeColumnAlias('population');
    assert.deepEqual(
        table.getColumns('population'),
        [table.toColumns()['population']],
        'After alias is removed, getColumns gets by canonical name'
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
        table.deleteColumn('Cols'),
        'Trying to delete again returns false'
    );

    assert.notOk(
        table.deleteColumn('noexistantcolumnname'),
        'Deleting column that does not exist returns false'
    );

    assert.notOk(
        table.getColumns('Cols')[0],
        'The column is deleted'
    );

    const expectedValues = table.getColumns('population')[0];
    assert.deepEqual(
        table.removeColumn('population'),
        expectedValues,
        'RemoveColumn retrieves the same values as getColumns'
    );

    assert.notOk(
        table.getColumns('population')[0],
        'the column is removed'
    )

});

QUnit.test('DataTable.renameColumn', function (assert) {

    const table = new DataTable();

    table.insertRow(new DataTableRow({
        column1: true,
        existingColumn: true
    }));

    // Move
    assert.ok(
        table.renameColumn('column1', 'newColumn'),
        'is able to move the contents of one column to a new column'
    );
    assert.deepEqual(table.getColumns('column1', 'newColumn'), [undefined, [true]]);

    // Force move
    assert.ok(
        table.renameColumn('newColumn', 'existingColumn', true),
        'is able to move the contents from one column to an existing column (with force)'
    );
    assert.deepEqual(table.getColumns('newColumn', 'existingColumn'), [undefined, [true]]);

    // Force move following alias
    table.setColumn('newColumn', []);
    table.createColumnAlias('newEmptyColumn', 'existingColumnAlias');

    assert.ok(table.renameColumn('existingColumn', 'existingColumnAlias', true, true),
        'is able to move the contents from one column to an existing column by an alias'
    );
    assert.deepEqual(table.getColumns('existingColumnAlias', 'existingColumn'), [[true], undefined]);

    // fail when trying to move an non existing column
    table.setColumn('existingColumn', [true])

    assert.notOk(
        table.renameColumn('nonexistant', 'existingColumn'),
        'fails when trying to move a non-existant column'
    );
    assert.deepEqual(table.getColumns('nonexistant', 'existingColumn'), [undefined, [true]]);

    assert.notOk(
        table.renameColumn('existingColumn', 'existingColumn'),
        'fails when trying to move an existing column without force'
    );

    assert.notOk(
        table.renameColumn('id', 'newIDColumn'),
        'fails when trying to move a column with the name `id`'
    );
    assert.deepEqual(table.getColumns('newIDColumn'), [undefined]);

    assert.notOk(
        table.renameColumn('existingColumn', 'id'),
        'fails when trying to move a column with the name `id`'
    );
    assert.notDeepEqual(table.getColumns('id'), [true]);

});

QUnit.test('DataTable.toColumns with missing cells', function (assert) {

    const table = new DataTable();

    table.insertRow(new DataTableRow(
        {
            id: 'Row1',
            column1: 'value',
            column3: 'value'
        }
    ))
    table.insertRow(new DataTableRow(
        {
            id: 'Row2',
            column3: 'value'
        }
    ))
    table.insertRow(new DataTableRow(
        {
            id: 'Row3',
            column4: 'value'
        }
    ))
    table.insertRow(new DataTableRow(
        {
            id: 'Row4',
            column1: 'value',
            column3: 'value'
        }
    ))
    const columns = table.toColumns();

    assert.deepEqual(columns['id'], ['Row1', 'Row2', 'Row3', 'Row4']);
    assert.deepEqual(columns['column1'], ['value', undefined, undefined, 'value']);
    assert.deepEqual(columns['column3'], ['value', 'value', undefined, 'value']);
    assert.deepEqual(columns['column4'], [undefined, undefined, 'value', undefined]);

});

QUnit.test('DataTable.clone', function (assert) {

    const dataSeriesConverter = new DataSeriesConverter(undefined, {
        columnMap: { y: 'y-test' }
    });

    const table = new DataTable([], dataSeriesConverter);
    const row = new DataTableRow({ id: 'row1', x: 1 });

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
        'Cloned table should be a new DataTable instance.'
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
