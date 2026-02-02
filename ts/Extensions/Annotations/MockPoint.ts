/* *
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnnotationChart from './AnnotationChart';
import type {
    AnnotationPoint,
    AnnotationPointType
} from './AnnotationSeries';
import type Axis from '../../Core/Axis/Axis';
import type ControlTarget from './ControlTarget';
import type {
    AnnotationMockPointOptionsObject
} from './AnnotationMockPointOptionsObject';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type Series from '../../Core/Series/Series';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { series: { prototype: seriesProto } } = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    defined,
    fireEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module './AnnotationSeries' {
    interface AnnotationPoint {
        /** @internal */
        command?: string;

        /**
         * Indicates if this is a mock point for an annotation.
         *
         * @internal
         * @name Highcharts.Point#mock
         * @type {boolean|undefined}
         */
        mock: undefined;
    }
}

/** @internal */
declare module './AnnotationMockPointOptionsObject' {
    interface AnnotationMockPointOptionsObject {
        command?: string;
        series?: undefined;
    }
}

/** @internal */
export interface MockLabelConfigObject {
    x?: number;
    y?: (number|null);
    point: MockPoint;
}

/** @internal */
export interface MockSeries {
    chart: AnnotationChart;
    getPlotBox: Series['getPlotBox'];
    xAxis?: (Axis|null);
    yAxis?: (Axis|null);
    visible: boolean;
}

/* *
 *
 *  Class
 *
 * */

/**
 * A trimmed point object which imitates {@link Highcharts.Point} class. It is
 * created when there is a need of pointing to some chart's position using axis
 * values or pixel values
 *
 * @internal
 * @requires modules/annotations
 *
 * @class
 * @name Highcharts.AnnotationMockPoint
 *
 * @hideconstructor
 *
 * @param {Highcharts.Chart} chart
 * The chart instance.
 *
 * @param {Highcharts.AnnotationControllable|null} target
 * The related controllable.
 *
 * @param {Highcharts.AnnotationMockPointOptionsObject|Function} options
 * The options object.
 */
class MockPoint {

    point: MockPoint;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Create a mock point from a real Highcharts point.
     *
     * @internal
     * @static
     *
     * @param {Highcharts.Point} point
     *
     * @return {Highcharts.AnnotationMockPoint}
     * A mock point instance.
     */
    public static fromPoint(point: AnnotationPoint): MockPoint {
        return new MockPoint(point.series.chart, null, {
            x: point.x as any,
            y: point.y as any,
            xAxis: point.series.xAxis,
            yAxis: point.series.yAxis
        });
    }

    /**
     * Get the pixel position from the point like object.
     *
     * @internal
     * @static
     *
     * @param {Highcharts.AnnotationPointType} point
     *
     * @param {boolean} [paneCoordinates]
     *        Whether the pixel position should be relative
     *
     * @return {Highcharts.PositionObject} pixel position
     */
    public static pointToPixels(
        point: AnnotationPointType,
        paneCoordinates?: boolean
    ): PositionObject {
        const series = point.series,
            chart = series.chart;

        let x = point.plotX || 0,
            y = point.plotY || 0,
            plotBox: (Series.PlotBoxTransform|undefined);

        if (chart.inverted) {
            if (point.mock) {
                x = point.plotY;
                y = point.plotX;
            } else {
                x = chart.plotWidth - (point.plotY || 0);
                y = chart.plotHeight - (point.plotX || 0);
            }
        }

        if (series && !paneCoordinates) {
            plotBox = series.getPlotBox();
            x += plotBox.translateX;
            y += plotBox.translateY;
        }

        return {
            x: x,
            y: y
        };
    }

