/* *
 *
 *  (c) 2010-2021 Rafal i Pjoter
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
import type ColorString from '../Core/Color/ColorString';
import type ColorType from '../Core/Color/ColorType';

import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';

const { pie, bubble } = SeriesRegistry.seriesTypes;
const drawPoints = pie.prototype.drawPoints;
const getCenter = pie.prototype.getCenter;
const translate = pie.prototype.translate;

import U from '../Core/Utilities.js';
import Chart from '../Core/Chart/Chart';
const {
    addEvent,
    isArray,
    isObject,
    isNumber,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/PointLike' {
    interface PointLike {

    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        seriesDrawConnector(): void;
        getConnectorAttributes(): SVGAttributes|void;
        onPoint?: SeriesOnPointComposition.Additions;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        onPoint?: SeriesOnPointComposition.Additions;
    }
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

    export declare class PointComposition extends Point {

    }

    export declare class SeriesComposition extends Series {
        onPoint: Additions;
        initSeriesOnPoint(valueToAdd: number): void;
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
     * @param PointClass
     * Point class to use.
     */
    export function compose<T extends typeof Series>(
        SeriesClass: T,
        ChartClass: typeof Chart
        // PointClass: typeof Point
    ): (typeof SeriesComposition&T) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            const seriesProto = SeriesClass.prototype as SeriesComposition;
            pie.prototype.getCenter = seriesGetCenter;
            seriesProto.getConnectorAttributes = getConnectorAttributes;
            seriesProto.seriesDrawConnector = seriesDrawConnector;
            pie.prototype.drawPoints = seriesDrawPoints;
            pie.prototype.translate = seriesTranslate;
            (pie as any).prototype.bubblePadding = true;
            (pie as any).prototype.getRadius = bubble.prototype.getRadius;
            (pie as any).prototype.getRadii = bubble.prototype.getRadii;
            (pie as any).prototype.getZExtremes =
                bubble.prototype.getZExtremes;
            (pie as any).prototype.getPxExtremes =
                bubble.prototype.getPxExtremes;

            addEvent(pie, 'afterInit', afterInit);
            addEvent(pie, 'update', update);

        }

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            addEvent(ChartClass, 'beforeRender', getZData);
            addEvent(ChartClass, 'predraw', getZData);
        }

        return SeriesClass as (typeof SeriesComposition&T);
    }

    /**
     * Extend series.init by adding a methods to add a value.
     *
     * @ignore
     * @function Highcharts.Series#init
    */
    function getZData(this: Chart): void {
        const zData: Array<number> = [];

        this.series.forEach((series): void => {
            if (series.options.onPoint) {
                zData.push(series.options.onPoint.z);
            }
        });

        this.series.forEach((series): void => {
            series.zData = zData;
        });
    }

    /**
     * Extend series.init by adding a methods to add a value.
     *
     * @ignore
     * @function Highcharts.Series#init
    */
    function update(this: Series): void {
        delete this.chart.bubbleZExtremes;
    }

    /**
     * Extend series.init by adding a methods to add a value.
     *
     * @ignore
     * @function Highcharts.Series#init
    */
    function afterInit(this: Series): void {
        const options = this.options;
        let onPoint: Additions|undefined;

        if (options.onPoint) {
            onPoint = new Additions(this as SeriesComposition);
            onPoint.initSeriesOnPoint();
        }

        this.onPoint = onPoint;
    }

    function seriesTranslate(this: any): void {
        this.getRadii();

        translate.call(this);
    }

    function seriesGetCenter(this: Series): Array<number> {
        const onPointOptions = this.options.onPoint;

        let ret = getCenter.call(this);

        if (onPointOptions) {
            const connectedPoint = this.chart.get(onPointOptions.id);

            if (
                connectedPoint instanceof Point &&
                connectedPoint.plotX &&
                connectedPoint.plotY
            ) {
                ret[0] = connectedPoint.plotX;
                ret[1] = connectedPoint.plotY;
            }

            const position = onPointOptions.position;

            if (position) {
                if (position.x) {
                    ret[0] = position.x;
                }

                if (position.y) {
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

        const radius = this.radii && this.radii[(this.options as any).pieIndex];

        if (isNumber(radius)) {
            ret[2] = radius * 2;
        }

        // 0: centerX, relative to width
        // 1: centerY, relative to height
        // 2: size, relative to smallestSize
        // 3: innerSize, relative to size
        return ret;
    }

    /**
     * Get connector line path and styles that connects dumbbell point's low and
     * high values.
     * @private
     *
     * @param {Highcharts.Point} point The point to inspect.
     *
     * @return {Highcharts.SVGAttributes} attribs The path and styles.
     */
    function getConnectorAttributes(this: Series): SVGAttributes|void {
        const series = this,
            chart = series.chart,
            onPoint: any = series.options.onPoint,
            connectorOpts = onPoint && onPoint.connectorOptions,
            position = onPoint.position,
            connectedPoint = chart.get(onPoint.id);

        if (
            connectedPoint instanceof Point &&
            position &&
            connectedPoint.plotX &&
            connectedPoint.plotY
        ) {
            let attribs: SVGAttributes = {
                d: SVGRenderer.prototype.crispLine([[
                    'M',
                    connectedPoint.plotX,
                    connectedPoint.plotY
                ], [
                    'L',
                    connectedPoint.plotX + position.offsetX,
                    connectedPoint.plotY + position.offsetY
                ]], connectorOpts.width, 'ceil')
            };

            attribs['stroke-width'] = connectorOpts.width;

            if (!chart.styledMode) {
                attribs.stroke = connectorOpts.color;

                if (connectorOpts.dashStyle) {
                    attribs.dashstyle = connectorOpts.dashStyle;
                }
            }

            return attribs;
        }
    }

    /**
     * Draw connector line that connects dumbbell point's low and high values.
     * @private
     *
     * @param {Highcharts.Point} point The point to inspect.
     *
     */
    function seriesDrawConnector(this: Series): void {
        const series = this;
        // animationLimit = pick(series.options.animationLimit, 250),
        // verb = point.connector && series.chart.pointCount < animationLimit ?
        // 'animate' : 'attr';

        if (series.onPoint) {
            if (!series.onPoint.connector) {
                (series.onPoint as any).connector =
                    series.chart.renderer.path()
                        .addClass('highcharts-connector-seriespoint')
                        .attr({
                            zIndex: -1
                        })
                        .add(series.markerGroup);
            }

            const attribs = this.getConnectorAttributes();

            (series.onPoint as any).connector['attr'](attribs);
        }
    }

    function seriesDrawPoints(this: Series): void {
        const series = this;

        drawPoints.call(series);

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
            this.position = {};
        }

        /* *
         *
         *  Properties
         *
         * */

        public series: SeriesComposition;

        public connector: SVGElement = void 0 as any;

        public id: string = void 0 as any;

        public position: Position;

        z: number = void 0 as any;

        /**
         * @ignore
         * @function Highcharts.Series#initCompare
         *
         * @param {number} [valueToAdd]
         *        Will be added to 10.
         */
        public initSeriesOnPoint(): void {

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

''; // keeps doclets above in transpiled file
