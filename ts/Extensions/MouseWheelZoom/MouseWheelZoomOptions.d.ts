/* *
 *
 *  (c) 2023-2026 Highsoft AS
 *  Author: Askel Eirik Johansson
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */


import type ChartZoomingOptions from '../../Core/Chart/ChartOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartOptions'{
    interface ChartZoomingOptions {
        mouseWheel?: MouseWheelZoomOptions;
    }
}

/* *
 *
 *  API Options
 *
 * */

export interface MouseWheelZoomOptions {
    enabled?: boolean;
    sensitivity?: number;
    type?: ChartZoomingOptions['type'];
    showResetButton?: boolean;
}

export default MouseWheelZoomOptions;
