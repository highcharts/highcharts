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

import type ScatterPoint from './Scatter/ScatterPoint';
import type ScatterSeries from './Scatter/ScatterSeries';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';

import H from '../Core/Globals.js';

declare module '../Core/Series/PointLike' {
    interface PointLike {
        dataLabelOnNull?: boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ColorMapPoint extends ScatterPoint {
            dataLabelOnNull: boolean;
            moveToTopOnHover?: boolean;
            series: ColorMapSeries;
            value: (number|null);
            isValid(): boolean;
        }
        interface ColorMapPointMixin {
            dataLabelOnNull: ColorMapPoint['dataLabelOnNull'];
            moveToTopOnHover: ColorMapPoint['moveToTopOnHover'];
            isValid: ColorMapPoint['isValid'];
        }
        interface ColorMapSeries extends ScatterSeries {
            colorProp?: string;
            data: Array<ColorMapPoint>;
            parallelArrays: Array<string>;
            pointArrayMap: Array<string>;
            points: Array<ColorMapPoint>;
            trackerGroups: Array<string>;
            colorAttribs(point: ColorMapPoint): SVGAttributes;
        }
        interface ColorMapSeriesMixin {
            axisTypes: ColorSeries['axisTypes'];
            colorAttribs: ColorMapSeries['colorAttribs'];
            colorKey?: ColorSeries['colorKey'];
            getSymbol: () => void;
            parallelArrays: ColorMapSeries['parallelArrays'];
            pointArrayMap: ColorMapSeries['pointArrayMap'];
            pointAttribs: ColorMapSeries['pointAttribs'];
            trackerGroups: ColorMapSeries['trackerGroups'];
        }
        let colorMapPointMixin: ColorMapPointMixin;
        let colorMapSeriesMixin: ColorMapSeriesMixin;
    }
}

import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
const {
    defined,
    addEvent
} = U;

const noop = H.noop,
    seriesTypes = H.seriesTypes;


// Move points to the top of the z-index order when hovered
addEvent(Point, 'afterSetState', function (e?: Record<string, any>): void {
    const point = this; // eslint-disable-line no-invalid-this
    if ((point as Highcharts.ColorMapPoint).moveToTopOnHover && point.graphic) {
        point.graphic.attr({
            zIndex: e && e.state === 'hover' ? 1 : 0
        });
    }
});

/**
 * @private
 * @mixin Highcharts.colorMapSeriesMixin
 */
const colorMapSeriesMixinOld = {
    pointArrayMap: ['value'],
    axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    getSymbol: noop,
    parallelArrays: ['x', 'y', 'value'],
    colorKey: 'value',
    pointAttribs: seriesTypes.column.prototype.pointAttribs,

    /* eslint-disable valid-jsdoc */

    /**
     * Get the color attibutes to apply on the graphic
     * @private
     * @function Highcharts.colorMapSeriesMixin.colorAttribs
     * @param {Highcharts.Point} point
     * @return {Highcharts.SVGAttributes}
     */
    colorAttribs: function (
        this: Highcharts.ColorMapSeries,
        point: Highcharts.ColorMapPoint
    ): SVGAttributes {
        const ret: SVGAttributes = {};

        if (
            defined(point.color) &&
            (!point.state || point.state === 'normal') // #15746
        ) {
            (ret as any)[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
};

/* *
 *
 *  Composition
 *
 * */

namespace ColorMapSeries {

    export const colorMapSeriesMixin = colorMapSeriesMixinOld;

    /* *
     *
     *  Declarations
     *
     * */

    export declare class SeriesComposition extends ScatterSeries {
        pointClass: typeof PointComposition;
    }

    export declare class PointComposition extends ScatterPoint {
        dataLabelOnNull: boolean;
        moveToTopOnHover?: boolean;
        series: SeriesComposition;
        value: (number|null);
        isValid(): boolean;
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
     * @private
     */
    export function compose<T extends typeof ScatterSeries>(
        SeriesClass: T,
        PointClass?: T['prototype']['pointClass']
    ): (T&typeof SeriesComposition) {

        if (PointClass && composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);

            const pointProto = PointClass.prototype as PointComposition;

            pointProto.dataLabelOnNull = true;
            pointProto.moveToTopOnHover = true;
            pointProto.isValid = pointIsValid;
        }

        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);
        }

        return SeriesClass as (T&typeof SeriesComposition);
    }

    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    export function pointIsValid(this: PointComposition): boolean {
        // undefined is allowed
        return (
            this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColorMapSeries;
