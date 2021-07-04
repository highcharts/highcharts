
/**
 * Register store events, also optionally do a test on the event type
 * @param {DataStore} datastore
 * @param {} assertObj QUnit assert
 */

export function registerStoreEvents(datastore, eventArray, assertObj = {}) {
    const eventTypes = ['afterLoad', 'load', 'loadError'];
    eventTypes.forEach(eventType => {
        datastore.on(eventType, (e) => {
            eventArray.push(e.type)
            if (Object.keys(assertObj).length) {
                assertObj.strictEqual(e.type, eventType, `Event has correct type: ${eventType}`);
            }
        });
    })
}

/**
 * Utility function for comparing an exported store with the original
 *
 * @todo deeper comparisons?
 *
 * @param {DataTable} originalTable
 * @param {DataTable} exportedTable
 * @param {*} assert QUnit assert object
 */
export function testExportedDataTable(originalTable, exportedTable, assert) {
    assert.strictEqual(
        exportedTable.getRowCount(),
        originalTable.getRowCount(),
        'Exported ClassJSON should have the same amount of rows.'
    )
    assert.strictEqual(
        exportedTable.getColumnNames().length,
        originalTable.getColumnNames().length,
        'Exported ClassJSON should have the same amount of cells.'
    )
}