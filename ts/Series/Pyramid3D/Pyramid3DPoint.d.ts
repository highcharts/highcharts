/* *
 *
 *  Highcharts pyramid3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kacper Madej
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

import type Funnel3DPoint from '../Funnel3D/Funnel3DPoint';
import type Pyramid3DPointOptions from './Pyramid3DPointOptions';
import type Pyramid3DSeries from './Pyramid3DSeries';

/* *
 *
 *  Class
 *
 * */

declare class Pyramid3DPoint extends Funnel3DPoint {
    options: Pyramid3DPointOptions;
    series: Pyramid3DSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default Pyramid3DPoint;
