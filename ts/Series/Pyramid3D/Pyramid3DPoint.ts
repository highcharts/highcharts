/* *
 *
 *  Highcharts pyramid3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kacper Madej
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
