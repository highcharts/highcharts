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

import DataTable from './DataTable.js';

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

abstract class DataModifier {

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

    public readonly name: string;

    /* *
     *
     *  Functions
     *
     * */

    public abstract execute(dataTable: DataTable): DataTable;

    // public attr() {}
}

namespace DataModifier {
    export type Modifier<T> = Record<string, T>; // @todo what is this about?
}

export default DataModifier;
