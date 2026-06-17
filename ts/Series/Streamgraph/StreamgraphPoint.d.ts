/* *
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

import type AreaSplinePoint from '../AreaSpline/AreaSplinePoint';
import type StreamgraphPointOptions from './StreamgraphPointOptions';
import type StreamgraphSeries from './StreamgraphSeries';

/* *
 *
 *  Declarations
 *
 * */

declare class StreamgraphPoint extends AreaSplinePoint {
    public options: StreamgraphPointOptions;
    public series: StreamgraphSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default StreamgraphPoint;
