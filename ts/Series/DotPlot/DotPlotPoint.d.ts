/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
