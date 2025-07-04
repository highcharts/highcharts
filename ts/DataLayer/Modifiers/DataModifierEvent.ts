/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Gøran Slettemark
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from '../DataEvent';
import type DataTable from '../DataTable';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Benchmark event with additional event information.
 */
export interface BenchmarkEvent extends DataEvent {
    readonly type: 'afterBenchmark' | 'afterBenchmarkIteration'
    readonly results?: Array<number>;
}

/**
 * Error event with additional event information.
 */
export interface ErrorEvent extends DataEvent{
    readonly type: 'error';
    readonly table: DataTable;
}

/**
 * Modify event with additional event information.
 */
export interface ModifyEvent extends DataEvent {
    readonly type: 'modify' | 'afterModify'
    readonly table: DataTable;
}

/**
 * Type of events emitted by the DataModifier.
 */
export type DataModifierEvent =
    BenchmarkEvent |
    ErrorEvent |
    ModifyEvent;


/* *
 *
 *  Default Export
 *
 * */

export default DataModifierEvent;
