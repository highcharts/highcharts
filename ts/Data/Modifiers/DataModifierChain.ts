/* *
 *
 *  Data module
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
    fireEvent
} = U;

/** eslint-disable valid-jsdoc */

class DataModifierChain extends DataModifier implements DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: DataModifierChain.ClassJSON): DataModifierChain {
        const jsonModifiers = json.modifiers,
            modifiers: Array<DataModifier> = [];

        for (let i = 0, iEnd = jsonModifiers.length; i < iEnd; ++i) {
            modifiers.push(DataJSON.fromJSON(jsonModifiers[i]) as DataModifier);
        }

        return new DataModifierChain(json.options, ...modifiers);
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options: DeepPartial<DataModifierChain.Options>,
        ...modifiers: Array<DataModifier>
    ) {
        super(options);

        this.modifiers = modifiers;
    }

    /* *
     *
     *  Properties
     *
     * */

    private modifiers: Array<DataModifier>;

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

        fireEvent(modifier, 'execute', { table });

        for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            table = modifiers[i].execute(table);
        }

        fireEvent(modifier, 'afterExecute', { table });

        return table;
    }

    public remove(modifier: DataModifier): void {
        const modifiers = this.modifiers;
        modifiers.splice(modifiers.indexOf(modifier), 1);
    }

    public reverse(): void {
        this.modifiers = this.modifiers.reverse();
    }

    public toJSON(): DataModifierChain.ClassJSON {
        const chain = this,
            modifiers = chain.modifiers,
            options = chain.options,
            json: DataModifierChain.ClassJSON = {
                $class: 'DataModifierChain',
                modifiers: [],
                options
            };

        for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            json.modifiers.push(modifiers[i].toJSON());
        }

        return json;
    }

}

namespace DataModifierChain {

    export interface ClassJSON extends DataModifier.ClassJSON {
        modifiers: Array<DataModifier.ClassJSON>;
    }

    export interface Options extends DataModifier.Options {
        // nothing here at the moment
    }

}

DataJSON.addClass(DataModifierChain);

export default DataModifierChain;
