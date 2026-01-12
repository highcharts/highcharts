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
 *
 * */

'use strict';

/* eslint-disable max-len */


/* *
 *
 *  Imports
 *
 * */

import type * as H from 'highcharts';


/* *
 *
 *  Declarations
 *
 * */
export namespace Axis {
    export interface ExtremesObject {
        dataMax: number;
        dataMin: number;
        max: number;
        min: number;
        userMax?: number;
        userMin?: number;
    }
}

export type Axis = H.Axis;

export type AxisOptions = H.AxisOptions;

export type Chart = H.Chart;

export type Highcharts = typeof H;

export type Options = H.Options;

export type Point = H.Point;

export type Series = H.Series;

export type SeriesOptions = H.SeriesOptions;

/* *
 *
 *  Default Export
 *
 * */


export default H;
