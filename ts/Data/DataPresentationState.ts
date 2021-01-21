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

import type DataEventEmitter from './DataEventEmitter';
import DataJSON from './DataJSON.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Contains presentation information like column order, usually in relation to a
 * DataTable instance.
 */
class DataPresentationState implements DataEventEmitter<DataPresentationState.EventObject>, DataJSON.Class {

    /**
     * Converts a supported class JSON to a DataPresentationState instance.
     *
     * @param {DataPresentationState.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataPresentationState}
     * DataPresentationState instance from the class JSON.
     */
    public static fromJSON(
        json: DataPresentationState.ClassJSON
    ): DataPresentationState {
        const presentationState = new DataPresentationState();

        if (json.columnOrder) {
            presentationState.setColumnOrder(json.columnOrder);
        }

        return presentationState;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Sorted array of column names.
     */
    private columnOrder?: Array<string>;

    /**
     * Whether the state has been changed since initialization.
     */
    protected isModified?: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Emits an event on this table to all registered callbacks of the given
     * event.
     *
     * @param {DataPresentationState.EventObject} e
     * Event object with event information.
     */
    public emit(e: DataPresentationState.EventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Returns an ordered array of column names.
     *
     * @return {Array<string>}
     * Array of column names in order.
     */
    public getColumnOrder(): Array<string> {
        return (this.columnOrder || []).slice();
    }

    /**
     * Returns a function for `Array.sort` to change the order of an array of
     * column names. Unknown column names come last.
     *
     * @return {DataPresentationState.ColumnOrderCallback}
     * Sort function to change the order.
     */
    public getColumnSorter(): DataPresentationState.ColumnOrderCallback {
        const columnOrder = (this.columnOrder || []).slice();

        if (!columnOrder.length) {
            return (): number => 0;
        }

        return (a: string, b: string): number => {
            const aIndex = columnOrder.indexOf(a),
                bIndex = columnOrder.indexOf(b);

            if (aIndex > -1 && bIndex > -1) {
                return aIndex - bIndex;
            }

            if (bIndex > -1) {
                return 1;
            }

            if (aIndex > -1) {
                return -1;
            }

            return 0;
        };
    }

    /**
     * @return {boolean}
     * Returns true, if the state was changed since initialization.
     */
    public isSet(): boolean {
        return this.isModified === true;
    }

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
    public on(
        type: DataPresentationState.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataPresentationState.EventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Sets the order of the columns.
     *
     * @param {Array<string>} columnOrder
     * Array of column names in order.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public setColumnOrder(
        columnOrder: Array<string>,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const presentationState = this,
            oldColumnOrder = (presentationState.columnOrder || []).slice(),
            newColumnOrder = columnOrder.slice();

        presentationState.emit({
            type: 'columnOrderChange',
            detail: eventDetail,
            newColumnOrder,
            oldColumnOrder
        });

        presentationState.columnOrder = newColumnOrder;
        presentationState.isModified = true;

        presentationState.emit({
            type: 'afterColumnOrderChange',
            detail: eventDetail,
            newColumnOrder,
            oldColumnOrder
        });
    }

    /**
     * Converts the presentation state to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this table.
     */
    public toJSON(): DataPresentationState.ClassJSON {
        const json: DataPresentationState.ClassJSON = {
            $class: 'DataPresentationState'
        };

        if (this.columnOrder) {
            json.columnOrder = this.columnOrder.slice();
        }

        return json;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally provided types for events and JSON conversion.
 */
namespace DataPresentationState {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Describes the class JSON of a DataPresentationState.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        columnOrder?: Array<string>;
    }

    /**
     * Event types related to the column order.
     */
    export type ColumnOrderEventType = (
        'columnOrderChange'|'afterColumnOrderChange'
    );

    /**
     * Function to sort an array of column names.
     */
    export interface ColumnOrderCallback {
        (a: string, b: string): number;
    }

    /**
     * All information objects of DataPrsentationState events.
     */
    export type EventObject = (ColumnOrderEventObject);

    /**
     * Describes the information object for order-related events.
     */
    export interface ColumnOrderEventObject extends DataEventEmitter.EventObject {
        type: ColumnOrderEventType;
        newColumnOrder: Array<string>;
        oldColumnOrder: Array<string>;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataPresentationState;
