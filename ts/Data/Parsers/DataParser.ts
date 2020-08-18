/* *
 *
 *  Data module
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

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';
import type DataTable from '../DataTable';
import type DataValueType from '../DataValueType';
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
 * Abstract class providing an interface and basic methods for a DataParser
 */
abstract class DataParser<TEventObject extends DataParser.EventObject>
implements DataEventEmitter<TEventObject>, DataJSON.Class {

    /**
     * Default options
     */
    protected static readonly defaultOptions: DataParser.Options = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true,
        switchRowsAndColumns: false
    };
    /* *
     *
     *  Functions
     *
     * */

    /**
     * Getter for the data table
     * @return {DataTable}
     */
    public abstract getTable(): DataTable;

    /**
     * Emits an event on the DataParser instance.
     *
     * @param {DataParser.EventObject} [e]
     * Event object containing additional event data
     */
    public emit(e: TEventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific parser event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Initiates the data parsing. Should emit `parseError` on failure.
     *
     * @param {DataParser.Options} options
     * Options for the parser.
     */
    public abstract parse(options: DataParser.Options): void;

    /**
     * Converts the class instance to ClassJSON
     *
     * @return {DataJSON.ClassJSON}
     */
    public abstract toJSON(): DataJSON.ClassJSON;

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataParser {

    /**
     * The basic event object for a DataParser instance.
     * Valid types are `parse`, `afterParse`, and `parseError`
     */
    export interface EventObject extends DataEventEmitter.EventObject {
        readonly type: ('parse' | 'afterParse' | 'parseError');
        readonly columns: DataValueType[][];
        readonly error?: (string | Error);
        readonly headers: string[];
    }

    /**
     * The shared options for all DataParser instances
     */
    export interface Options extends DataJSON.Object {
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
        firstRowAsNames: boolean;
        switchRowsAndColumns: boolean;
    }

}

export default DataParser;
