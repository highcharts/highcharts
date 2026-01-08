/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Gøran Slettemark
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
    readonly type: (
        'afterBenchmark'|
        'afterBenchmarkIteration'
    );
    readonly results?: Array<number>;
}


/**
 * Error event with additional event information.
 */
export interface ErrorEvent extends DataEvent{
    readonly type: (
        'error'
    );
    readonly table: DataTable;
}


/**
 * Event information.
 */
export type DataModifierEvent = (BenchmarkEvent|ErrorEvent|ModifyEvent);


/**
 * Modify event with additional event information.
 */
export interface ModifyEvent extends DataEvent {
    readonly type: (
        'modify'|'afterModify'
    );
    readonly table: DataTable;
}


/* *
 *
 *  Default Export
 *
 * */


export default DataModifierEvent;
