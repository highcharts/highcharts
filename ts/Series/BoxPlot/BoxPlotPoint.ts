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

import type BoxPlotPointOptions from './BoxPlotPointOptions';
import type BoxPlotSeries from './BoxPlotSeries';
import type ColumnPoint from '../Column/ColumnPoint';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type GradientColor from '../../Core/Color/GradientColor';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

/* *
 *
 *  Class
 *
 * */

declare class BoxPlotPoint extends ColumnPoint {
    /** @internal */
    public below?: boolean;
    /** @internal */
    public box: SVGElement;
    /** @internal */
    public boxDashStyle: DashStyleValue;
    /** @internal */
    public fillColor: ColorType;
    /** @internal */
    public high: number;
    /** @internal */
    public highPlot: number;
    /** @internal */
    public low: number;
    /** @internal */
    public lowPlot: number;
    /** @internal */
    public median: number;
    /** @internal */
    public medianColor: (ColorString|GradientColor);
    /** @internal */
    public medianDashStyle: DashStyleValue;
    /** @internal */
    public medianPlot: number;
    /** @internal */
    public medianShape: SVGElement;
    /** @internal */
    public medianWidth: number;
    public options: BoxPlotPointOptions;
    /** @internal */
    public q1: number;
    /** @internal */
    public q1Plot: number;
    /** @internal */
    public q3: number;
    /** @internal */
    public q3Plot: number;
    /** @internal */
    public series: BoxPlotSeries;
    /** @internal */
    public shapeArgs: BBoxObject;
    /** @internal */
    public stem: SVGElement;
    /** @internal */
    public stemColor: ColorType;
    /** @internal */
    public stemDashStyle: DashStyleValue;
    /** @internal */
    public stemWidth: number;
    /** @internal */
    public whiskerColor: ColorType;
    /** @internal */
    public whiskerDashStyle: DashStyleValue;
    /** @internal */
    public whiskerLength: (number|string|undefined);
    /** @internal */
    public whiskers: SVGElement;
    /** @internal */
    public upperWhiskerLength: (number|string|undefined);
    /** @internal */
    public lowerWhiskerLength: (number|string|undefined);
    /** @internal */
    public whiskerWidth: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotPoint;
