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
    public box: SVGElement;
    public boxDashStyle: DashStyleValue;
    public fillColor: ColorType;
    public high: number;
    public highPlot: number;
    public low: number;
    public lowPlot: number;
    public median: number;
    public medianColor: (ColorString|GradientColor);
    public medianDashStyle: DashStyleValue;
    public medianPlot: number;
    public medianShape: SVGElement;
    public medianWidth: number;
    public options: BoxPlotPointOptions;
    public q1: number;
    public q1Plot: number;
    public q3: number;
    public q3Plot: number;
    public series: BoxPlotSeries;
    public shapeArgs: BBoxObject;
    public stem: SVGElement;
    public stemColor: ColorType;
    public stemDashStyle: DashStyleValue;
    public stemWidth: number;
    public whiskerColor: ColorType;
    public whiskerDashStyle: DashStyleValue;
    public whiskerLength: (number|string|undefined);
    public whiskers: SVGElement;
    public upperWhiskerLength: (number|string|undefined);
    public lowerWhiskerLength: (number|string|undefined);
    public whiskerWidth: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotPoint;
