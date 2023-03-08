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
import type CorePositionObject from '../../Core/Renderer/PositionObject';
import type PieDataLabelOptions from './PieDataLabelOptions';
import type PiePointOptions from './PiePointOptions';
import type PieSeries from './PieSeries';
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

    public startR?: number;

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
        const labelPosition = this.labelPosition,
            options = this.series.options.dataLabels,
            predefinedShapes = this.connectorShapes;

        let connectorShape = (options as any).connectorShape;

        // find out whether to use the predefined shape
        if ((predefinedShapes as any)[connectorShape]) {
            connectorShape = (predefinedShapes as any)[connectorShape];
        }

        return connectorShape.call(this, {
            // pass simplified label position object for user's convenience
            x: (labelPosition as any).computed.x,
            y: (labelPosition as any).computed.y,
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
        const shapeArgs = this.shapeArgs;

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
        super.init.apply(this, arguments as any);

        this.name = pick(this.name, 'Slice');

        // add event listener for select
        const toggleSlice = (e: (AnyRecord|Event)): void => {
            this.slice(e.type === 'select');
        };
        addEvent(this, 'select', toggleSlice);
        addEvent(this, 'unselect', toggleSlice);

        return this;
    }

    /**
     * Negative points are not valid (#1530, #3623, #5322)
     * @private
     */
    public isValid(): boolean {
        return isNumber(this.y) && this.y >= 0;
    }

    /**
     * Toggle the visibility of a pie slice or other data point. Note that this
     * method is available only for some series, like pie, treemap and sunburst.
     *
     * @function Highcharts.Point#setVisible
     *
     * @param {boolean} [vis]
     * True to show the pie slice or other data point, false to hide. If
     * undefined, the visibility is toggled.
     *
     * @param {boolean} [redraw] Whether to redraw the chart after the point is
     * altered. If doing more operations on the chart, it is a good idea to set
     * redraw to false and call {@link Chart#redraw|chart.redraw()} after.
     *
     */
    public setVisible(
        vis: boolean,
        redraw?: boolean
    ): void {
        const series = this.series,
            chart = series.chart,
            ignoreHiddenPoint = series.options.ignoreHiddenPoint;

        redraw = pick(redraw, ignoreHiddenPoint);

        if (vis !== this.visible) {

            // If called without an argument, toggle visibility
            this.visible = this.options.visible = vis =
                typeof vis === 'undefined' ? !this.visible : vis;
            // update userOptions.data
            (series.options.data as any)[series.data.indexOf(this)] =
                this.options;

            // Show and hide associated elements. This is performed
            // regardless of redraw or not, because chart.redraw only
            // handles full series.
            ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(
                (key: string): void => {
                    if ((this as any)[key]) {
                        (this as any)[key][vis ? 'show' : 'hide'](vis);
                    }
                }
            );

            if (this.legendItem) {
                chart.legend.colorizeItem(this, vis);
            }

            // #4170, hide halo after hiding point
            if (!vis && this.state === 'hover') {
                this.setState('');
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
     * @param {boolean} [redraw]
     * Whether to redraw the chart. True by default.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     * Animation options.
     */
    public slice(
        sliced: boolean,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const series = this.series,
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
        this.sliced = this.options.sliced = sliced =
            defined(sliced) ? sliced : !this.sliced;
        // update userOptions.data
        (series.options.data as any)[series.data.indexOf(this)] =
            this.options;

        if (this.graphic) {
            this.graphic.animate(this.getTranslate());
        }

        if (this.shadowGroup) {
            this.shadowGroup.animate(this.getTranslate());
        }
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface PiePoint {
    connectorShapes: Record<string, PiePoint.ConnectorShapeFunction>;
}
extend(PiePoint.prototype, {
    connectorShapes: {
        // only one available before v7.0.0
        fixedOffset: function (
            labelPosition: PiePoint.PositionObject,
            connectorPosition: PiePoint.LabelConnectorPositionObject,
            options: PieDataLabelOptions
        ): SVGPath {
            const breakAt = connectorPosition.breakAt,
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
            labelPosition: PiePoint.PositionObject,
            connectorPosition: PiePoint.LabelConnectorPositionObject
        ): SVGPath {
            const touchingSliceAt = connectorPosition.touchingSliceAt;

            // direct line to the slice
            return [
                ['M', labelPosition.x, labelPosition.y],
                ['L', touchingSliceAt.x, touchingSliceAt.y]
            ];
        },

        crookedLine: function (
            this: PiePoint,
            labelPosition: PiePoint.PositionObject,
            connectorPosition: PiePoint.LabelConnectorPositionObject,
            options: PieDataLabelOptions
        ): SVGPath {
            const touchingSliceAt = connectorPosition.touchingSliceAt,
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
                ];

            let useCrook = true;

            // crookedLine formula doesn't make sense if the path overlaps
            // the label - use straight line instead in that case
            if (alignment === 'left' ?
                (crookX > labelPosition.x || crookX < touchingSliceAt.x) :
                (crookX < labelPosition.x || crookX > touchingSliceAt.x)) {
                useCrook = false;
            }

            // assemble the path
            const path: SVGPath = [['M', labelPosition.x, labelPosition.y]];
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
 *  Class Namespace
 *
 * */

namespace PiePoint {

    /* *
     *
     *  Declarations
     *
     * */

    export interface ConnectorShapeFunction {
        (...args: Array<any>): SVGPath;
    }

    export interface LabelConnectorPositionObject {
        breakAt: CorePositionObject;
        touchingSliceAt: CorePositionObject;
    }

    export interface LabelPositionObject {
        alignment: AlignValue;
        connectorPosition: LabelConnectorPositionObject;
        computed: Record<string, undefined>;
        natural: CorePositionObject;
    }

    export interface PositionObject extends CorePositionObject {
        alignment: AlignValue;
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
