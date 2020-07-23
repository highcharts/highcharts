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

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

import DataModifier from './DataModifier.js';
import DataTable from './DataTable.js';

class DataModifierChain extends DataModifier {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(name: string, ...modifiers: DataModifierChain.Modifiers) {
        super(name);

        var self = this;

        this.dataModifiersMap = {};
        this.dataModifiers = modifiers || [];

        if (self.dataModifiers.length) {
            self.dataModifiers.forEach(function (modifier: DataModifier, i: number): void {
                self.dataModifiersMap[modifier.name] = i;
            });
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    private dataModifiersMap: Record<string, number>;

    private dataModifiers: DataModifierChain.Modifiers;

    /* *
     *
     *  Functions
     *
     * */

    public add(dataModifier: DataModifier): void {
        this.dataModifiers.push(dataModifier);
        this.dataModifiersMap[dataModifier.name] = this.dataModifiers.length - 1;
    }

    public remove(dataModifier: DataModifier): void {
        var index = this.dataModifiersMap[dataModifier.name];

        delete this.dataModifiersMap[dataModifier.name];
        this.dataModifiers.splice(index, 1);
    }

    public clear(): void {
        this.dataModifiersMap = {};
        this.dataModifiers.length = 0;
    }

    // public on(
    //     eventName: string,
    //     callback: (Highcharts.EventCallbackFunction<T>|Function)
    // ): Function {
    //     return H.addEvent(this, eventName, callback);
    // }

    public execute(dataTable: DataTable): DataTable {
        return new DataTable(dataTable.getAllRows());
    }
    // public benchmark() {}
    // public cancel() {}
}

namespace DataModifierChain {
    export type Modifiers = Array<DataModifier>;
}

export default DataModifierChain;
