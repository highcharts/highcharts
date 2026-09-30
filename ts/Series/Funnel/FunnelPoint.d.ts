/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { BBoxObject as BBoxObjectImport } from '../../Core/Renderer/BBoxObject.js';
import type FunnelPointOptions from './FunnelPointOptions.js';
import type FunnelSeries from './FunnelSeries.js';
import type PiePoint from '../Pie/PiePoint.js';

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
