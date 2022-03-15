/* *
 *
 *  (c) 2010-2022 Rafal Sebestjanski, Piotr Madej
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

import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';

import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';

const { bubble, pie, sunburst } = SeriesRegistry.seriesTypes;
import CU from './CenteredUtilities.js';
const { getCenter } = CU;

const drawPointsFunctions: { [key: string]: Function; } = {
    pieDrawPoints: pie.prototype.drawPoints,
    sunburstDrawPoints: sunburst && sunburst.prototype.drawPoints
};

const translateFunctions: { [key: string]: Function; } = {
    pieTranslate: pie.prototype.translate,
    sunburstTranslate: sunburst && sunburst.prototype.translate
};

import U from '../Core/Utilities.js';
import Chart from '../Core/Chart/Chart';
const {
    addEvent,
    defined,
    find,
    isNumber
} = U;

/* *
 *
 *  Declarations
 *
 * */

type BubblePxExtremes = { minPxSize: number; maxPxSize: number };
type BubbleZExtremes = { zMin: number; zMax: number };

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        onPoint?: SeriesOnPointComposition.Additions;
        getConnectorAttributes(): SVGAttributes|void;
        getRadii(
            zMin: number,
            zMax: number,
            minSize: number,
            maxSize: number
        ): void;
        getRadius(
            zMin: number,
            zMax: number,
            minSize: number,
            maxSize: number,
            value: (number|null|undefined),
            yValue?: (number|null|undefined)
        ): (number|null);
        getPxExtremes(): BubblePxExtremes;
        getZExtremes(): BubbleZExtremes|undefined;
        seriesDrawConnector(): void;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        onPoint?: OnPoint;
    }
}

interface OnPoint {
    connectorOptions?: SVGAttributes;
    id: string;
    position?: Position;
    z?: number;
}

interface Position {
    x?: number
    y?: number;
    offsetX?: number;
    offsetY?: number;
}

/* *
 *
 *  Composition
 *
 * */

namespace SeriesOnPointComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class SeriesComposition extends Series {
        onPoint: Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends the series with a small addition.
     *
     * @private
     *
     * @param SeriesClass
     * Series class to use.
     *
     * @param ChartClass
     * Chart class to use.
     */
    export function compose<T extends typeof Series>(
        SeriesClass: T,
        ChartClass: typeof Chart
    ): (typeof SeriesComposition&T) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            const seriesProto = SeriesClass.prototype as SeriesComposition,
                bubbleProto = bubble.prototype;

            seriesProto.getConnectorAttributes = getConnectorAttributes;
            seriesProto.seriesDrawConnector = seriesDrawConnector;

            const pieProto = pie.prototype;

            pieProto.getCenter = seriesGetCenter;
            pieProto.drawPoints = seriesDrawPoints;
            pieProto.translate = seriesTranslate;
            pieProto.bubblePadding = true;
            pieProto.useMapGeometry = true;
            pieProto.getRadius = bubbleProto.getRadius;
            pieProto.getRadii = bubbleProto.getRadii;
            pieProto.getZExtremes = bubbleProto.getZExtremes;
            pieProto.getPxExtremes = bubbleProto.getPxExtremes;

            if (sunburst) {
                const sunburstProto = sunburst.prototype;

                sunburstProto.getCenter = seriesGetCenter;
                sunburstProto.drawPoints = seriesDrawPoints;
                sunburstProto.translate = seriesTranslate;
                sunburstProto.bubblePadding = true;
                sunburstProto.useMapGeometry = true;
                sunburstProto.getRadius = bubbleProto.getRadius;
                sunburstProto.getRadii = bubbleProto.getRadii;
                sunburstProto.getZExtremes = bubbleProto.getZExtremes;
                sunburstProto.getPxExtremes = bubbleProto.getPxExtremes;
            }

