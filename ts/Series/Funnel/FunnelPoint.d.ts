/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

    /* *
     *
     *  Declarations
     *
     * */

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
