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

import type DataEventEmitter from '../DataEventEmitter';
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * Modifies a table with the help of modifiers in an ordered chain.
 */
class ChainDataModifier extends DataModifier<ChainDataModifier.EventObject> {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default option for the ordered modifier chain.
     */
    public static readonly defaultOptions: ChainDataModifier.Options = {
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
     * @param {ChainDataModifier.ClassJSON} json
     * Class JSON to convert to an instance of modifier chain.
     *
     * @return {ChainDataModifier}
     * Modifier chain of the class JSON.
     */
    public static fromJSON(json: ChainDataModifier.ClassJSON): ChainDataModifier {
        const jsonModifiers = json.modifiers,
            modifiers: Array<DataModifier> = [];

        let modifier: (DataModifier|undefined);

        for (let i = 0, iEnd = jsonModifiers.length; i < iEnd; ++i) {
            modifier = DataJSON.fromJSON(jsonModifiers[i]) as (DataModifier|undefined);
            if (modifier) {
                modifiers.push(modifier);
            }
        }

        return new ChainDataModifier(json.options, ...modifiers);
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Constructs an instance of the modifier chain.
     *
     * @param {DeepPartial<ChainDataModifier.Options>} [options]
     * Options to configure the modifier chain.
     *
     * @param {...DataModifier} [modifiers]
     * Modifiers in order for the modifier chain.
     */
    public constructor(
        options?: DeepPartial<ChainDataModifier.Options>,
        ...modifiers: Array<DataModifier>
    ) {
        super();

        const completeOptions = merge(ChainDataModifier.defaultOptions, options);

        this.modifiers = modifiers;
        this.options = completeOptions;
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
    public readonly options: ChainDataModifier.Options;

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
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     */
    public add(
        modifier: DataModifier,
        eventDetail?: Record<string, string>
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
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     */
    public clear(eventDetail?: Record<string, string>): void {
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
     * Applies modifications to the table rows and returns a new table with the
     * modified rows.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     *
     * @emits ChainDataModifier#execute
     * @emits ChainDataModifier#afterExecute
     */
    public execute(
        table: DataTable,
        eventDetail?: Record<string, string>
    ): DataTable {
        const modifiers = (
            this.options.reverse ?
                this.modifiers.reverse() :
                this.modifiers.slice()
        );

        let modifier: DataModifier;

        this.emit({
            type: 'execute',
            detail: eventDetail,
            table
        });

        for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            modifier = modifiers[i];

            this.emit({
                type: 'executeModifier',
                detail: eventDetail,
                modifier
            });

            table = modifier.execute(table);

            this.emit({
                type: 'afterExecuteModifier',
                detail: eventDetail,
                modifier
            });
        }

        this.emit({
            type: 'afterExecute',
            detail: eventDetail,
            table
        });

        return table;
    }

    /**
     * Removes a configured modifier from all positions of the modifier chain.
     *
     * @param {DataModifier} modifier
     * Configured modifier to remove.
     *
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     */
    public remove(
        modifier: DataModifier,
        eventDetail?: Record<string, string>
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
    public toJSON(): ChainDataModifier.ClassJSON {
        const modifiers = this.modifiers,
            json: ChainDataModifier.ClassJSON = {
                $class: 'ChainDataModifier',
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
namespace ChainDataModifier {

    /**
     * Event object
     */
    export interface ChainEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'clearChain'|'afterClearChain'|
            DataModifier.EventObject['type']
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
    export type EventObject = (ChainEventObject|ModifierEventObject);

    /**
     * Event information for modifier operations.
     */
    export interface ModifierEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'addModifier'|'afterAddModifier'|
            'executeModifier'|'afterExecuteModifier'|
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

DataJSON.addClass(ChainDataModifier);
DataModifier.addModifier(ChainDataModifier);

declare module './Types' {
    interface DataModifierTypeRegistry {
        Chain: typeof ChainDataModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default ChainDataModifier;
