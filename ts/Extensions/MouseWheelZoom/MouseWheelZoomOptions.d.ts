/* *
 *
 *  (c) 2023 Askel Eirik Johansson
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
        mouseWheelZoom?: boolean | MouseWheelZoomOptions;
    }
}

/* *
 *
 *  API Options
 *
 * */

export interface MouseWheelZoomOptions {
    sensitivity?: number;
    type?: ChartZoomingOptions['type']
}

export default MouseWheelZoomOptions;
