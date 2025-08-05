/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {string} columnId
     * Column id of changed cell.
     *
     * @param {number|undefined} rowIndex
     * Row index of changed cell.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Changed cell value.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyCell<T extends DataTable>(
        table: T,
        columnId: string,
        rowIndex: number,
        cellValue: DataTable.CellType,
        eventDetail?: DataEvent.Detail
    ): T {
        const modified = table.getModified(),
            modifiedRowIndex = modified.getRowIndexBy('columnIds', columnId);

        if (typeof modifiedRowIndex === 'undefined') {
            modified.setColumns(
                this.modifyTable(table.clone()).getColumns(),
                void 0,
                eventDetail
            );
        } else {
            modified.setCell(
                `${rowIndex}`,
                modifiedRowIndex,
                cellValue,
                eventDetail
            );
        }

        return table;
    }

    /**
     * Applies partial modifications of column changes to the property
     * `modified` of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Changed columns as a collection, where the keys are the column names.
     *
     * @param {number} [rowIndex=0]
     * Index of the first changed row.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyColumns<T extends DataTable>(
        table: T,
        columns: DataTable.ColumnCollection,
        rowIndex: number,
        eventDetail?: DataEvent.Detail
    ): T {
        const modified = table.getModified(),
            modifiedColumnIds = (modified.getColumn('columnIds') || []);

        let columnIds = table.getColumnIds(),
            reset = (table.getRowCount() !== modifiedColumnIds.length);

        if (!reset) {
            for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
                if (columnIds[i] !== modifiedColumnIds[i]) {
                    reset = true;
                    break;
                }
            }
        }

        if (reset) {
            return this.modifyTable(table, eventDetail);
        }

        columnIds = Object.keys(columns);

        for (
            let i = 0,
                iEnd = columnIds.length,
                column: DataTable.Column,
                columnId: string,
                modifiedRowIndex: (number|undefined);
            i < iEnd;
            ++i
        ) {
            columnId = columnIds[i];
            column = columns[columnId];
            modifiedRowIndex = (
                modified.getRowIndexBy('columnIds', columnId) ||
                modified.getRowCount()
            );

            for (
                let j = 0,
                    j2 = rowIndex,
                    jEnd = column.length;
                j < jEnd;
                ++j, ++j2
            ) {
                modified.setCell(
                    `${j2}`,
                    modifiedRowIndex,
                    column[j],
                    eventDetail
                );
            }
        }

        return table;
    }

    /**
     * Applies partial modifications of row changes to the property `modified`
     * of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {Array<(Highcharts.DataTableRow|Highcharts.DataTableRowObject)>} rows
     * Changed rows.
     *
     * @param {number} [rowIndex]
     * Index of the first changed row.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyRows<T extends DataTable>(
        table: T,
        rows: Array<(DataTable.Row|DataTable.RowObject)>,
        rowIndex: number,
        eventDetail?: DataEvent.Detail
    ): T {
        const columnIds = table.getColumnIds(),
            modified = table.getModified(),
            modifiedColumnIds = (modified.getColumn('columnIds') || []);

        let reset = (table.getRowCount() !== modifiedColumnIds.length);

        if (!reset) {
            for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
                if (columnIds[i] !== modifiedColumnIds[i]) {
                    reset = true;
                    break;
                }
            }
        }

        if (reset) {
            return this.modifyTable(table, eventDetail);
        }

        for (
            let i = 0,
                i2 = rowIndex,
                iEnd = rows.length,
                row: (DataTable.Row|DataTable.RowObject);
            i < iEnd;
            ++i, ++i2
        ) {
            row = rows[i];

            if (Array.isArray(row)) {
                modified.setColumn(`${i2}`, row);
            } else {
                for (let j = 0, jEnd = columnIds.length; j < jEnd; ++j) {
                    modified.setCell(
                        `${i2}`,
                        j,
                        row[columnIds[j]],
                        eventDetail
                    );
                }
            }
        }

        return table;
    }

    /**
     * Inverts rows and columns in the table.
     *
     * @param {DataTable} table
     * Table to invert.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with inverted `modified` property as a reference.
     */
    public modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: DataEvent.Detail
    ): T {
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
