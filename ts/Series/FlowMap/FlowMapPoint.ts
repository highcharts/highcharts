/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson
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

import type FlowMapPointOptions from './FlowMapPointOptions';
import type FlowMapSeries from './FlowMapSeries';
import SankeyPoint from '../Sankey/SankeyPoint';

/* *
 *
 *  Class
 *
 * */

declare class FlowMapPoint extends SankeyPoint {
    public options: FlowMapPointOptions;
    public series: FlowMapSeries;
    // Borrow some MapPoint logic here?
}

/* *
 *
 *  Default Export
 *
 * */

export default FlowMapPoint;
