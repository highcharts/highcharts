import DataTableRow from '/base/js/Data/DataTableRow.js';
import DataTable from '/base/js/Data/DataTable.js';

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
