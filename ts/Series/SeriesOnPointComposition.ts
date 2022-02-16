/* *
 *
 *  (c) 2010-2021 Rafal Sebestjanski, Piotr Madej
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

const { bubble, pie, sunburst } = SeriesRegistry.seriesTypes;
import CU from './CenteredUtilities.js';
const { getCenter } = CU;

// const pieDrawPoints = pie.prototype.drawPoints;
// const sunburstDrawPoints = sunburst.prototype.drawPoints;
const drawPointsFunctions = {
    pieDrawPoints: pie.prototype.drawPoints,
    sunburstDrawPoints: sunburst.prototype.drawPoints
};
// const pieTranslate = pie.prototype.translate;
// const sunburstTranslate = sunburst.prototype.translate;
const translateFunctions = {
    pieTranslate: pie.prototype.translate,
    sunburstTranslate: sunburst.prototype.translate
};

import U from '../Core/Utilities.js';
import Chart from '../Core/Chart/Chart';
const {
    addEvent,
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
        seriesDrawConnector(): void;
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

            const seriesProto = SeriesClass.prototype as SeriesComposition;

            seriesProto.getConnectorAttributes = getConnectorAttributes;
            seriesProto.seriesDrawConnector = seriesDrawConnector;

            pie.prototype.getCenter = seriesGetCenter;
            pie.prototype.drawPoints = seriesDrawPoints;
            pie.prototype.translate = seriesTranslate;
            pie.prototype.bubblePadding = true;
            pie.prototype.getRadius = bubble.prototype.getRadius;
            pie.prototype.getRadii = bubble.prototype.getRadii;
            pie.prototype.getZExtremes = bubble.prototype.getZExtremes;
            pie.prototype.getPxExtremes = bubble.prototype.getPxExtremes;

            sunburst.prototype.getCenter = seriesGetCenter;
            sunburst.prototype.drawPoints = seriesDrawPoints;
            sunburst.prototype.translate = seriesTranslate;
            sunburst.prototype.bubblePadding = true;
            sunburst.prototype.getRadius = bubble.prototype.getRadius;
            sunburst.prototype.getRadii = bubble.prototype.getRadii;
            sunburst.prototype.getZExtremes = bubble.prototype.getZExtremes;
            sunburst.prototype.getPxExtremes = bubble.prototype.getPxExtremes;

            addEvent(SeriesClass, 'afterInit', afterInit);
            addEvent(SeriesClass, 'update', update);
        }

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            addEvent(ChartClass, 'beforeRender', getZData);
            addEvent(ChartClass, 'beforeRedraw', getZData);
        }

        return SeriesClass as (typeof SeriesComposition&T);
    }

    /**
     * @ignore
     * @function Highcharts.Chart#getZData
     */
    function getZData(this: Chart): void {
        const zData: Array<number> = [];

        this.series.forEach((series: Series): void => {
            if (series.options.onPoint) {
                zData.push(series.options.onPoint.z);
            }
        });

        this.series.forEach((series: Series): void => {
            series.zData = zData;
        });
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

        (translateFunctions as any)[this.type + 'Translate'].call(this);
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

        if (onPointOptions) {
            const connectorOpts = onPointOptions.connectorOptions,
                position = onPointOptions.position,
                connectedPoint = chart.get(onPointOptions.id);

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
                        connectedPoint.plotX + (position.offsetX || 0),
                        connectedPoint.plotY + (position.offsetY || 0)
                    ]], connectorOpts.width || 1, 'ceil')
                };

                attribs['stroke-width'] = connectorOpts.width;

                if (!chart.styledMode) {
                    attribs.stroke = (connectorOpts as any).color;

                    if ((connectorOpts as any).dashStyle) {
                        attribs.dashstyle = (connectorOpts as any).dashStyle;
                    }
                }

                return attribs;
            }
        }
    }

    /**
     * Draw connector line that connects series and initial point's position.
     * @private
     */
    function seriesDrawConnector(this: Series): void {
        if (this.onPoint) {
            if (!this.onPoint.connector) {
                (this.onPoint.connector as any) = this.chart.renderer.path()
                    .addClass('highcharts-connector-seriespoint')
                    .attr({
                        zIndex: -1
                    })
                    .add(this.markerGroup);
            }

            const attribs = this.getConnectorAttributes();
            if (this.onPoint.connector) {
                (this.onPoint.connector as any)['attr'](attribs);
            }
        }
    }

    function seriesDrawPoints(this: Series): void {
        (drawPointsFunctions as any)[this.type + 'DrawPoints'].call(this);

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

        public connector?: SVGElement = void 0 as any;

        public connectorOptions: SVGAttributes = void 0 as any;

        public id: string = void 0 as any;

        public position: Position;

        z: number = void 0 as any;
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
