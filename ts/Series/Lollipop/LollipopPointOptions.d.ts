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