    /**
     * Get fresh mock point options from the point like object.
     *
     * @internal
     * @static
     *
     * @param {Highcharts.AnnotationPointType} point
     *
     * @return {Highcharts.AnnotationMockPointOptionsObject}
     * A mock point's options.
     */
    public static pointToOptions(
        point: AnnotationPointType
    ): AnnotationMockPointOptionsObject {

        return {
            x: point.x as any,
            y: point.y as any,
            xAxis: point.series.xAxis,
            yAxis: point.series.yAxis
        };
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: AnnotationChart,
        target: (ControlTarget|null),
        options: (AnnotationMockPointOptionsObject|Function)
    ) {
        // Circular reference for formats and formatters
        this.point = this;

        /**
         * A mock series instance imitating a real series from a real point.
         *
         * @name Annotation.AnnotationMockPoint#series
         * @type {Highcharts.AnnotationMockSeries}
         */
        this.series = {
            visible: true,
            chart: chart,
            getPlotBox: seriesProto.getPlotBox
        };

        /**
         * @name Annotation.AnnotationMockPoint#target
         * @type {Highcharts.AnnotationControllable|null}
         */
        this.target = target || null;

        /**
         * Options for the mock point.
         *
         * @name Annotation.AnnotationMockPoint#options
         * @type {Highcharts.AnnotationsMockPointOptionsObject}
         */
        this.options = options;

        /**
         * If an xAxis is set it represents the point's value in terms of the
         * xAxis.
         *
         * @name Annotation.AnnotationMockPoint#x
         * @type {number|undefined}
         */

        /**
         * If an yAxis is set it represents the point's value in terms of the
         * yAxis.
         *
         * @name Annotation.AnnotationMockPoint#y
         * @type {number|undefined}
         */

        /**
         * It represents the point's pixel x coordinate relative to its plot
         * box.
         *
         * @name Annotation.AnnotationMockPoint#plotX
         * @type {number|undefined}
         */

        /**
         * It represents the point's pixel y position relative to its plot box.
         *
         * @name Annotation.AnnotationMockPoint#plotY
         * @type {number|undefined}
         */

        /**
         * Whether the point is inside the plot box.
         *
         * @name Annotation.AnnotationMockPoint#isInside
         * @type {boolean|undefined}
         */

        this.applyOptions(this.getOptions());
    }

    /* *
     *
     * Properties
     *
     * */

    public command?: string;
    public isInside?: boolean;
    public negative?: boolean;
    public options: (AnnotationMockPointOptionsObject|Function);
    public plotX!: number;
    public plotY!: number;
    public series: MockSeries;
    public target: (ControlTarget|null);
    public ttBelow?: boolean;
    public visible?: boolean;
    public x?: number;
    public y?: (number|null);

    /* *
     *
     * Functions
     *
     * */

    /**
     * A flag indicating that a point is not the real one.
     *
     * @type {boolean}
     * @default true
     */
    public mock: true = true;

    /**
     * Apply options for the point.
     *
     * @internal
     * @param {Highcharts.AnnotationMockPointOptionsObject} options
     */
    public applyOptions(options: AnnotationMockPointOptionsObject): void {
        this.command = options.command;

        this.setAxis(options, 'x');
        this.setAxis(options, 'y');

        this.refresh();
    }

    /**
     * Get the point's options.
     *
     * @internal
     * @return {Highcharts.AnnotationMockPointOptionsObject}
     * The mock point's options.
     */
    public getOptions(): AnnotationMockPointOptionsObject {
        if (this.hasDynamicOptions()) {
            if (typeof this.options === 'function') {
                return (this.options as (target: any) =>
                AnnotationMockPointOptionsObject)(this.target);
            }
        }
        return this.options as AnnotationMockPointOptionsObject;
    }

    /**
     * Check if the point has dynamic options.
     *
     * @internal
     * @return {boolean}
     * A positive flag if the point has dynamic options.
     */
    public hasDynamicOptions(): boolean {
        return typeof this.options === 'function';
    }

