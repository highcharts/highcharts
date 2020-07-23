import DataRow from '/base/js/Data/DataRow.js';
import DataTable from '/base/js/Data/DataTable.js';

QUnit.test('DataTable and DataRow events', function (assert) {

    const registeredEvents = [];
    function registerEvent(e) {
        registeredEvents.push(e.type);
    }
    function registerRow(row) {
        row.on('clearRow', registerEvent);
        row.on('afterClearRow', registerEvent);
        row.on('deleteColumn', registerEvent);
        row.on('afterDeleteColumn', registerEvent);
        row.on('insertColumn', registerEvent);
        row.on('afterInsertColumn', registerEvent);
        row.on('updateColumn', registerEvent);
        row.on('afterUpdateColumn', registerEvent);
    }
    function registerTable(table) {
        table.on('clearTable', registerEvent);
        table.on('afterClearTable', registerEvent);
        table.on('deleteRow', registerEvent);
        table.on('afterDeleteRow', registerEvent);
        table.on('insertRow', registerEvent);
        table.on('afterInsertRow', registerEvent);
        table.on('afterUpdateRow', registerEvent);
        table.getAllRows().forEach(registerRow);
    }

    const dataTable = DataTable.parse([{
        id: 'a',
        text: 'text'
    }]);
    const dataRow = new DataRow({
        id: 'b',
        text: 'text'
    });

    registerTable(dataTable);
    registerRow(dataRow);

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
    dataTable.getRow('a').updateColumn('text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'updateColumn',
            'afterUpdateRow', // table gets informed first because of initial JSON
            'afterUpdateColumn',
        ],
        'Events for DataRow.updateColumn (1) should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.insertColumn('new', 'new');
    assert.deepEqual(
        registeredEvents,
        [
            'insertColumn',
            'afterInsertColumn',
            'afterUpdateRow',
        ],
        'Events DataRow.insertColumn should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.updateColumn('text', 'test');
    assert.deepEqual(
        registeredEvents,
        [
            'updateColumn',
            'afterUpdateColumn',
            'afterUpdateRow',
        ],
        'Events DataRow.updateColumn (2) should be in expected order.'
    );

    registeredEvents.length = 0;
    dataRow.deleteColumn('new');
    assert.deepEqual(
        registeredEvents,
        [
            'deleteColumn',
            'afterDeleteColumn',
            'afterUpdateRow',
        ],
        'Events DataRow.updateColumn (2) should be in expected order.'
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
        'Events DataRow.clear should be in expected order.'
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
