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

import type AreaPointOptions from './AreaPointOptions';
import type AreaSeries from './AreaSeries';
import type LinePoint from '../Line/LinePoint';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        isCliff?: AreaPoint['isCliff'];
    }
}

/* *
 *
 *  Class
 *
 * */

declare class AreaPoint extends LinePoint {
    public isCliff?: boolean;
    public leftNull?: boolean;
    public options: AreaPointOptions;
    public rightNull?: boolean;
    public series: AreaSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaPoint;
