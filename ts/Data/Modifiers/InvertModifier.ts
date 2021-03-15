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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';

import DataModifier from './DataModifier.js';
import DataJSON from '../DataJSON.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Inverts columns and rows in a table.
 */
class InvertModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options for the invert modifier.
     */
    public static readonly defaultOptions: InvertModifier.Options = {
        modifier: 'InvertModifier'
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a class JSON to a invert modifier.
     *
     * @param {InvertModifier.ClassJSON} json
     * Class JSON to convert to an instance of invert modifier.
     *
     * @return {InvertModifier}
     * Series points modifier of the class JSON.
     */
    public static fromJSON(json: InvertModifier.ClassJSON): InvertModifier {
        return new InvertModifier(json.options);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the invert modifier.
     *
     * @param {InvertModifier.Options} [options]
     * Options to configure the invert modifier.
     */
    public constructor(options?: DeepPartial<InvertModifier.Options>) {
        super();

        this.options = merge(InvertModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the invert modifier.
     */
    public options: InvertModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates a new table with inverted rows and columns.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     */
    public execute(
        table: DataTable,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this,
            columns = table.getColumns(),
            newTable = table.clone(true);

        if (columns.column) { // inverted table
            const column = columns.column;

            for (let i = 0, iEnd = column.length; i < iEnd; ++i) {
                newTable.setColumn(`${column[i]}`);
            }

            delete columns.column;
            const columnNames = Object.keys(columns);

            for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                newTable.setRow(columns[columnNames[i]]);
            }

        } else { // regular table
            for (let i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
                newTable.setColumn(`${i}`);
            }
            newTable.setColumn('column');

            const columnNames = Object.keys(columns);

            for (
                let i = 0,
                    iEnd = columnNames.length,
                    columnName: string;
                i < iEnd;
                ++i
            ) {
                columnName = columnNames[i];
                newTable.setRow([...columns[columnName], columnName]);
            }

        }

        modifier.emit({ type: 'afterExecute', detail: eventDetail, table: newTable });

        return newTable;
    }

    /**
     * Converts the invert modifier to a class JSON,
     * including all containing all modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this invert modifier.
     */
    public toJSON(): InvertModifier.ClassJSON {
        return {
            $class: 'InvertModifier',
            options: merge(this.options)
        };
    }
}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace InvertModifier {

    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataModifier.ClassJSON {
        // nothing here yet
    }

    /**
     * Options to configure the modifier.
     */
    export interface Options extends DataModifier.Options {
        // nothing here yet
    }
}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(InvertModifier);
DataModifier.addModifier(InvertModifier);

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        Invert: typeof InvertModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default InvertModifier;
