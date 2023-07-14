/* *
 *
 *  Functions
 *
 * */

/**
 * Register connector events, also optionally do a test on the event type
 * @param {DataConnector} dataConnector
 * @param {} assertObj QUnit assert
 */
export function registerConnectorEvents(
    dataConnector,
    eventArray,
    assertObj = {}
) {
    ['afterLoad', 'load', 'loadError'].forEach(eventType => {
        dataConnector.on(eventType, (e) => {
            eventArray.push(e.type)
            if (Object.keys(assertObj).length) {
                assertObj.strictEqual(
                    e.type,
                    eventType,
                    `Event should be of type "${eventType}". (${e.type})`
                );
            }
        });
    })
}

/**
 * Utility function for comparing an exported connector with the original
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