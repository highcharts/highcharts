/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type PositionObject from '../../Core/Renderer/PositionObject';
import Series from '../../Core/Series/Series.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationMockLabelOptionsObject {
            x: (number|null);
            y: (number|null);
            point: AnnotationMockPoint;
        }
        class AnnotationMockPoint {
            public static fromPoint(point: AnnotationPoint): AnnotationMockPoint;
            public static pointToOptions(point: AnnotationPointType): AnnotationMockPointOptionsObject;
            public static pointToPixels(point: AnnotationPointType, paneCoordinates?: boolean): PositionObject;
            public constructor(
                chart: AnnotationChart,
                target: (AnnotationControllable|null),
                options: (AnnotationMockPointOptionsObject|Function)
            );
            public command?: string;
            public isInside: boolean;
            public mock: true;
            public options: (AnnotationMockPointOptionsObject|Function);
            public plotX: number;
            public plotY: number;
            public series: AnnotationMockSeries;
            public target: (AnnotationControllable|null);
            public visible?: boolean;
            public x: (number|null);
            public y: (number|null);
            public applyOptions(options: AnnotationMockPointOptionsObject): void;
            public getLabelConfig(): AnnotationMockLabelOptionsObject;
            public getOptions(): AnnotationMockPointOptionsObject;
            public hasDynamicOptions(): boolean;
            public isInsidePlot(): boolean;
            public refresh(): void;
            public refreshOptions(): void;
            public rotate(cx: number, cy: number, radians: number): void;
            public scale(cx: number, cy: number, sx: number, sy: number): void;
            public setAxis(options: AnnotationMockPointOptionsObject, xOrY: ('x'|'y')): void;
            public toAnchor(): Array<number>;
            public translate(cx: (number|undefined), cy: (number|undefined), dx: number, dy: number): void
        }
        interface AnnotationMockPointOptionsObject {
            command?: string;
            series?: undefined;
        }
        interface AnnotationMockSeries {
            chart: AnnotationChart;
            getPlotBox: Series['getPlotBox'];
            xAxis?: (Axis|null);
            yAxis?: (Axis|null);
            visible: boolean;
        }
        interface AnnotationPoint {
            command?: undefined;
            mock?: undefined;
        }
        type AnnotationPointType = (AnnotationMockPoint|AnnotationPoint);
    }
}

