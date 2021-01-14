/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type { BBoxObject as BBoxObjectImport } from '../../Core/Renderer/BBoxObject';
import type FunnelPointOptions from './FunnelPointOptions';
import type FunnelSeries from './FunnelSeries';
import type PiePoint from '../Pie/PiePoint';

/* *
 *
 *  Class
 *
 * */

declare class FunnelPoint extends PiePoint {
    public dlBox: FunnelPoint.BBoxObject;
    public options: FunnelPointOptions;
    public series: FunnelSeries;
}

/* *
 *
 *  Class Namespace
 *
 * */

declare namespace FunnelPoint {

    export interface BBoxObject extends BBoxObjectImport {
        bottomWidth: number;
        topWidth: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default FunnelPoint;
