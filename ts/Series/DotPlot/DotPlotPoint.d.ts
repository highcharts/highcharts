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
