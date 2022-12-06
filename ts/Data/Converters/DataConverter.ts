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
 *  - Sebastian Bochan
 *  - Gøran Slettemark
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type DataStore from '../Stores/DataStore';
import type JSON from '../../Core/JSON';

import DataTable from '../DataTable.js';
import OldDataConverter from './OldDataConverter.js';
import U from '../../Core/Utilities.js';
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
 * Abstract class providing an interface and basic methods for a DataConverter
 *
 * @private
 */
abstract class DataConverter extends OldDataConverter implements DataEvent.Emitter {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: DataConverter.Options = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true,
        switchRowsAndColumns: false
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts an array of columns to a table instance. Second dimension of the
     * array are the row cells.
     *
     * @param {Array<DataTable.Column>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @return {DataTable}
     * Table instance from the arrays.
     */
    public static getTableFromColumns(
        columns: Array<DataTable.Column> = [],
        headers: Array<string> = []
    ): DataTable {
        const table = new DataTable();

        for (
            let i = 0,
                iEnd = Math.max(headers.length, columns.length);
            i < iEnd;
            ++i
        ) {
            table.setColumn(
                headers[i] || `${i}`,
                columns[i]
            );
        }

        return table;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Old DataConverter functions
     */
    public abstract readonly converter: this;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Converts a value to a boolean.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {boolean}
     * Converted value as a boolean.
     */
    public asBoolean(value: OldDataConverter.Type): boolean {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        return !!this.asNumber(value);
    }

    /**
     * Converts a value to a Date.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {globalThis.Date}
     * Converted value as a Date.
     */
    public asDate(value: OldDataConverter.Type): Date {
        let timestamp;

        if (typeof value === 'string') {
            timestamp = this.parseDate(value);
        } else if (typeof value === 'number') {
            timestamp = value;
        } else if (value instanceof Date) {
            return value;
        } else {
            timestamp = this.parseDate(this.asString(value));
        }

        return new Date(timestamp);
    }

    /**
     * Casts a string value to it's guessed type
     * @param {string} value
     * The string to examine
     *
     * @return {number|string|Date}
     * The converted value
     */
    public asGuessedType(value: string): (number|string|Date) {
        const converter = this,
            typeMap: Record<ReturnType<DataConverter['guessType']>, Function> = {
                'number': converter.asNumber,
                'Date': converter.asDate,
                'string': converter.asString
            };

        return typeMap[converter.guessType(value)].call(converter, value);
    }

    /**
     * Converts a value to a number.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {number}
     * Converted value as a number.
     */
    public asNumber(value: OldDataConverter.Type): number {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (typeof value === 'string') {
            if (value.indexOf(' ') > -1) {
                value = value.replace(/\s+/gu, '');
            }
            if (this.decimalRegex) {
                value = value.replace(this.decimalRegex, '$1.$2');
            }
            return parseFloat(value);
        }
        if (value instanceof Date) {
            return value.getDate();
        }
        if (value) {
            return value.getRowCount();
        }

        return NaN;
    }

    /**
     * Converts a value to a string.
     *
     * @param {DataConverter.Type} value
     * Value to convert.
     *
     * @return {string}
     * Converted value as a string.
     */
    public asString(value: OldDataConverter.Type): string {
        return '' + value;
    }

    /**
     * Emits an event on the DataConverter instance.
     *
     * @param {DataConverter.Event} [e]
     * Event object containing additional event data
     */
    public emit<E extends DataEvent>(e: E): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Initiates the data exporting. Should emit `exportError` on failure.
     *
     * @param {DataStore} store
     * Store to export from.
     *
     * @param {DataConverter.Options} [options]
     * Options for the export.
     */
    public abstract export(
        store: DataStore,
        options?: DataConverter.Options
    ): string;

    /**
     * Getter for the data table.
     *
     * @return {DataTable}
     */
    public abstract getTable(): DataTable;

    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.Callback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on<E extends DataEvent>(
        type: E['type'],
        callback: DataEvent.Callback<this, E>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Initiates the data parsing. Should emit `parseError` on failure.
     *
     * @param {DataConverter.Options} options
     * Options for the converter.
     */
    public abstract parse(options: DataConverter.Options): void;

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for events and conversion.
 */
namespace DataConverter {

    /**
     * The basic event object for a DataConverter instance.
     * Valid types are `parse`, `afterParse`, and `parseError`
     */
    export interface Event extends DataEvent {
        readonly type: (
            'export'|'afterExport'|'exportError'|
            'parse'|'afterParse'|'parseError'
        );
        readonly columns: Array<DataTable.Column>;
        readonly error?: (string | Error);
        readonly headers: string[];
    }

    export interface DateFormatCallbackFunction {
        (match: ReturnType<string['match']>): number;
    }

    export interface DateFormatObject {
        alternative?: string;
        parser: DateFormatCallbackFunction;
        regex: RegExp;
    }

    /**
     * The shared options for all DataConverter instances
     */
    export interface Options extends JSON.Object {
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
        firstRowAsNames: boolean;
        switchRowsAndColumns: boolean;
    }

}

export default DataConverter;
