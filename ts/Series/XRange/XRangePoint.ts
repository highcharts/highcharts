/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi, Lars A. V. Cabrera
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Point from '../../Core/Series/Point';
import type RectangleObject from '../../Core/Renderer/RectangleObject';
import type Series from '../../Core/Series/Series';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type {
    XRangePointOptions,
    XRangePointPartialFillOptions
} from './XRangePointOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: { prototype: { pointClass: ColumnPoint } }
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { extend } = U;
import XRangeSeries from './XRangeSeries.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        tooltipDateKeys?: Array<string>;
    }
}

interface BBoxObjectWithCenter extends BBoxObject {
    centerX?: number;
}

/* *
 *
 *  Class
 *
 * */

class XRangePoint extends ColumnPoint {

    /* *
     *
     *  Static Functions
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
    ): AnyRecord {
        const colors = series.options.colors || series.chart.options.colors,
            colorCount = colors ?
                colors.length :
                series.chart.options.chart.colorCount as any,
            colorIndex = (point.y as any) % colorCount,
            color = colors?.[colorIndex];

        return {
            colorIndex: colorIndex,
            color: color
        };
    }

    /* *
     *
     *  Properties
     *
     * */

    public options!: XRangePointOptions;
    public series!: XRangeSeries;
    public dlBox?: BBoxObjectWithCenter;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public resolveColor(): void {
        const series = this.series;

        if (series.options.colorByPoint && !this.options.color) {
            const colorByPoint = XRangePoint.getColorByCategory(series, this);

            if (!series.chart.styledMode) {
                this.color = colorByPoint.color;
            }

            if (
                typeof this.options.colorIndex === 'undefined' ||
                this.options.colorIndex === null
            ) {
                this.colorIndex = colorByPoint.colorIndex;
            }
        } else {
            this.color = this.options.color || series.color;
        }
    }

    /**
     * Extend init to have y default to 0.
     *
     * @private
     */
    public constructor(series: XRangeSeries, options: XRangePointOptions) {
        super(series, options);

        if (!this.y) {
            this.y = 0;
        }
    }

    /**
     * Extend applyOptions to handle time strings for x2
     *
     * @private
     */
    public applyOptions(
        options: XRangePointOptions,
        x: number
    ): Point {
        super.applyOptions(options, x);
        this.x2 = this.series.chart.time.parse(this.x2);
        this.isNull = !this.isValid?.();
        this.formatPrefix = this.isNull ? 'null' : 'point'; // #23605
        return this;
    }

    /**
     * @private
     */
    public setState(): void {
        super.setState.apply(this, arguments as any);

        this.series.drawPoint(this, this.series.getAnimationVerb());
    }

    /**
     * @private
     */
    public isValid(): boolean {
        return typeof this.x === 'number' &&
        typeof this.x2 === 'number';
    }

}

/* *
 *
 *  Class Prototype
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

extend(XRangePoint.prototype, {
    ttBelow: false,
    tooltipDateKeys: ['x', 'x2']
});

/* *
 *
 *  Class Namespace
 *
 * */

/* *
 *
 *  Default Export
 *
 * */

export default XRangePoint;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * The ending X value of the range point.
 * @name Highcharts.Point#x2
 * @type {number|undefined}
 * @requires modules/xrange
 */

/**
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 *//**
 * The ending X value of the range point.
 * @name Highcharts.PointOptionsObject#x2
 * @type {number|undefined}
 * @requires modules/xrange
 */

(''); // Keeps doclets above in JS file
