/* *
 *
 *  FlowMap
 *
 *  (c) 2018-2022 Askel Eirik Johansson
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

import type SankeyPointOptions from '../Sankey/SankeyPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface FlowMapPointOptions extends SankeyPointOptions {
    curveFactor?: number;
    weight?: number;
    growTowards?: boolean;
    markerEnd?: MarkerEndOptions
}

interface MarkerEndOptions {
    markerType?: string,
    enabled?: boolean,
    width?: number,
    height?: number
}

export default FlowMapPointOptions;