            addEvent(SeriesClass, 'afterInit', afterInit);
            addEvent(SeriesClass, 'update', update);
            addEvent(SeriesClass, 'hide', Additions.prototype.showOrHide);
            addEvent(SeriesClass, 'show', Additions.prototype.showOrHide);
        }

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            addEvent(ChartClass, 'beforeRender', Additions.prototype.getZData);
            addEvent(ChartClass, 'beforeRedraw', Additions.prototype.getZData);
        }

        return SeriesClass as (typeof SeriesComposition&T);
    }

    /**
     * Clear bubbleZExtremes to reset z calculations on update.
     *
     * @ignore
    */
    function update(this: Series): void {
        delete this.chart.bubbleZExtremes;
    }

    /**
     * Initialize Series on point on series init.
     *
     * @ignore
    */
    function afterInit(this: Series): void {
        if (this.options.onPoint) {
            this.onPoint = new Additions(this as SeriesComposition);
        }
    }

    /**
     * Fire series.getRadii method to calculate required z data before original
     * translate.
     *
     * @ignore
     * @function Highcharts.Series#translate
    */
    function seriesTranslate(this: Series): void {
        this.getRadii(0, 0, 0, 0);

        translateFunctions[this.type + 'Translate'].call(this);
    }

    /**
     * Recalculate series.center (x, y and size).
     *
     * @ignore
     * @function Highcharts.Series#getCenter
    */
    function seriesGetCenter(this: Series): Array<number> {
        const onPointOptions = this.options.onPoint;

        let ret = getCenter.call(this);

        if (onPointOptions) {
            const connectedPoint = this.chart.get(onPointOptions.id);

            if (
                connectedPoint instanceof Point &&
                defined(connectedPoint.plotX) &&
                defined(connectedPoint.plotY)
            ) {
                ret[0] = connectedPoint.plotX;
                ret[1] = connectedPoint.plotY;
            }

            const position = onPointOptions.position;

            if (position) {
                if (defined(position.x)) {
                    ret[0] = position.x;
                }

                if (defined(position.y)) {
                    ret[1] = position.y;
                }

                if (position.offsetX) {
                    ret[0] += position.offsetX;
                }

                if (position.offsetY) {
                    ret[1] += position.offsetY;
                }
            }
        }

        // Get and set the size
        const radius = this.radii && this.radii[this.index];

        if (isNumber(radius)) {
            ret[2] = radius * 2;
        }

        return ret;
    }

    /**
     * Get connector line path and styles that connects series and point.
     *
     * @private
     *
     * @return {Highcharts.SVGAttributes} attribs - the path and styles.
     */
    function getConnectorAttributes(this: Series): SVGAttributes|void {
        const chart = this.chart,
            onPointOptions = this.options.onPoint;

        if (!onPointOptions) {
            return;
        }

        const connectorOpts = onPointOptions.connectorOptions || {},
            position = onPointOptions.position,
            connectedPoint = chart.get(onPointOptions.id);

        if (
            !(connectedPoint instanceof Point) ||
            !position ||
            !defined(connectedPoint.plotX) ||
            !defined(connectedPoint.plotY)
        ) {
            return;
        }

        const xFrom = defined(position.x) ? position.x : connectedPoint.plotX,
            yFrom = defined(position.y) ? position.y : connectedPoint.plotY,
            xTo = xFrom + (position.offsetX || 0),
            yTo = yFrom + (position.offsetY || 0),
            width = connectorOpts.width || 1,
            color = (connectorOpts as any).color || this.color,
            dashStyle = (connectorOpts as any).dashStyle;

        let attribs: SVGAttributes = {
            d: SVGRenderer.prototype.crispLine([
                ['M', xFrom, yFrom],
                ['L', xTo, yTo]
            ], width, 'ceil')
        };

        attribs['stroke-width'] = width;

        if (!chart.styledMode) {
            attribs.stroke = color;
            attribs.dashstyle = dashStyle;
        }

        return attribs;
    }

    /**
     * Draw connector line that connects series and initial point's position.
     * @private
     */
    function seriesDrawConnector(this: Series): void {
        if (this.onPoint) {
            if (!this.onPoint.connector) {
                this.onPoint.connector = this.chart.renderer.path()
                    .addClass('highcharts-connector-seriesonpoint')
                    .attr({
                        zIndex: -1
                    })
                    .add(this.markerGroup);
            }

            const attribs = this.getConnectorAttributes();

            attribs && this.onPoint.connector.attr(attribs);
        }
    }

    function seriesDrawPoints(this: Series): void {
        drawPointsFunctions[this.type + 'DrawPoints'].call(this);

        this.seriesDrawConnector();
    }

    /* *
     *
     *  Classes
     *
     * */

    /**
     * @private
     */
    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(series: SeriesComposition) {
            this.series = series;
            this.options = series.options.onPoint;
        }

        /* *
         *
         *  Properties
         *
         * */

        public series: SeriesComposition;

        public connector?: SVGElement;

        public options?: OnPoint;

        /**
         * @ignore
         */
        public getZData(this: Chart): void {
            const zData: Array<number|null> = [];

            this.series.forEach((series: Series): void => {
                const onPointOpts = series.options.onPoint;

                zData.push(onPointOpts && onPointOpts.z ? onPointOpts.z : null);
            });

            this.series.forEach((series: Series): void => {
                // Save z values of all the series
                series.zData = zData;
            });
        }

        /**
         * @ignore
         */
        public showOrHide(this: Series): void {
            const allSeries = this.chart.series;

            // When toggling a series visibility, loop through all points
            this.points.forEach((point): void => {
                // Find all series that are on toggled points
                const series = find(allSeries, (series): boolean => {
                    const id = ((series.onPoint || {}).options || {}).id;

                    if (!id) {
                        return false;
                    }

                    return id === point.id;
                });

                // And also toggle series that are on toggled points.
                // Redraw is not needed because it's fired later
                // after showOrhide event
                series && series.setVisible(!series.visible, false);
            });
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesOnPointComposition;

/* *
 *
 *  API Options
 *
 * */

/**
 * Options for the `Series on point` feature. Only `pie` and `sunburst` series
 * are supported at this moment.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        {object}
 * @apioption   plotOptions.series.onPoint
 */

/**
 * Options for the connector in the `Series on point` feature.
 *
 * In styled mode, the connector can be styled with the
 * `.highcharts-connector-seriesonpoint` class name.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        {object}
 * @apioption   plotOptions.series.onPoint.connectorOptions
 */

/**
 * Color of a connector line. By default it's the series' color.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        {string}
 * @apioption   plotOptions.series.onPoint.connectorOptions.color
 */

/**
 * A name for the dash style to use for connector.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        {string}
 * @apioption   plotOptions.series.onPoint.connectorOptions.dashStyle
 */

/**
 * Pixel width of a connector line.
 *
 * @default     1
 * @requires    modules/series-on-point
 * @type        {number}
 * @since       next
 * @apioption   plotOptions.series.onPoint.connectorOptions.width
*/

/**
 * An id of the point that we connect series to. Only points with a given
 * `plotX` and `plotY` values and map points are valid.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {string}
 * @apioption  plotOptions.series.onPoint.id
 */

/**
 * Options allowing to set a position and an offset of the series in the
 * `Series on point` feature.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        {object}
 * @apioption   plotOptions.series.onPoint.position
 */

/**
 * Series center offset from the original x position. If defined, the connector
 * line is drawn connecting original position with new position.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.offsetX
 */

/**
 * Series center offset from the original y position. If defined, the connector
 * line is drawn from original position to a new position.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.offsetY
 */

/**
 * X position of the series center. By default, the series is displayed on a
 * point that it's connected to.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.x
 */

/**
 * Y position of the series center. By default, the series is displayed on a
 * point that it's connected to.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.y
 */

''; // keeps doclets above in transpiled file
