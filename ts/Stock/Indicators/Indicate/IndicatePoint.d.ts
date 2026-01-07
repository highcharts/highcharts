/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type IndicateIndicator from './IndicateIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class IndicatePoint extends SMAPoint {
    public series: IndicateIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default IndicatePoint;
