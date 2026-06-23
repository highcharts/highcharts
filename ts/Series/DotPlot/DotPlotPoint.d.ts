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

import type ColumnPoint from '../Column/ColumnPoint';
import type DotPlotPointOptions from './DotPlotPointOptions';
import type DotPlotSeries from './DotPlotSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

/* *
 *
 *  Class
 *
 * */

declare class DotPlotPoint extends ColumnPoint {
    public options: DotPlotPointOptions;
    public pointAttr?: SVGAttributes;
    public series: DotPlotSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default DotPlotPoint;
