/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type InvertModifierOptions from './InvertModifierOptions';

import DataModifier from './DataModifier.js';
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
 *
 * @private
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
    public static readonly defaultOptions: InvertModifierOptions = {
        type: 'Invert'
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the invert modifier.
     *
     * @param {Partial<InvertModifier.Options>} [options]
     * Options to configure the invert modifier.
     */
    public constructor(
        options?: Partial<InvertModifierOptions>
    ) {
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
    public options: InvertModifierOptions;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Inverts rows and columns in the table. If the given table does not have
     * defined a `modified` property, the filtering is applied in-place on the
     * original table rather than on a `modified` copy.
     *
     * @param {DataTable} table
     * Table to invert.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with inverted `modified` property as a reference or modified table,
     * if `modified` property of the original table is undefined.
     */
    public override modifyTable(
        table: DataTable,
        eventDetail?: DataEvent.Detail
    ): DataTable {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        const modified = table.getModified();

        if (table.hasColumns(['columnIds'])) { // Inverted table
            const columnIdsColumn = (
                    (table.deleteColumns(['columnIds']) || {})
                        .columnIds || []
                ),
                columns: DataTable.ColumnCollection = {},
                columnIds: Array<string> = [];

            for (let i = 0, iEnd = columnIdsColumn.length; i < iEnd; ++i) {
                columnIds.push('' + columnIdsColumn[i]);
            }

            for (
                let i = 0,
                    iEnd = table.getRowCount(),
                    row: (DataTable.Row|undefined);
                i < iEnd;
                ++i
            ) {
                row = table.getRow(i);
                if (row) {
                    columns[columnIds[i]] = row;
                }
            }

            modified.deleteColumns();
            modified.setColumns(columns);

        } else { // Regular table
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
            columns.columnIds = table.getColumnIds();

            modified.deleteColumns();
            modified.setColumns(columns);
        }

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }

}


/* *
 *
 *  Registry
 *
 * */


declare module './DataModifierType' {
    interface DataModifierTypes {
        Invert: typeof InvertModifier;
    }
}

DataModifier.registerType('Invert', InvertModifier);


/* *
 *
 *  Default Export
 *
 * */


export default InvertModifier;
