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
 *  Imports
 *
 * */

import DataJSON from './DataJSON';

/* *
 *
 *  Interface
 *
 * */

/**
 * Describes methods to attach callbacks to events of a class instance.
 */
declare interface DataEventEmitter<TEventObject extends DataEventEmitter.EventObject> {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Registered events managed by Highcharts utility functions.
     */
    hcEvents?: Record<TEventObject['type'], Array<DataEventEmitter.EventCallback<this, TEventObject>>>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Emits an event on the class instance to all registered callbacks of this
     * event.
     *
     * @param {DataEventEmitter.EventObject} e
     * Event object containing additonal event information.
     */
    emit(e: TEventObject): void;

    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function;

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
    export interface EventCallback<TScope, TEventObject extends EventObject> {
        /**
         *
         * @param this
         * Event scope pointing to the class instance, where the event happens.
         *
         * @param e
         * Event object with additional event information.
         */
        (this: TScope, e: TEventObject): void;
    }

    /**
     * Custom information for an event object.
     */
    export type EventDetail = DataJSON.JSONObject;

    /**
     * Event object with additional event information. This interface can be
     * extended by implementing classes.
     */
    export interface EventObject {

        /**
         * Additional meta information regarding the event.
         */
        readonly detail?: EventDetail;

        /**
         * Event type as a string.
         */
        readonly type: ('test'|string);
    }
}

/* *
 *
 *  Export
 *
 * */

export default DataEventEmitter;
