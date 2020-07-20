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

import DataModifier from './DataModifier';
import H from '../Core/Globals';

class DataModifierChain<T> {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(dataModifiers: Array<DataModifier<T>>) {
        var self = this;

        this.dataModifiersMap = {};
        this.dataModifiers = dataModifiers || [];

        if (self.dataModifiers.length) {
            self.dataModifiers.forEach(function (modifier: DataModifier<T>, i: number): void {
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

    private dataModifiers: DataModifierChain.DataModifiers<T>;

    /* *
     *
     *  Functions
     *
     * */

    public add(dataModifier: DataModifier<T>): void {
        this.dataModifiers.push(dataModifier);
        this.dataModifiersMap[dataModifier.name] = this.dataModifiers.length - 1;
    }

    public remove(dataModifier: DataModifier<T>): void {
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

    // public execute(dataStore) {}
    // public benchmark() {}
    // public cancel() {}
}

namespace DataModifierChain {
    export type DataModifiers<T> = Array<DataModifier<T>>;
}

export default DataModifierChain;
