/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AlignValue } from '../../Core/Renderer/AlignObject';
import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type PieDataLabelOptions from './PieDataLabelOptions';
import type PiePointOptions from './PiePointOptions';
import type PiePositionObject from './PiePositionObject';
import type PieSeries from './PieSeries';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import A from '../../Core/Animation/AnimationUtilities.js';
const { setAnimation } = A;
import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    extend,
    isNumber,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        labelDistance?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

class PiePoint extends Point {

    /* *
     *
     *  Properties
     *
     * */

    public angle?: number;

    public delayedRendering?: boolean;

    public half?: number;

    public labelDistance: number = void 0 as any;

    public labelPosition?: PiePoint.LabelPositionObject;

    public options: PiePointOptions = void 0 as any;

    public series: PieSeries = void 0 as any;

    public shadowGroup?: SVGElement;

    public sliced?: boolean;

    public slicedTranslation?: PiePoint.TranslationAttributes;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extendable method for getting the path of the connector between the
     * data label and the pie slice.
     * @private
     */
    public getConnectorPath(): void {
        var labelPosition = this.labelPosition,
            options = this.series.options.dataLabels,
            connectorShape = (options as any).connectorShape,
            predefinedShapes = this.connectorShapes;

        // find out whether to use the predefined shape
        if ((predefinedShapes as any)[connectorShape]) {
            connectorShape = (predefinedShapes as any)[connectorShape];
        }

        return connectorShape.call(this, {
            // pass simplified label position object for user's convenience
            x: (labelPosition as any).final.x,
            y: (labelPosition as any).final.y,
            alignment: (labelPosition as any).alignment
        }, (labelPosition as any).connectorPosition, options);
    }

    /**
     * @private
     */
    public getTranslate(): PiePoint.TranslationAttributes {
        return this.sliced ? (this.slicedTranslation as any) : {
            translateX: 0,
            translateY: 0
        };
    }

    /**
     * @private
     */
    public haloPath(size: number): SVGPath {
        var shapeArgs = this.shapeArgs;

        return this.sliced || !this.visible ?
            [] :
            this.series.chart.renderer.symbols.arc(
                (shapeArgs as any).x,
                (shapeArgs as any).y,
                (shapeArgs as any).r + size,
                (shapeArgs as any).r + size, {
                // Substract 1px to ensure the background is not bleeding
                // through between the halo and the slice (#7495).
                    innerR: (shapeArgs as any).r - 1,
                    start: (shapeArgs as any).start,
                    end: (shapeArgs as any).end
                }
            );
    }

    /**
     * Initialize the pie slice.
     * @private
     */
    public init(): PiePoint {

        Point.prototype.init.apply(this, arguments as any);

        var point = this,
            toggleSlice;

        point.name = pick(point.name, 'Slice');

        // add event listener for select
        toggleSlice = function (
            e: (Record<string, any>|Event)
        ): void {
            point.slice(e.type === 'select');
        };
        addEvent(point, 'select', toggleSlice);
        addEvent(point, 'unselect', toggleSlice);

        return point;
    }

    /**
     * Negative points are not valid (#1530, #3623, #5322)
     * @private
     */
    public isValid(): boolean {
        return isNumber(this.y) && this.y >= 0;
    }

    /**
     * Toggle the visibility of the pie slice.
     * @private
     *
     * @param {boolean} vis
     * Whether to show the slice or not. If undefined, the visibility is
     * toggled.
     */
    public setVisible(
        vis: boolean,
        redraw?: boolean
    ): void {
        var point = this,
            series = point.series,
            chart = series.chart,
            ignoreHiddenPoint = series.options.ignoreHiddenPoint;

        redraw = pick(redraw, ignoreHiddenPoint);

        if (vis !== point.visible) {

            // If called without an argument, toggle visibility
            point.visible = point.options.visible = vis =
                typeof vis === 'undefined' ? !point.visible : vis;
            // update userOptions.data
            (series.options.data as any)[series.data.indexOf(point)] =
                point.options;

            // Show and hide associated elements. This is performed
            // regardless of redraw or not, because chart.redraw only
            // handles full series.
            ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(
                function (key: string): void {
                    if ((point as any)[key]) {
                        (point as any)[key][vis ? 'show' : 'hide'](vis);
                    }
                }
            );

            if (point.legendItem) {
                chart.legend.colorizeItem(point, vis);
            }

            // #4170, hide halo after hiding point
            if (!vis && point.state === 'hover') {
                point.setState('');
            }

            // Handle ignore hidden slices
            if (ignoreHiddenPoint) {
                series.isDirty = true;
            }

            if (redraw) {
                chart.redraw();
            }
        }
    }

