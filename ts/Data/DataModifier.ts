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

class DataModifier<T> {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(name: string) {
        this.name = name;
    }

    /* *
     *
     *  Properties
     *
     * */

    public name: string;

    /* *
     *
     *  Functions
     *
     * */

    // public execute(dataRows) {}
    // public attr() {}
}

namespace DataModifier {
    export type Modifier<T> = Record<string, T>;
}

export default DataModifier;
