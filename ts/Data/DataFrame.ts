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

import type DataEventEmitter from './DataEventEmitter';
import DataConverter from './DataConverter.js';
import DataJSON from './DataJSON.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    uniqueKey
} = U;

class DataFrame implements DataEventEmitter<DataFrame.EventObject>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a supported class JSON to a DataFrame instance.
     *
     * @param {DataFrame.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataFrame}
     * DataFrame instance from the class JSON.
     */
    public static fromJSON(json: DataFrame.ClassJSON): DataFrame {
        const frame = new DataFrame(json.columns, json.columnNames);

        frame.id = json.id;

        return frame;
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the DataTable class.
     *
     * @param {Array<DataFrame.ColumnValues>} [columns]
     * Array of columns with row values.
     *
     * @param {Array<string>} [columnNames]
     * Array of column names.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in column rows.
     */
    public constructor(
        columns: Array<DataFrame.ColumnValues> = [],
        columnNames: Array<string> = [],
        converter: DataConverter = new DataConverter()
    ) {
        columnNames = columnNames.slice();
        columns = columns.slice();

        for (let i = columnNames.length, iEnd = columns.length - 1; i < iEnd; ++i) {
            columnNames.push(uniqueKey());
        }

        this.converter = converter;
        this.id = uniqueKey();
        this.columnNames = columnNames;
        this.columns = columns;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Converter for value conversions in column rows.
     */
    public readonly converter: DataConverter;

    /**
     * ID of the frame. As an inner frame the ID links to the column ID in the
     * outer frame.
     */
    public id: string;

    /**
     * Array of column names.
     */
    private columnNames: Array<string>;

    /**
     * Dictionary as a record of all columns in the frame.
     */
    private columns: Array<DataFrame.ColumnValues>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Emits an event on this frame to all registered callbacks of the given
     * event.
     *
     * @param {DataFrame.EventObject} e
     * Event object with event information.
     */
    public emit(e: DataFrame.EventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Adds a row to this table.
     *
     * @param {string} columnName
     * Column to add to this frame.
     *
     * @param {ColumnValues} columnValues
     * Column to add to this frame.
     *
     * @param {DataEventEmitter.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the column has been added to the frame. Returns false,
     * if a column with the same name already exists in the frame.
     *
     * @emits DataFrame#insertRow
     * @emits DataFrame#afterInsertRow
     */
    public insertColumn(
        columnName: string,
        columnValues: DataFrame.ColumnValues = [],
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns;

        frame.emit({ type: 'insertColumn' });

        if (columnNames.indexOf(columnName) >= 0) {
            return false;
        }

        columnNames.push(columnName);
        columns.push(columnValues);

        frame.emit({ type: 'afterInsertColumn' });

        return true;
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
        type: DataFrame.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataFrame.EventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    public toJSON(): DataFrame.ClassJSON {
        const frame = this;

        return {
            $class: DataJSON.getName(DataFrame),
            columnNames: frame.columnNames.slice(),
            columns: frame.columns.slice(),
            id: frame.id
        };
    }
}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for events and JSON conversion.
 */
namespace DataFrame {

    export interface ClassJSON extends DataJSON.ClassJSON {
        columnNames: Array<string>;
        columns: Array<ColumnValues>;
        id: string;
    }

    export type ColumnValues = Array<(ClassJSON|DataJSON.Primitives)>

    export interface EventObject extends DataEventEmitter.EventObject {
        type: (
            'insertColumn'|'afterInsertColumn'
        );
    }

}

/* *
 *
 *  Export
 *
 * */

export default DataFrame;
