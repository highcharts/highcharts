/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import SankeySeriesOptions from '../Sankey/SankeySeriesOptions';

/* *
 *
 *  Imports
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

interface FlowMapSeriesOptions extends SankeySeriesOptions {
    markerEnd?: MarkerEndOptions
}

interface MarkerEndOptions {
    markerType?: string,
    enabled?: boolean,
    width?: number,
    height?: number
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
