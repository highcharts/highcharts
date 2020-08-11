/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Interface
 *
 * */

/**
 * Describes methods to attach callbacks to events of a class instance.
 */
declare interface DataEventEmitter {

    /**
     * Emits an event on the class instance to all registered callbacks of this
     * event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventObject} [e]
     * Event object with additional event information.
     */
    emit(type: string, e?: DataEventEmitter.EventObject): void;

    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callack
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    on(type: string, callback: DataEventEmitter.EventCallback): Function;

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally some generic types for the event object and the event callback
 * are available.
 */
declare namespace DataEventEmitter {

    /**
     * Describes the callbacks expected types. This generic interface can be
     * extended by implementing classes.
     */
    export interface EventCallback {
        /**
         *
         * @param this
         * Event scope pointing to the class instance, where the event happens.
         *
         * @param e
         * Event object with additional event information.
         */
        (this: DataEventEmitter, e: DataEventEmitter.EventObject): void;
    }

    /**
     * Event object with additional event information. This interface can be
     * extended by implementing classes.
     */
    export interface EventObject {
        /**
         * Event type as a string.
         */
        readonly type?: string;
    }
}

/* *
 *
 *  Export
 *
 * */

export default DataEventEmitter;
