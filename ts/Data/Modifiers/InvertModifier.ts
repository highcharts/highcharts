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
     * Inverts rows and columns in the table.
     *
     * @param {DataTable} table
     * Table to invert.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Inverted table as a reference.
     */
    public modify(
        table: DataTable,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this;

        modifier.emit({ type: 'execute', detail: eventDetail, table });

        if (table.hasColumn('columnNames')) { // inverted table
            const columnNames: Array<string> = (
                    table.deleteColumn('columnNames') || []
                ).map(
                    (column): string => `${column}`
                ),
                columns: DataTable.ColumnCollection = {};

            for (
                let i = 0,
                    iEnd = table.getRowCount(),
                    row: (DataTable.Row|undefined);
                i < iEnd;
                ++i
            ) {
                row = table.getRow(i);
                if (row) {
                    columns[columnNames[i]] = row;
                }
            }

            table.clear();
            table.setColumns(columns);

        } else { // regular table
            const columns: DataTable.ColumnCollection = {};

            for (
                let i = 0,
                    iEnd = table.getRowCount(),
                    row: (DataTable.Row|undefined);
                i < iEnd;
                ++i
            ) {
                row = table.getRow(i);
                if (row) {
                    columns[`${i}`] = row;
                }
            }
            columns.columnNames = table.getColumnNames();

            table.clear();
            table.setColumns(columns);
        }

        modifier.emit({ type: 'afterExecute', detail: eventDetail, table });

        return table;
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
