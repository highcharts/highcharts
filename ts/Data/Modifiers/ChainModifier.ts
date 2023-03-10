/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
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

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Modifies a table with the help of modifiers in an ordered chain.
 *
 * @private
 */
class ChainModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default option for the ordered modifier chain.
     */
    public static readonly defaultOptions: ChainModifier.Options = {
        modifier: 'Chain',
        reverse: false
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the modifier chain.
     *
     * @param {DeepPartial<ChainModifier.Options>} [options]
     * Options to configure the modifier chain.
     *
     * @param {...DataModifier} [modifiers]
     * Modifiers in order for the modifier chain.
     */
    public constructor(
        options?: DeepPartial<ChainModifier.Options>,
        ...modifiers: Array<DataModifier>
    ) {
        super();

        this.modifiers = modifiers;
        this.options = merge(ChainModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Ordered modifiers.
     */
    public readonly modifiers: Array<DataModifier>;

    /**
     * Options of the modifier chain.
     */
    public readonly options: ChainModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds a configured modifier to the end of the modifier chain. Please note,
     * that the modifier can be added multiple times.
     *
     * @param {DataModifier} modifier
     * Configured modifier to add.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     */
    public add(
        modifier: DataModifier,
        eventDetail?: DataEvent.Detail
    ): void {
        this.emit<ChainModifier.Event>({
            type: 'addModifier',
            detail: eventDetail,
            modifier
        });

        this.modifiers.push(modifier);

        this.emit<ChainModifier.Event>({
            type: 'addModifier',
            detail: eventDetail,
            modifier
        });
    }

    /**
     * Clears all modifiers from the chain.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     */
    public clear(eventDetail?: DataEvent.Detail): void {
        this.emit<ChainModifier.Event>({
            type: 'clearChain',
            detail: eventDetail
        });

        this.modifiers.length = 0;

        this.emit<ChainModifier.Event>({
            type: 'afterClearChain',
            detail: eventDetail
        });
    }

    /**
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * *Note:* The `modified` property of the table gets replaced.
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
     * Table with `modified` property as a reference.
     */
    public modifyCell<T extends DataTable>(
        table: T,
        columnName: string,
        rowIndex: number,
        cellValue: DataTable.CellType,
        eventDetail?: DataEvent.Detail
    ): T {
        const modifiers = (
            this.options.reverse ?
                this.modifiers.reverse() :
                this.modifiers
        );

        if (modifiers.length) {
            let clone = table.clone();

            for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
                modifiers[i].modifyCell(
                    clone,
                    columnName,
                    rowIndex,
                    cellValue,
                    eventDetail
                );
                clone = clone.modified;
            }

            table.modified = clone;
        }

        return table;
    }

    /**
     * Applies partial modifications of column changes to the property
     * `modified` of the given table.
     *
     * *Note:* The `modified` property of the table gets replaced.
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
        const modifiers = (
            this.options.reverse ?
                this.modifiers.reverse() :
                this.modifiers.slice()
        );

        if (modifiers.length) {
            let clone = table.clone();

            for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
                modifiers[i].modifyColumns(
                    clone,
                    columns,
                    rowIndex,
                    eventDetail
                );
                clone = clone.modified;
            }

            table.modified = clone;
        }

        return table;
    }

    /**
     * Applies partial modifications of row changes to the property `modified`
     * of the given table.
     *
     * *Note:* The `modified` property of the table gets replaced.
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
        const modifiers = (
            this.options.reverse ?
                this.modifiers.reverse() :
                this.modifiers.slice()
        );

        if (modifiers.length) {
            let clone = table.clone();

            for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
                modifiers[i].modifyRows(
                    clone,
                    rows,
                    rowIndex,
                    eventDetail
                );
                clone = clone.modified;
            }

            table.modified = clone;
        }

        return table;
    }

    /**
     * Applies several modifications to the table.
     *
     * *Note:* The `modified` property of the table gets replaced.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table as a reference.
     *
     * @emits ChainDataModifier#execute
     * @emits ChainDataModifier#afterExecute
     */
    public modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: DataEvent.Detail
    ): T {
        const chain = this;

        chain.emit<ChainModifier.Event>({
            type: 'modify',
            detail: eventDetail,
            table
        });

        const modifiers = (
            chain.options.reverse ?
                chain.modifiers.reverse() :
                chain.modifiers.slice()
        );

        let modified = table.modified;

        for (
            let i = 0,
                iEnd = modifiers.length,
                modifier: DataModifier;
            i < iEnd;
            ++i
        ) {
            modifier = modifiers[i];
            modified = modifier.modifyTable(modified).modified;
        }

        table.modified = modified;

        chain.emit<ChainModifier.Event>({
            type: 'afterModify',
            detail: eventDetail,
            table
        });

        return table;
    }

    /**
     * Removes a configured modifier from all positions in the modifier chain.
     *
     * @param {DataModifier} modifier
     * Configured modifier to remove.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     */
    public remove(
        modifier: DataModifier,
        eventDetail?: DataEvent.Detail
    ): void {
        const modifiers = this.modifiers;

        this.emit<ChainModifier.Event>({
            type: 'removeModifier',
            detail: eventDetail,
            modifier
        });

        modifiers.splice(modifiers.indexOf(modifier), 1);

        this.emit<ChainModifier.Event>({
            type: 'afterRemoveModifier',
            detail: eventDetail,
            modifier
        });
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace ChainModifier {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event object
     */
    export interface ChainEvent extends DataEvent {
        readonly type: (
            'clearChain'|'afterClearChain'|
            DataModifier.Event['type']
        );
        readonly table?: DataTable;
    }

    /**
     * Event information.
     */
    export type Event = (ChainEvent|ModifierEvent);

    /**
     * Event information for modifier operations.
     */
    export interface ModifierEvent extends DataEvent {
        readonly type: (
            'addModifier'|'afterAddModifier'|
            'removeModifier'|'afterRemoveModifier'
        );
        readonly modifier: DataModifier;
    }

    /**
     * Options to configure the modifier.
     */
    export interface Options extends DataModifier.Options {
        /**
         * Whether to revert the order before execution.
         */
        reverse: boolean;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataModifier.registerType(ChainModifier);

declare module './DataModifierType' {
    interface DataModifierTypes {
        Chain: typeof ChainModifier;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ChainModifier;
