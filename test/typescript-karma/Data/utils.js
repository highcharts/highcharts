
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