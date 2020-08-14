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

import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

class ChainDataModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: ChainDataModifier.Options = {
        modifier: 'Chain',
        reverse: false
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: ChainDataModifier.ClassJSON): ChainDataModifier {
        const jsonModifiers = json.modifiers,
            modifiers: Array<DataModifier> = [];

        for (let i = 0, iEnd = jsonModifiers.length; i < iEnd; ++i) {
            modifiers.push(DataJSON.fromJSON(jsonModifiers[i]) as DataModifier);
        }

        return new ChainDataModifier(json.options, ...modifiers);
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options?: DeepPartial<ChainDataModifier.Options>,
        ...modifiers: Array<DataModifier>
    ) {
        super();

        const completeOptions = merge(ChainDataModifier.defaultOptions, options);

        this.modifiers = completeOptions.reverse ? modifiers.reverse() : modifiers;
        this.options = completeOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly modifiers: Array<DataModifier>;

    public readonly options: ChainDataModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    public add(modifier: DataModifier): void {
        this.modifiers.push(modifier);
    }

    public clear(): void {
        this.modifiers.length = 0;
    }

    public execute(table: DataTable): DataTable {
        const modifiers = this.modifiers.slice();

        this.emit({ type: 'execute', table });

        for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            table = modifiers[i].execute(table);
        }

        this.emit({ type: 'afterExecute', table });

        return table;
    }

    public remove(modifier: DataModifier): void {
        const modifiers = this.modifiers;

        modifiers.splice(modifiers.indexOf(modifier), 1);
    }

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

namespace ChainDataModifier {

    export interface ClassJSON extends DataModifier.ClassJSON {
        modifiers: Array<DataModifier.ClassJSON>;
    }

    export interface Options extends DataModifier.Options {
        reverse: boolean;
    }

}

DataJSON.addClass(ChainDataModifier);
DataModifier.addModifier(ChainDataModifier);

export default ChainDataModifier;