    /**
     * Set or toggle whether the slice is cut out from the pie.
     * @private
     *
     * @param {boolean} sliced
     * When undefined, the slice state is toggled.
     *
     * @param {boolean} redraw
     * Whether to redraw the chart. True by default.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>}
     * Animation options.
     */
    public slice(
        sliced: boolean,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        var point = this,
            series = point.series,
            chart = series.chart;

        setAnimation(animation, chart);

        // redraw is true by default
        redraw = pick(redraw, true);

        /**
         * Pie series only. Whether to display a slice offset from the
         * center.
         * @name Highcharts.Point#sliced
         * @type {boolean|undefined}
         */
        // if called without an argument, toggle
        point.sliced = point.options.sliced = sliced =
            defined(sliced) ? sliced : !point.sliced;
        // update userOptions.data
        (series.options.data as any)[series.data.indexOf(point)] =
            point.options;

        if (point.graphic) {
            point.graphic.animate(this.getTranslate());
        }

        if (point.shadowGroup) {
            point.shadowGroup.animate(this.getTranslate());
        }
    }
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface PiePoint {
    connectorShapes: Record<string, PiePoint.ConnectorShapeFunction>;
}
extend(PiePoint.prototype, {
    connectorShapes: {
        // only one available before v7.0.0
        fixedOffset: function (
            labelPosition: PiePositionObject,
            connectorPosition: PiePoint.LabelConnectorPositionObject,
            options: PieDataLabelOptions
        ): SVGPath {
            var breakAt = connectorPosition.breakAt,
                touchingSliceAt = connectorPosition.touchingSliceAt,
                lineSegment = options.softConnector ? [
                    'C', // soft break
                    // 1st control point (of the curve)
                    labelPosition.x +
                    // 5 gives the connector a little horizontal bend
                    (labelPosition.alignment === 'left' ? -5 : 5),
                    labelPosition.y, //
                    2 * breakAt.x - touchingSliceAt.x, // 2nd control point
                    2 * breakAt.y - touchingSliceAt.y, //
                    breakAt.x, // end of the curve
                    breakAt.y //
                ] as SVGPath.CurveTo : [
                    'L', // pointy break
                    breakAt.x,
                    breakAt.y
                ] as SVGPath.LineTo;

            // assemble the path
            return ([
                ['M', labelPosition.x, labelPosition.y],
                lineSegment,
                ['L', touchingSliceAt.x, touchingSliceAt.y]
            ]);
        },

        straight: function (
            labelPosition: PiePositionObject,
            connectorPosition: PiePoint.LabelConnectorPositionObject
        ): SVGPath {
            var touchingSliceAt = connectorPosition.touchingSliceAt;

            // direct line to the slice
            return [
                ['M', labelPosition.x, labelPosition.y],
                ['L', touchingSliceAt.x, touchingSliceAt.y]
            ];
        },

        crookedLine: function (
            this: PiePoint,
            labelPosition: PiePositionObject,
            connectorPosition: PiePoint.LabelConnectorPositionObject,
            options: PieDataLabelOptions
        ): SVGPath {

            var touchingSliceAt = connectorPosition.touchingSliceAt,
                series = this.series,
                pieCenterX = series.center[0],
                plotWidth = series.chart.plotWidth,
                plotLeft = series.chart.plotLeft,
                alignment = labelPosition.alignment,
                radius = (this.shapeArgs as any).r,
                crookDistance = relativeLength( // % to fraction
                    options.crookDistance as any, 1
                ),
                crookX = alignment === 'left' ?
                    pieCenterX + radius + (plotWidth + plotLeft -
                    pieCenterX - radius) * (1 - crookDistance) :
                    plotLeft + (pieCenterX - radius) * crookDistance,
                segmentWithCrook: SVGPath.LineTo = [
                    'L',
                    crookX,
                    labelPosition.y
                ],
                useCrook = true;

            // crookedLine formula doesn't make sense if the path overlaps
            // the label - use straight line instead in that case
            if (alignment === 'left' ?
                (crookX > labelPosition.x || crookX < touchingSliceAt.x) :
                (crookX < labelPosition.x || crookX > touchingSliceAt.x)) {
                useCrook = false;
            }

            // assemble the path
            const path = [
                ['M', labelPosition.x, labelPosition.y]
            ] as SVGPath;
            if (useCrook) {
                path.push(segmentWithCrook);
            }
            path.push(['L', touchingSliceAt.x, touchingSliceAt.y]);
            return path;
        }
    }
});

/* *
 *
 *  Class Declarations
 *
 * */

namespace PiePoint {
    export interface ConnectorShapeFunction {
        (...args: Array<any>): SVGPath;
    }
    export interface LabelConnectorPositionObject {
        breakAt: PositionObject;
        touchingSliceAt: PositionObject;
    }
    export interface LabelPositionObject {
        alignment: AlignValue;
        connectorPosition: LabelConnectorPositionObject;
        'final': Record<string, undefined>;
        natural: PositionObject;
    }
    export interface TranslationAttributes extends SVGAttributes {
        translateX: number;
        translateY: number;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default PiePoint;
