/* *
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