/**
 * @private
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
 * A mock series instance imitating a real series from a real point.
 * @private
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

import U from '../../Core/Utilities.js';
var defined = U.defined,
    extend = U.extend,
    fireEvent = U.fireEvent;

import Axis from '../../Core/Axis/Axis.js';

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A trimmed point object which imitates {@link Highchart.Point} class. It is
 * created when there is a need of pointing to some chart's position using axis
 * values or pixel values
 *
 * @requires modules/annotations
 *
 * @private
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

    /**
     * Create a mock point from a real Highcharts point.
     *
     * @private
     * @static
     *
     * @param {Highcharts.Point} point
     *
     * @return {Highcharts.AnnotationMockPoint}
     * A mock point instance.
     */
    public static fromPoint(point: Highcharts.AnnotationPoint): Highcharts.AnnotationMockPoint {
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
     * @private
     * @static
     *
     * @param {Highcharts.AnnotationPointType} point
     *
     * @param {boolean} [paneCoordinates]
     *        whether the pixel position should be relative
     *
     * @return {Highcharts.PositionObject} pixel position
     */
    public static pointToPixels(
        point: Highcharts.AnnotationPointType,
        paneCoordinates?: boolean
    ): PositionObject {
        var series = point.series,
            chart = series.chart,
            x: number = point.plotX as any,
            y: number = point.plotY as any,
            plotBox: (Highcharts.SeriesPlotBoxObject|undefined);

        if (chart.inverted) {
            if (point.mock) {
                x = point.plotY;
                y = point.plotX;
            } else {
                x = chart.plotWidth - (point.plotY as any);
                y = chart.plotHeight - (point.plotX as any);
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
     * @private
     * @static
     *
     * @param {Highcharts.AnnotationPointType} point
     *
     * @return {Highcharts.AnnotationMockPointOptionsObject}
     * A mock point's options.
     */
    public static pointToOptions(
        point: Highcharts.AnnotationPointType
    ): Highcharts.AnnotationMockPointOptionsObject {
        return {
            x: point.x as any,
            y: point.y as any,
            xAxis: point.series.xAxis,
            yAxis: point.series.yAxis
        };
    }

    public constructor(
        chart: Highcharts.AnnotationChart,
        target: (Highcharts.AnnotationControllable|null),
        options: (Highcharts.AnnotationMockPointOptionsObject|Function)
    ) {
        /**
         * A mock series instance imitating a real series from a real point.
         *
         * @name Annotation.AnnotationMockPoint#series
         * @type {Highcharts.AnnotationMockSeries}
         */
        this.series = {
            visible: true,
            chart: chart,
            getPlotBox: Series.prototype.getPlotBox
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
    public isInside: boolean = void 0 as any;
    public options: (Highcharts.AnnotationMockPointOptionsObject|Function);
    public plotX: number = void 0 as any;
    public plotY: number = void 0 as any;
    public series: Highcharts.AnnotationMockSeries;
    public target: (Highcharts.AnnotationControllable|null);
    public visible?: boolean;
    public x: (number|null) = void 0 as any;
    public y: (number|null) = void 0 as any;

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
     * Check if the point has dynamic options.
     * @private
     * @return {boolean}
     * A positive flag if the point has dynamic options.
     */
    public hasDynamicOptions(): boolean {
        return typeof this.options === 'function';
    }

    /**
     * Get the point's options.
     * @private
     * @return {Highcharts.AnnotationMockPointOptionsObject}
     * The mock point's options.
     */
    public getOptions(): Highcharts.AnnotationMockPointOptionsObject {
        return this.hasDynamicOptions() ?
            (this.options as Function)(this.target) :
            this.options;
    }

    /**
     * Apply options for the point.
     * @private
     * @param {Highcharts.AnnotationMockPointOptionsObject} options
     */
    public applyOptions(options: Highcharts.AnnotationMockPointOptionsObject): void {
        this.command = options.command;

        this.setAxis(options, 'x');
        this.setAxis(options, 'y');

        this.refresh();
    }

    /**
     * Set x or y axis.
     * @private
     * @param {Highcharts.AnnotationMockPointOptionsObject} options
     * @param {string} xOrY
     * 'x' or 'y' string literal
     */
    public setAxis(
        options: Highcharts.AnnotationMockPointOptionsObject,
        xOrY: ('x'|'y')
    ): void {
        var axisName: ('xAxis'|'yAxis') = (xOrY + 'Axis') as any,
            axisOptions = options[axisName],
            chart = this.series.chart;

        this.series[axisName] =
            axisOptions instanceof Axis ?
                axisOptions :
                defined(axisOptions) ?
                    (
                        chart[axisName][axisOptions as any] ||
                        chart.get(axisOptions as any)
                    ) as any :
                    null;
    }

    /**
     * Transform the mock point to an anchor (relative position on the chart).
     * @private
     * @return {Array<number>}
     * A quadruple of numbers which denotes x, y, width and height of the box
     **/
    public toAnchor(): Array<number> {
        var anchor = [this.plotX, this.plotY, 0, 0];

        if (this.series.chart.inverted) {
            anchor[0] = this.plotY;
            anchor[1] = this.plotX;
        }

        return anchor;
    }

    /**
     * Returns a label config object - the same as
     * Highcharts.Point.prototype.getLabelConfig
     * @private
     * @return {Highcharts.AnnotationMockLabelOptionsObject} the point's label config
     */
    public getLabelConfig(): Highcharts.AnnotationMockLabelOptionsObject {
        return {
            x: this.x,
            y: this.y,
            point: this
        };
    }

    /**
     * Check if the point is inside its pane.
     * @private
     * @return {boolean} A flag indicating whether the point is inside the pane.
     */
    public isInsidePlot(): boolean {
        var plotX = this.plotX,
            plotY = this.plotY,
            xAxis = this.series.xAxis,
            yAxis = this.series.yAxis,
            e = {
                x: plotX,
                y: plotY,
                isInsidePlot: true
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
     * @private
     */
    public refresh(): void {
        var series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            options = this.getOptions();

        if (xAxis) {
            this.x = options.x;
            this.plotX = xAxis.toPixels(options.x, true);
        } else {
            this.x = null;
            this.plotX = options.x;
        }

        if (yAxis) {
            this.y = options.y;
            this.plotY = yAxis.toPixels(options.y, true);
        } else {
            this.y = null;
            this.plotY = options.y;
        }

        this.isInside = this.isInsidePlot();
    }

    /**
     * Translate the point.
     *
     * @private
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

    /**
     * Scale the point.
     *
     * @private
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
            var x = this.plotX * sx,
                y = this.plotY * sy,
                tx = (1 - sx) * cx,
                ty = (1 - sy) * cy;

            this.plotX = tx + x;
            this.plotY = ty + y;

            this.refreshOptions();
        }
    }

    /**
     * Rotate the point.
     * @private
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} radians
     */
    public rotate(cx: number, cy: number, radians: number): void {
        if (!this.hasDynamicOptions()) {
            var cos = Math.cos(radians),
                sin = Math.sin(radians),
                x = this.plotX,
                y = this.plotY,
                tx,
                ty;

            x -= cx;
            y -= cy;

            tx = x * cos - y * sin;
            ty = x * sin + y * cos;

            this.plotX = tx + cx;
            this.plotY = ty + cy;

            this.refreshOptions();
        }
    }

    /**
     * Refresh point options based on its plot coordinates.
     * @private
     */
    public refreshOptions(): void {
        var series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        this.x = (this.options as any).x = xAxis ?
            (this.options as any).x = xAxis.toValue(this.plotX, true) :
            this.plotX;

        this.y = (this.options as any).y = yAxis ?
            yAxis.toValue(this.plotY, true) :
            this.plotY;
    }
}

export default MockPoint;
