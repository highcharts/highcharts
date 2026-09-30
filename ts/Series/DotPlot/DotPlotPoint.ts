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

import type ColumnPoint from '../Column/ColumnPoint.js';
import type DotPlotPointOptions from './DotPlotPointOptions.js';
import type DotPlotSeries from './DotPlotSeries.js';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes.js';

/* *
 *
 *  Class
 *
 * */

declare class DotPlotPoint extends ColumnPoint {
    public options: DotPlotPointOptions;
    /** @internal */
    public pointAttr?: SVGAttributes;
    /** @internal */
    public series: DotPlotSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default DotPlotPoint;
