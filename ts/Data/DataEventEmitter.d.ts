/* *
 *
 *  (c) 2020-2022 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type JSON from '../Core/JSON';

/* *
 *
 *  Interface
 *
 * */

/**
 * Describes methods to attach callbacks to events of a class instance.
 */
declare interface DataEventEmitter {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Registered events managed by Highcharts utility functions.
     */
    hcEvents?: DataEventEmitter.HCEventsCollection<DataEventEmitter.Event>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Emits an event on the class instance to all registered callbacks of this
     * event.
     *
     * @param {DataEventEmitter.Event} e
     * Event object containing additonal event information.
     */
    emit(e: DataEventEmitter.Event): void;

    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.Callback} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    on<TEvent extends DataEventEmitter.Event>(
        type: TEvent['type'],
        callback: DataEventEmitter.Callback<this, DataEventEmitter.Event>
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
    export interface Callback<TScope, TEventObject extends Event> {
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
    export type Detail = JSON.Object;

    /**
     * Event object with additional event information. This interface can be
     * extended by implementing classes.
     */
    export interface Event {

        /**
         * Additional meta information regarding the event.
         */
        readonly detail?: Detail;

        /**
         * Event type as a string.
         */
        readonly type: string;

    }

    /** @internal */
    export interface HCEventObject<TEventObject extends Event> {
        fn: DataEventEmitter.Callback<unknown, TEventObject>;
        order?: number;
    }

    /** @internal */
    export type HCEvents<TEventObject extends Event> = (
        Array<HCEventObject<TEventObject>>
    );

    /** @internal */
    export type HCEventsCollection<TEventObject extends Event> = (
        Record<TEventObject['type'], HCEvents<TEventObject>>
    );

}

/* *
 *
 *  Export
 *
 * */

export default DataEventEmitter;
