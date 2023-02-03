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

import type PieSeriesOptions from './PieSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import CU from '../CenteredUtilities.js';
const { getStartAndEndRadians } = CU;
import ColumnSeries from '../Column/ColumnSeries.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import LegendSymbol from '../../Core/Legend/LegendSymbol.js';
import { Palette } from '../../Core/Color/Palettes.js';
import PiePoint from './PiePoint.js';
import PieSeriesDefaults from './PieSeriesDefaults.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import Symbols from '../../Core/Renderer/SVG/Symbols.js';
import U from '../../Core/Utilities.js';
const {
    clamp,
    extend,
    fireEvent,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        redrawPoints?(): void;
        updateTotals?(): void;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {
        brightness?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * Pie series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pie
 *
 * @augments Highcharts.Series
 */
class PieSeries extends Series {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions = merge(
        Series.defaultOptions,
        PieSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public center: Array<number> = void 0 as any;

    public data: Array<PiePoint> = void 0 as any;

    public endAngleRad?: number;

    public maxLabelDistance: number = void 0 as any;

    public options: PieSeriesOptions = void 0 as any;

    public points: Array<PiePoint> = void 0 as any;

    public shadowGroup?: SVGElement;

    public startAngleRad?: number;

    public total?: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Animates the pies in.
     * @private
     */
    public animate(init?: boolean): void {
        const series = this,
            points = series.points,
            startAngleRad = series.startAngleRad;

        if (!init) {
            points.forEach(function (point): void {
                const graphic = point.graphic,
                    args = point.shapeArgs;

                if (graphic && args) {
                // start values
                    graphic.attr({
                    // animate from inner radius (#779)
                        r: pick(point.startR,
                            (series.center && series.center[3] / 2)),
                        start: startAngleRad,
                        end: startAngleRad
                    });

                    // animate
                    graphic.animate({
                        r: args.r,
                        start: args.start,
                        end: args.end
                    }, series.options.animation);
                }
            });
        }
    }

    /**
     * Called internally to draw auxiliary graph in pie-like series in
     * situtation when the default graph is not sufficient enough to present
     * the data well. Auxiliary graph is saved in the same object as
     * regular graph.
     * @private
     */
    public drawEmpty(): void {
        const start = this.startAngleRad,
            end = this.endAngleRad,
            options = this.options;
        let centerX,
            centerY;

        // Draw auxiliary graph if there're no visible points.
        if (this.total === 0 && this.center) {
            centerX = this.center[0];
            centerY = this.center[1];

            if (!this.graph) {
                this.graph = this.chart.renderer
                    .arc(centerX, centerY, this.center[1] / 2, 0, start, end)
                    .addClass('highcharts-empty-series')
                    .add(this.group);
            }

            this.graph.attr({
                d: Symbols.arc(
                    centerX,
                    centerY,
                    this.center[2] / 2,
                    0, {
                        start,
                        end,
                        innerR: this.center[3] / 2
                    }
                )
            });

            if (!this.chart.styledMode) {
                this.graph.attr({
                    'stroke-width': options.borderWidth,
                    fill: options.fillColor || 'none',
                    stroke: options.color || Palette.neutralColor20
                });
            }

        } else if (this.graph) { // Destroy the graph object.
            this.graph = this.graph.destroy();
        }
    }

    /**
     * Slices in pie chart are initialized in DOM, but it's shapes and
     * animations are normally run in `drawPoints()`.
     * @private
     */
    public drawPoints(): void {
        const renderer = this.chart.renderer;

        this.points.forEach(function (point): void {
            // When updating a series between 2d and 3d or cartesian and
            // polar, the shape type changes.
            if (point.graphic && point.hasNewShapeType()) {
                point.graphic = point.graphic.destroy();
            }

            if (!point.graphic) {
                point.graphic = (renderer as any)[point.shapeType as any](
                    point.shapeArgs
                )
                    .add(point.series.group);
                point.delayedRendering = true;
            }
        });
    }

    /**
     * Extend the generatePoints method by adding total and percentage
     * properties to each point
     * @private
     */
    public generatePoints(): void {
        super.generatePoints();
        this.updateTotals();
    }

    /**
     * Utility for getting the x value from a given y, used for
     * anticollision logic in data labels. Added point for using specific
     * points' label distance.
     * @private
     */
    public getX(
        y: number,
        left: boolean,
        point: PiePoint
    ): number {
        const center = this.center,
            // Variable pie has individual radius
            radius = this.radii ?
                this.radii[point.index as any] || 0 :
                center[2] / 2;

        const angle = Math.asin(
            clamp((y - center[1]) / (radius + point.labelDistance), -1, 1)
        );
        const x = center[0] +
        (left ? -1 : 1) *
        (Math.cos(angle) * (radius + point.labelDistance)) +
        (
            (point.labelDistance as any) > 0 ?
                (left ? -1 : 1) * (this.options.dataLabels as any).padding :
                0
        );

        return x;
    }

    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    public hasData(): boolean {
        return !!this.processedXData.length; // != 0
    }

    /**
     * Draw the data points
     * @private
     */
    public redrawPoints(): void {
        const series = this,
            chart = series.chart,
            renderer = chart.renderer,
            shadow = series.options.shadow;
        let groupTranslation,
            graphic,
            pointAttr: SVGAttributes,
            shapeArgs: (SVGAttributes|undefined);

        this.drawEmpty();

        if (shadow && !series.shadowGroup && !chart.styledMode) {
            series.shadowGroup = renderer
                .g('shadow')
                .attr({ zIndex: -1 })
                .add(series.group);
        }

        // draw the slices
        series.points.forEach(function (point): void {
            const animateTo = {};
            graphic = point.graphic;
            if (!point.isNull && graphic) {
                let shadowGroup: (SVGElement|undefined);

                shapeArgs = point.shapeArgs;


                // If the point is sliced, use special translation, else use
                // plot area translation
                groupTranslation = point.getTranslate();

                if (!chart.styledMode) {
                // Put the shadow behind all points
                    shadowGroup = point.shadowGroup;

                    if (shadow && !shadowGroup) {
                        shadowGroup = point.shadowGroup = renderer
                            .g('shadow')
                            .add(series.shadowGroup);
                    }

                    if (shadowGroup) {
                        shadowGroup.attr(groupTranslation);
                    }
                    pointAttr = series.pointAttribs(
                        point,
                        (point.selected && 'select') as any
                    );
                }

                // Draw the slice
                if (!point.delayedRendering) {
                    graphic
                        .setRadialReference(series.center);

                    if (!chart.styledMode) {
                        merge(true, animateTo, pointAttr);
                    }
                    merge(true, animateTo, shapeArgs, groupTranslation);
                    graphic.animate(animateTo);
                } else {

                    graphic
                        .setRadialReference(series.center)
                        .attr(shapeArgs)
                        .attr(groupTranslation);

                    if (!chart.styledMode) {
                        graphic
                            .attr(pointAttr)
                            .attr({ 'stroke-linejoin': 'round' })
                            .shadow(shadow, shadowGroup);
                    }

                    point.delayedRendering = false;
                }

                graphic.attr({
                    visibility: point.visible ? 'inherit' : 'hidden'
                });

                graphic.addClass(point.getClassName(), true);

            } else if (graphic) {
                point.graphic = graphic.destroy();
            }
        });

    }

    /**
     * Utility for sorting data labels.
     * @private
     */
    public sortByAngle(
        points: Array<PiePoint>,
        sign: number
    ): void {
        points.sort(function (a, b): number {
            return (
                ((typeof a.angle !== 'undefined') as any) &&
                ((b.angle as any) - (a.angle as any)) * sign
            );
        });
    }

    /**
     * Do translation for pie slices
     * @private
     */
    public translate(positions?: Array<number>): void {
        fireEvent(this, 'translate');

        this.generatePoints();

        const series = this,
            precision = 1000, // issue #172
            options = series.options,
            slicedOffset = options.slicedOffset,
            connectorOffset =
                (slicedOffset as any) + (options.borderWidth || 0),
            radians = getStartAndEndRadians(
                options.startAngle,
                options.endAngle
            ),
            startAngleRad = series.startAngleRad = radians.start,
            endAngleRad = series.endAngleRad = radians.end,
            circ = endAngleRad - startAngleRad, // 2 * Math.PI,
            points = series.points,
            labelDistance = (options.dataLabels as any).distance,
            ignoreHiddenPoint = options.ignoreHiddenPoint,
            len = points.length;
        let finalConnectorOffset,
            start,
            end,
            angle,
            // the x component of the radius vector for a given point
            radiusX,
            radiusY,
            i,
            point,
            cumulative = 0;

        // Get positions - either an integer or a percentage string must be
        // given. If positions are passed as a parameter, we're in a
        // recursive loop for adjusting space for data labels.
        if (!positions) {
            series.center = positions = series.getCenter();
        }

        // Calculate the geometry for each point
        for (i = 0; i < len; i++) {

            point = points[i];

            // set start and end angle
            start = startAngleRad + (cumulative * circ);
            if (
                point.isValid() &&
                (!ignoreHiddenPoint || point.visible)
            ) {
                cumulative += (point.percentage as any) / 100;
            }
            end = startAngleRad + (cumulative * circ);

            // set the shape
            const shapeArgs = {
                x: positions[0],
                y: positions[1],
                r: positions[2] / 2,
                innerR: positions[3] / 2,
                start: Math.round(start * precision) / precision,
                end: Math.round(end * precision) / precision
            };
            point.shapeType = 'arc';
            point.shapeArgs = shapeArgs;

            // Used for distance calculation for specific point.
            point.labelDistance = pick(
                (
                    point.options.dataLabels &&
                    point.options.dataLabels.distance
                ),
                labelDistance
            );

            // Compute point.labelDistance if it's defined as percentage
            // of slice radius (#8854)
            point.labelDistance = relativeLength(
                point.labelDistance,
                shapeArgs.r
            );

            // Saved for later dataLabels distance calculation.
            series.maxLabelDistance = Math.max(
                series.maxLabelDistance || 0,
                point.labelDistance
            );

            // The angle must stay within -90 and 270 (#2645)
            angle = (end + start) / 2;
            if (angle > 1.5 * Math.PI) {
                angle -= 2 * Math.PI;
            } else if (angle < -Math.PI / 2) {
                angle += 2 * Math.PI;
            }

            // Center for the sliced out slice
            point.slicedTranslation = {
                translateX: Math.round(
                    Math.cos(angle) * (slicedOffset as any)
                ),
                translateY: Math.round(
                    Math.sin(angle) * (slicedOffset as any)
                )
            };

            // set the anchor point for tooltips
            radiusX = Math.cos(angle) * positions[2] / 2;
            radiusY = Math.sin(angle) * positions[2] / 2;
            point.tooltipPos = [
                positions[0] + radiusX * 0.7,
                positions[1] + radiusY * 0.7
            ];

            point.half = angle < -Math.PI / 2 || angle > Math.PI / 2 ?
                1 :
                0;
            point.angle = angle;

            // Set the anchor point for data labels. Use point.labelDistance
            // instead of labelDistance // #1174
            // finalConnectorOffset - not override connectorOffset value.

            finalConnectorOffset = Math.min(
                connectorOffset,
                point.labelDistance / 5
            ); // #1678

            point.labelPosition = {
                natural: {
                // initial position of the data label - it's utilized for
                // finding the final position for the label
                    x: positions[0] + radiusX + Math.cos(angle) *
                    point.labelDistance,
                    y: positions[1] + radiusY + Math.sin(angle) *
                    point.labelDistance
                },
                computed: {
                // used for generating connector path -
                // initialized later in drawDataLabels function
                // x: undefined,
                // y: undefined
                },
                // left - pie on the left side of the data label
                // right - pie on the right side of the data label
                // center - data label overlaps the pie
                alignment: point.labelDistance < 0 ?
                    'center' : point.half ? 'right' : 'left',
                connectorPosition: {
                    breakAt: { // used in connectorShapes.fixedOffset
                        x: positions[0] + radiusX + Math.cos(angle) *
                        finalConnectorOffset,
                        y: positions[1] + radiusY + Math.sin(angle) *
                        finalConnectorOffset
                    },
                    touchingSliceAt: { // middle of the arc
                        x: positions[0] + radiusX,
                        y: positions[1] + radiusY
                    }
                }
            };
        }
        fireEvent(series, 'afterTranslate');
    }

    /**
     * Recompute total chart sum and update percentages of points.
     * @private
     */
    public updateTotals(): void {
        const points = this.points,
            len = points.length,
            ignoreHiddenPoint = this.options.ignoreHiddenPoint;
        let i,
            point,
            total = 0;

        // Get the total sum
        for (i = 0; i < len; i++) {
            point = points[i];
            if (
                point.isValid() &&
                (!ignoreHiddenPoint || point.visible)
            ) {
                total += point.y as any;
            }
        }
        this.total = total;

        // Set each point's properties
        for (i = 0; i < len; i++) {
            point = points[i];
            point.percentage =
                (total > 0 && (point.visible || !ignoreHiddenPoint)) ?
                    (point.y as any) / total * 100 :
                    0;
            point.total = total;
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface PieSeries {
    drawGraph: undefined;
    drawLegendSymbol: typeof LegendSymbol.drawRectangle;
    getCenter: typeof CU['getCenter'];
    pointClass: typeof PiePoint;
}
extend(PieSeries.prototype, {

    axisTypes: [],

    directTouch: true,

    drawGraph: void 0,

    drawLegendSymbol: LegendSymbol.drawRectangle,

    drawTracker: ColumnSeries.prototype.drawTracker,

    getCenter: CU.getCenter,

    getSymbol: noop,

    isCartesian: false,

    noSharedTooltip: true,

    pointAttribs: ColumnSeries.prototype.pointAttribs,

    pointClass: PiePoint,

    requireSorting: false,

    searchPoint: noop as any,

    trackerGroups: ['group', 'dataLabelsGroup']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pie: typeof PieSeries;
    }
}
SeriesRegistry.registerSeriesType('pie', PieSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PieSeries;
