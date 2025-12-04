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
