/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
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

import type RectangleObject from '../../Core/Renderer/RectangleObject';
import type Series from '../../Core/Series/Series';
import type {
    XRangePointOptions,
    XRangePointPartialFillOptions
} from './XRangePointOptions';

import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import XRangeSeries from './XRangeSeries.js';

/* *
 *
 *  Declarations
 *
 * */
class XRangePoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     * Static properties
     *
     * */
    /**
     * Return color of a point based on its category.
     *
     * @private
     * @function getColorByCategory
     *
     * @param {object} series
     *        The series which the point belongs to.
     *
     * @param {object} point
     *        The point to calculate its color for.
     *
     * @return {object}
     *         Returns an object containing the properties color and colorIndex.
     */
    public static getColorByCategory(
        series: Series,
        point: Point
    ): Record<string, any> {
        var colors = series.options.colors || series.chart.options.colors,
            colorCount = colors ?
                colors.length :
                (series.chart.options.chart as any).colorCount,
            colorIndex = (point.y as any) % colorCount,
            color = colors && colors[colorIndex];

        return {
            colorIndex: colorIndex,
            color: color
        };
    }

    /* *
     *
     * Properties
     *
     * */
    public options: XRangePointOptions = void 0 as any;
    public series: XRangeSeries = void 0 as any;

    /* *
     *
     * Functions
     *
     * */
    /**
     * The ending X value of the range point.
     * @name Highcharts.Point#x2
     * @type {number|undefined}
     * @requires modules/xrange
     */

    /**
     * Extend applyOptions so that `colorByPoint` for x-range means that one
     * color is applied per Y axis category.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @return {Highcharts.Series}
     */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public resolveColor(): void {
        var series = this.series,
            colorByPoint;

        if (series.options.colorByPoint && !this.options.color) {
            colorByPoint = XRangePoint.getColorByCategory(series, this);

            if (!series.chart.styledMode) {
                this.color = colorByPoint.color;
            }

            if (!this.options.colorIndex) {
                this.colorIndex = colorByPoint.colorIndex;
            }
        } else if (!this.color) {
            this.color = series.color;
        }

    }
    /**
     * Extend init to have y default to 0.
     *
     * @private
     * @function Highcharts.Point#init
     *
     * @return {Highcharts.Point}
     */
    public init(): XRangePoint {
        Point.prototype.init.apply(this, arguments as any);

        if (!this.y) {
            this.y = 0;
        }

        return this;
    }

    /**
     * @private
     * @function Highcharts.Point#setState
     */
    public setState(): void {
        Point.prototype.setState.apply(this, arguments as any);

        this.series.drawPoint(this, this.series.getAnimationVerb());
    }

    /**
     * @private
     * @function Highcharts.Point#getLabelConfig
     *
     * @return {Highcharts.PointLabelObject}
     */
    // Add x2 and yCategory to the available properties for tooltip formats
    public getLabelConfig(): XRangePoint.XRangePointLabelObject {
        var point = this,
            cfg: XRangePoint.XRangePointLabelObject =
                Point.prototype.getLabelConfig.call(point) as any,
            yCats: Array<string> = point.series.yAxis.categories as any;

        cfg.x2 = point.x2;
        cfg.yCategory = point.yCategory = yCats && yCats[point.y as any];
        return cfg;
    }

    public tooltipDateKeys = ['x', 'x2']

    /**
     * @private
     * @function Highcharts.Point#isValid
     *
     * @return {boolean}
     */
    public isValid(): boolean {
        return typeof this.x === 'number' &&
        typeof this.x2 === 'number';
    }
    /* eslint-enable valid-jsdoc */
}

/* *
 *
 * Class namespace
 *
 * */
declare namespace XRangePoint {
    interface XRangePointLabelObject extends Point.PointLabelObject {
        x2?: XRangePoint['x2'];
        yCategory?: XRangePoint['yCategory'];
    }
}

/* *
 *
 * Prototype Properties
 *
 * */
interface XRangePoint {
    clipRectArgs?: RectangleObject;
    len?: number;
    partialFill: XRangePointOptions['partialFill'];
    partShapeArgs?: XRangePointPartialFillOptions;
    shapeType: string;
    tooltipDateKeys: Array<string>;
    x2?: number;
    yCategory?: string;

}

/* *
 *
 *  Default Export
 *
 * */
export default XRangePoint;
