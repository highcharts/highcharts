/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
