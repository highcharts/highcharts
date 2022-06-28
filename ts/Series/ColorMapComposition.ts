/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

// @todo cleanup & reduction - consider composition

'use strict';

import type ScatterPoint from './Scatter/ScatterPoint';
import type ScatterSeries from './Scatter/ScatterSeries';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';

import H from '../Core/Globals.js';
const {
    noop,
    seriesTypes
} = H;
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
const {
    defined,
    addEvent
} = U;

declare module '../Core/Series/PointLike' {
    interface PointLike {
        dataLabelOnNull?: boolean;
    }
}

// Move points to the top of the z-index order when hovered
addEvent(Point, 'afterSetState', function (e?: Record<string, any>): void {
    const point = this as ColorMapMixin.ColorMapPoint;
    if (point.moveToTopOnHover && point.graphic) {
        point.graphic.attr({
            zIndex: e && e.state === 'hover' ? 1 : 0
        });
    }
});


/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorMapPointMixin
 */
const PointMixin = {
    dataLabelOnNull: true,
    moveToTopOnHover: true,

    /* eslint-disable valid-jsdoc */
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    isValid: function (this: ColorMapMixin.ColorMapPoint): boolean {
        return (
            this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity &&
            // undefined is allowed, but NaN is not (#17279)
            (this.value === void 0 || !isNaN(this.value))
        );
    }

    /* eslint-enable valid-jsdoc */
};

/**
 * @private
 * @mixin Highcharts.colorMapSeriesMixin
 */
const SeriesMixin = {
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
     *         The SVG attributes
     */
    colorAttribs: function (
        this: ColorMapMixin.ColorMapSeries,
        point: ColorMapMixin.ColorMapPoint
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

namespace ColorMapMixin {

    export interface ColorMapPoint extends ScatterPoint {
        dataLabelOnNull?: boolean;
        moveToTopOnHover?: boolean;
        series: ColorMapSeries;
        value: (number|null);
        isValid(): boolean;
    }

    export interface ColorMapSeries extends ScatterSeries {
        colorProp?: string;
        data: Array<ColorMapPoint>;
        parallelArrays: Array<string>;
        pointArrayMap: Array<string>;
        points: Array<ColorMapPoint>;
        trackerGroups: Array<string>;
        colorAttribs(point: ColorMapPoint): SVGAttributes;
    }

}

const ColorMapMixin = {
    PointMixin,
    SeriesMixin
};

export default ColorMapMixin;
