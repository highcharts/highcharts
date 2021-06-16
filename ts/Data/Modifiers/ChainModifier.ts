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
import DataJSON from '../DataJSON.js';
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
class ChainModifier extends DataModifier<ChainModifier.Event> {

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
     *  Static Functions
     *
     * */

    /**
     * Converts a class JSON to a modifier chain. All modifier references in the
     * JSON have to be registered on call to get converted to an instance.
     *
     * @param {ChainModifier.ClassJSON} json
     * Class JSON to convert to an instance of modifier chain.
     *
     * @return {ChainModifier}
     * Modifier chain of the class JSON.
     */
    public static fromJSON(json: ChainModifier.ClassJSON): ChainModifier {
        const jsonModifiers = json.modifiers,
            modifiers: Array<DataModifier> = [];

        let modifier: (DataModifier|undefined);

        for (let i = 0, iEnd = jsonModifiers.length; i < iEnd; ++i) {
            modifier = DataJSON.fromJSON(jsonModifiers[i]) as (DataModifier|undefined);
            if (modifier) {
                modifiers.push(modifier);
            }
        }

        return new ChainModifier(json.options, ...modifiers);
    }

    /* *
     *
     *  Constructors
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
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public add(
        modifier: DataModifier,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        this.emit({
            type: 'addModifier',
            detail: eventDetail,
            modifier
        });

        this.modifiers.push(modifier);

        this.emit({
            type: 'addModifier',
            detail: eventDetail,
            modifier
        });
    }

    /**
     * Clears all modifiers from the chain.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public clear(eventDetail?: DataEventEmitter.EventDetail): void {
        this.emit({
            type: 'clearChain',
            detail: eventDetail
        });

        this.modifiers.length = 0;

        this.emit({
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
        eventDetail?: DataEventEmitter.EventDetail
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
        eventDetail?: DataEventEmitter.EventDetail
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
        eventDetail?: DataEventEmitter.EventDetail
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
     * @param {DataEventEmitter.EventDetail} [eventDetail]
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
        eventDetail?: DataEventEmitter.EventDetail
    ): T {
        const chain = this;

        chain.emit({ type: 'modify', detail: eventDetail, table });

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

        chain.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }

    /**
     * Removes a configured modifier from all positions of the modifier chain.
     *
     * @param {DataModifier} modifier
     * Configured modifier to remove.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public remove(
        modifier: DataModifier,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const modifiers = this.modifiers;

        this.emit({
            type: 'removeModifier',
            detail: eventDetail,
            modifier
        });

        modifiers.splice(modifiers.indexOf(modifier), 1);

        this.emit({
            type: 'afterRemoveModifier',
            detail: eventDetail,
            modifier
        });
    }

    /**
     * Converts the modifier chain to a class JSON, including all containing all
     * modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this modifier chain.
     */
    public toJSON(): ChainModifier.ClassJSON {
        const modifiers = this.modifiers,
            json: ChainModifier.ClassJSON = {
                $class: 'ChainModifier',
                modifiers: [],
                options: merge(this.options)
            };

        for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            json.modifiers.push(modifiers[i].toJSON());
        }

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
namespace ChainModifier {

    /**
     * Event object
     */
    export interface ChainEvent extends DataEventEmitter.Event {
        readonly type: (
            'clearChain'|'afterClearChain'|
            DataModifier.Event['type']
        );
        readonly table?: DataTable;
    }

    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataModifier.ClassJSON {
        /**
         * Class JSON of all modifiers, the chain contains.
         */
        modifiers: Array<DataModifier.ClassJSON>;
    }

    /**
     * Event information.
     */
    export type Event = (ChainEvent|ModifierEvent);

    /**
     * Event information for modifier operations.
     */
    export interface ModifierEvent extends DataEventEmitter.Event {
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
 *  Register
 *
 * */

DataJSON.addClass(ChainModifier);
DataModifier.addModifier(ChainModifier);

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        Chain: typeof ChainModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default ChainModifier;