    /**
     * Check if the point is inside its pane.
     *
     * @internal
     * @return {boolean} A flag indicating whether the point is inside the pane.
     */
    public isInsidePlot(): boolean {
        const plotX = this.plotX,
            plotY = this.plotY,
            xAxis = this.series.xAxis,
            yAxis = this.series.yAxis,
            e = {
                x: plotX,
                y: plotY,
                isInsidePlot: true,
                options: {}
            };

        if (xAxis) {
            e.isInsidePlot = defined(plotX) && plotX >= 0 && plotX <= xAxis.len;
        }

        if (yAxis) {
            e.isInsidePlot =
                e.isInsidePlot &&
                defined(plotY) &&
                plotY >= 0 && plotY <= yAxis.len;
        }

        fireEvent(this.series.chart, 'afterIsInsidePlot', e);

        return e.isInsidePlot;
    }

    /**
     * Refresh point values and coordinates based on its options.
     * @internal
     */
    public refresh(): void {
        const series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            options = this.getOptions();

        if (xAxis) {
            this.x = options.x;
            this.plotX = xAxis.toPixels(options.x as number, true);
        } else {
            this.x = void 0;
            this.plotX = options.x as number;
        }

        if (yAxis) {
            this.y = options.y;
            this.plotY = yAxis.toPixels(options.y as number, true);
        } else {
            this.y = null;
            this.plotY = options.y as number;
        }

        this.isInside = this.isInsidePlot();
    }

    /**
     * Refresh point options based on its plot coordinates.
     * @internal
     */
    public refreshOptions(): void {
        const series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        this.x = (this.options as any).x = xAxis ?
            (this.options as any).x = xAxis.toValue(this.plotX, true) :
            this.plotX;

        this.y = (this.options as any).y = yAxis ?
            yAxis.toValue(this.plotY, true) :
            this.plotY;
    }

    /**
     * Rotate the point.
     *
     * @internal
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} radians
     */
    public rotate(cx: number, cy: number, radians: number): void {
        if (!this.hasDynamicOptions()) {
            const cos = Math.cos(radians),
                sin = Math.sin(radians),
                x = this.plotX - cx,
                y = this.plotY - cy,
                tx = x * cos - y * sin,
                ty = x * sin + y * cos;

            this.plotX = tx + cx;
            this.plotY = ty + cy;

            this.refreshOptions();
        }
    }

    /**
     * Scale the point.
     *
     * @internal
     *
     * @param {number} cx
     * Origin x transformation.
     *
     * @param {number} cy
     * Origin y transformation.
     *
     * @param {number} sx
     * Scale factor x.
     *
     * @param {number} sy
     * Scale factor y.
     */
    public scale(
        cx: number,
        cy: number,
        sx: number,
        sy: number
    ): void {
        if (!this.hasDynamicOptions()) {
            const x = this.plotX * sx,
                y = this.plotY * sy,
                tx = (1 - sx) * cx,
                ty = (1 - sy) * cy;

            this.plotX = tx + x;
            this.plotY = ty + y;

            this.refreshOptions();
        }
    }

    /**
     * Set x or y axis.
     *
     * @internal
     * @param {Highcharts.AnnotationMockPointOptionsObject} options
     * @param {string} xOrY
     * 'x' or 'y' string literal
     */
    public setAxis(
        options: AnnotationMockPointOptionsObject,
        xOrY: ('x'|'y')
    ): void {
        const axisName: ('xAxis'|'yAxis') = (xOrY + 'Axis') as any,
            axisOptions = options[axisName],
            chart = this.series.chart;

        this.series[axisName] =
            typeof axisOptions === 'object' ?
                axisOptions :
                defined(axisOptions) ?
                    (
                        chart[axisName][axisOptions] ||
                        // @todo v--- (axisName)[axisOptions] ?
                        chart.get(axisOptions as any)
                    ) :
                    null;
    }

