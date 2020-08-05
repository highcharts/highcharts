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

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/** eslint-disable valid-jsdoc */

class DataModifierChain extends DataModifier {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options: DeepPartial<DataModifier.Options>,
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
        const modifiers = this.modifiers;

        for (let i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            table = modifiers[i].execute(table);
        }

        return table;
    }

    public remove(modifier: DataModifier): void {
        const modifiers = this.modifiers;
        modifiers.splice(modifiers.indexOf(modifier), 1);
    }

    public reverse(): void {
        this.modifiers = this.modifiers.reverse();
    }

}

DataModifier.addModifier(DataModifierChain);

export default DataModifierChain;
