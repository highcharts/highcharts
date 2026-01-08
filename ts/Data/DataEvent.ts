/* *
 *
 *  (c) 2009-2026 Highsoft AS
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
    detail?: DataEvent.Detail;

    /**
     * The event type
     */
    type: string;

}

/* *
 *
 *  Interface Namespace
 *
 * */

/**
 * Additional types for the event object and the event callback.
 */
namespace DataEvent {

    /**
     * Describes the callbacks expected types. This generic interface can be
     * extended by implementing classes.
     */
    export interface Callback<T, E extends DataEvent> {
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
    export type Detail = Record<string, (boolean|number|string|null|undefined)>;

    /**
     * Describes methods to attach callbacks to events of a class instance.
     */
    export interface Emitter<E extends DataEvent> {

        /* *
         *
         *  Properties
         *
         * */

        /**
         * Registered events managed by Highcharts utility functions.
         */
        hcEvents?: HCEventsCollection;

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
         * @param {DataEvent.Callback} callback
         * Function to register for an event callback.
         *
         * @return {Function}
         * Function to unregister callback from the event.
         */
        on<T extends E['type']>(
            type: T,
            callback: Callback<this, Extract<E, { type: T }>>
        ): Function;

    }

    /**
     * Object to manage an event.
     */
    export interface HCEventObject {
        fn: Callback<unknown, DataEvent>;
        order?: number;
    }

    /**
     * Collection of events managed by Highcharts utility functions.
     */
    export type HCEventsCollection = (
        Record<string, Array<HCEventObject>>
    );

}

/* *
 *
 *  Default Export
 *
 * */

export default DataEvent;