    /**
     * Transform the mock point to an anchor (relative position on the chart).
     *
     * @internal
     * @return {Array<number>}
     * A quadruple of numbers which denotes x, y, width and height of the box
     **/
    public toAnchor(): Array<number> {
        const anchor = [this.plotX, this.plotY, 0, 0];

        if (this.series.chart.inverted) {
            anchor[0] = this.plotY;
            anchor[1] = this.plotX;
        }

        return anchor;
    }

    /**
     * Translate the point.
     *
     * @internal
     *
     * @param {number|undefined} cx
     * Origin x transformation.
     *
     * @param {number|undefined} cy
     * Origin y transformation.
     *
     * @param {number} dx
     * Translation for x coordinate.
     *
     * @param {number} dy
     * Translation for y coordinate.
     **/
    public translate(
        _cx: (number|undefined),
        _cy: (number|undefined),
        dx: number,
        dy: number
    ): void {
        if (!this.hasDynamicOptions()) {
            this.plotX += dx;
            this.plotY += dy;

            this.refreshOptions();
        }
    }

}

// Minimal interface to hide the fully internal class.
interface MockPoint {
}

/* *
 *
 *  Default Export
 *
 * */

export default MockPoint;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @internal
 * @interface Highcharts.AnnotationMockLabelOptionsObject
 *//**
 * Point instance of the point.
 * @name Highcharts.AnnotationMockLabelOptionsObject#point
 * @type {Highcharts.AnnotationMockPoint}
 *//**
 * X value translated to x axis scale.
 * @name Highcharts.AnnotationMockLabelOptionsObject#x
 * @type {number|null}
 *//**
 * Y value translated to y axis scale.
 * @name Highcharts.AnnotationMockLabelOptionsObject#y
 * @type {number|null}
 */


/**
 * Object of shape point.
 *
 * @interface Highcharts.AnnotationMockPointOptionsObject
 *//**
 * The x position of the point. Units can be either in axis
 * or chart pixel coordinates.
 *
 * @type      {number}
 * @name      Highcharts.AnnotationMockPointOptionsObject.x
 *//**
 * The y position of the point. Units can be either in axis
 * or chart pixel coordinates.
 *
 * @type      {number}
 * @name      Highcharts.AnnotationMockPointOptionsObject.y
 *//**
 * This number defines which xAxis the point is connected to.
 * It refers to either the axis id or the index of the axis in
 * the xAxis array. If the option is not configured or the axis
 * is not found the point's x coordinate refers to the chart
 * pixels.
 *
 * @type      {number|string|null}
 * @name      Highcharts.AnnotationMockPointOptionsObject.xAxis
 *//**
 * This number defines which yAxis the point is connected to.
 * It refers to either the axis id or the index of the axis in
 * the yAxis array. If the option is not configured or the axis
 * is not found the point's y coordinate refers to the chart
 * pixels.
 *
 * @type      {number|string|null}
 * @name      Highcharts.AnnotationMockPointOptionsObject.yAxis
 */

/**
 * Callback function that returns the annotation shape point or it's options.
 *
 * @callback Highcharts.AnnotationMockPointFunction
 *
 * @param {Highcharts.AnnotationControllable} controllable
 *        Controllable shape or label.
 *
 * @return {
 *     Highcharts.AnnotationMockPointOptionsObject |
 *     Highcharts.Point
 * }
 *         Annotations shape point or it's options.
 */

/**
 * A mock series instance imitating a real series from a real point.
 * @internal
 * @interface Highcharts.AnnotationMockSeries
 *//**
 * Whether a series is visible.
 * @name Highcharts.AnnotationMockSeries#visible
 * @type {boolean}
 *//**
 * A chart instance.
 * @name Highcharts.AnnotationMockSeries#chart
 * @type {Highcharts.Chart}
 *//**
 * @name Highcharts.AnnotationMockSeries#getPlotBox
 * @type {Function}
 */

/**
 * Indicates if this is a mock point for an annotation.
 * @name Highcharts.Point#mock
 * @type {boolean|undefined}
 */

(''); // Keeps doclets above in JS file
