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
import DataJSON from './../DataJSON.js';
import DataTable from './../DataTable.js';
import U from './../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 */
class SeriesPointsModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options for the series points modifier.
     */
    public static readonly defaultOptions: SeriesPointsModifier.Options = {
        modifier: 'SeriesPoints'
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a class JSON to a series points modifier.
     *
     * @param {SeriesPointsModifier.ClassJSON} json
     * Class JSON to convert to an instance of series points modifier.
     *
     * @return {SeriesPointsModifier}
     * Series points modifier of the class JSON.
     */
    public static fromJSON(json: SeriesPointsModifier.ClassJSON): SeriesPointsModifier {
        return new SeriesPointsModifier(json.options);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the series points modifier.
     *
     * @param {SeriesPointsModifier.Options} [options]
     * Options to configure the series points modifier.
     */
    public constructor(options?: DeepPartial<SeriesPointsModifier.Options>) {
        super();

        this.options = merge(SeriesPointsModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the series points modifier.
     */
    public options: SeriesPointsModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Renames columns to alternative column names (alias) depending on mapping
     * option.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table as a reference.
     */
    public modify(
        table: DataTable,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this,
            aliasMap = modifier.options.aliasMap || {},
            aliases = Object.keys(aliasMap);

        this.emit({ type: 'modify', detail: eventDetail, table });

        for (let i = 0, iEnd = aliases.length, alias: string; i < iEnd; ++i) {
            alias = aliases[i];
            table.renameColumn(aliasMap[alias], alias);
        }

        this.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }


    /**
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {string} columnName
     * Column name of changed cell.
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
     * Modified table as a reference.
     */
    public modifyCell(
        table: DataTable,
        columnName: string,
        rowIndex: number,
        cellValue: DataTable.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        table.modified.setColumns(
            this.modify(table.clone()).getColumns(),
            void 0,
            eventDetail
        );
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
     * Modifier table as a reference.
     */
    public modifyColumns(
        table: DataTable,
        columns: DataTable.ColumnCollection,
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        table.modified.setColumns(
            this.modify(table.clone()).getColumns(),
            void 0,
            eventDetail
        );
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
     * Modified table as a reference.
     */
    public modifyRows(
        table: DataTable,
        rows: Array<(DataTable.Row|DataTable.RowObject)>,
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        table.modified.setColumns(
            this.modify(table.clone()).getColumns(),
            void 0,
            eventDetail
        );
        return table;
    }

    /**
     * Converts the series points modifier to a class JSON,
     * including all containing all modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this series points modifier.
     */
    public toJSON(): SeriesPointsModifier.ClassJSON {
        const json = {
            $class: 'SeriesPointsModifier',
            options: merge(this.options)
        };

        return json;
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
namespace SeriesPointsModifier {

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
        aliasMap?: Record<string, string>;
    }
}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(SeriesPointsModifier);
DataModifier.addModifier(SeriesPointsModifier);

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        SeriesPoints: typeof SeriesPointsModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default SeriesPointsModifier;
