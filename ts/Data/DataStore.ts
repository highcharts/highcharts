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

export type TableEvents = ('\\(._.)//');

export interface DataStore {
    on(event: TableEvents, callback: Function): void;
}

export interface MetaColumn {
    name?: string;
    metadata?: any;
}

export default DataStore;
