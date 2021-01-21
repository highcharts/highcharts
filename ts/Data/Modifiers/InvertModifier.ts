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
import DataTableRow from '../DataTableRow.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    defined
} = U;

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
     * Create new DataTable with inverted rows and columns.
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
            newTable = new DataTable(),
            columns = table.getColumns(),
            newRowIds = Object.keys(columns),
            oldRowsLength = table.getRowCount();

        let oldRow: (DataTableRow|undefined),
            newCells: Record<string, DataTableRow.CellType>,
            newRow: (DataTableRow|undefined),
            rowCell: (DataTableRow.CellType|undefined);

        modifier.emit({ type: 'execute', detail: eventDetail, table });

        for (let i = 0, iEnd = newRowIds.length; i < iEnd; i++) {
            if (newRowIds[i] !== 'id') {
                newCells = {
                    id: newRowIds[i]
                };

                for (let j = 0; j < oldRowsLength; j++) {
                    oldRow = table.getRow(j);
                    rowCell = oldRow && oldRow.getCell(newRowIds[i]);

                    if (defined(rowCell) && oldRow && oldRow.id) {
                        newCells[oldRow.id] = rowCell;
                    }
                }

                newRow = new DataTableRow(newCells);
                newTable.insertRow(newRow);
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
