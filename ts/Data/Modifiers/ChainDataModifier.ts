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

import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

/** eslint-disable valid-jsdoc */

class ChainDataModifier extends DataModifier implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: ChainDataModifier.Options = {
        modifier: 'Chain'
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
        options: DeepPartial<ChainDataModifier.Options>,
        ...modifiers: Array<DataModifier>
    ) {
        super();

        this.modifiers = modifiers;
        this.options = merge(ChainDataModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    private modifiers: Array<DataModifier>;

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
        const modifier = this,
            modifiers = this.modifiers;

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

    public reverse(): void {
        this.modifiers = this.modifiers.reverse();
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

namespace ChainDataModifier {

    export interface ClassJSON extends DataModifier.ClassJSON {
        modifiers: Array<DataModifier.ClassJSON>;
    }

    export interface Options extends DataModifier.Options {
        // nothing here at the moment
    }

}

DataJSON.addClass(ChainDataModifier);

export default ChainDataModifier;
