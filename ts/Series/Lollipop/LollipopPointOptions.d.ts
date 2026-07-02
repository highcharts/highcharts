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

import type ScatterPointOptions from '../Scatter/ScatterPointOptions';
import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */

export interface LollipopPointOptions extends ScatterPointOptions {
    connectorColor?: ColorType;
    connectorWidth?: number;
    dashStyle?: DashStyleValue;
    /** @deprecated */
    lowColor?: ColorType;
    pointWidth: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPointOptions;
