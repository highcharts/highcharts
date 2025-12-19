/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Dawid Dragula
 *
 * */

/* *
 *
 *  Interface
 *
 * */

/**
 * The event object to pass to a callback.
 */
interface DataEvent {

    /**
     * Additional event detail
     */
    detail?: DataEventDetail;

    /**
     * The event type
     */
    type: string;

}

/**
 * Describes the callbacks expected types. This generic interface can be
 * extended by implementing classes.
 */
export interface DataEventCallback<T, E extends DataEvent> {
    /**
     *
     * @param this
     * Event scope pointing to the class instance, where the event happens.
     *
     * @param e
     * Event object with additional event information.
     */
    (this: T, e: E): void;
}

/**
 * Additional detail of the event object.
 */
export type DataEventDetail =
    Record<string, (boolean|number|string|null|undefined)>;

/**
 * Describes methods to attach callbacks to events of a class instance.
 */
export interface DataEventEmitter<E extends DataEvent> {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Registered events managed by Highcharts utility functions.
     */
    hcEvents?: DataEventHCEventsCollection;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Emits an event on the class instance to all registered callbacks of
     * this event.
     *
     * @param e
     * Event object containing additional event information.
     */
    emit(e: E): void;

    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventCallback} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    on<T extends E['type']>(
        type: T,
        callback: DataEventCallback<this, Extract<E, { type: T }>>
    ): Function;

}

/**
 * Object to manage an event.
 */
export interface DataEventHCEventObject {
    fn: DataEventCallback<unknown, DataEvent>;
    order?: number;
}

/**
 * Collection of events managed by Highcharts utility functions.
 */
export type DataEventHCEventsCollection = (
        Record<string, Array<DataEventHCEventObject>>
    );

/* *
 *
 *  Interface Namespace
 *
 * */
namespace DataEvent {
    /** @deprecated */
    export type Callback<T, E extends DataEvent> = DataEventCallback<T, E>;
    /** @deprecated */
    export type Detail = DataEventDetail;
    /** @deprecated */
    export type Emmitter<E extends DataEvent = DataEvent> = DataEventEmitter<E>;
    /** @deprecated */
    export type HCEventObject = DataEventHCEventObject;
    /** @deprecated */
    export type HCEventsCollection = DataEventHCEventsCollection;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataEvent;
