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

import type LinePoint from '../Line/LinePoint';
import type SplinePointOptions from './SplinePointOptions';
import type SplineSeries from './SplineSeries';

/* *
 *
 *  Class
 *
 * */

declare class SplinePoint extends LinePoint {
    public controlPoints?: {
        low: [number, number];
        high: [number, number];
    };
    public doCurve?: boolean;
    public options: SplinePointOptions;
    public rightContX?: number;
    public rightContY?: number;
    public series: SplineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplinePoint;
