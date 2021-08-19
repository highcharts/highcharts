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

import type ScatterPoint from './Scatter/ScatterPoint';
import type ScatterSeries from './Scatter/ScatterSeries';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';

import H from '../Core/Globals.js';
const { noop } = H;
import Point from '../Core/Series/Point.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const { seriesTypes } = SeriesRegistry;
import U from '../Core/Utilities.js';
const {
    defined,
    addEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/PointLike' {
    interface PointLike {
        dataLabelOnNull?: boolean;
    }
}

/* *
 *
 *  Functions
 *
 * */

// Move points to the top of the z-index order when hovered
addEvent(Point, 'afterSetState', function (e?: Record<string, any>): void {
    const point = this as ColorMapComposition.PointComposition;
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
const colorMapPointMixin = {
    dataLabelOnNull: true,
    moveToTopOnHover: true,

    /* eslint-disable valid-jsdoc */
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    isValid: function (this: ColorMapComposition.PointComposition): boolean {
        // undefined is allowed
        return (
            this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity
        );
    }

    /* eslint-enable valid-jsdoc */
};

/**
 * @private
 * @mixin Highcharts.colorMapSeriesMixin
 */
const colorMapSeriesMixin = {
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
        this: ColorMapComposition.SeriesComposition,
        point: ColorMapComposition.PointComposition
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

const ColorMapComposition = {
    colorMapPointMixin,
    colorMapSeriesMixin
};

namespace ColorMapComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export interface PointComposition extends ScatterPoint {
        dataLabelOnNull: boolean;
        moveToTopOnHover?: boolean;
        series: SeriesComposition;
        value: (number|null);
        isValid(): boolean;
    }

    export interface SeriesComposition extends ScatterSeries {
        colorProp?: string;
        data: Array<PointComposition>;
        parallelArrays: Array<string>;
        pointArrayMap: Array<string>;
        points: Array<PointComposition>;
        trackerGroups: Array<string>;
        colorAttribs(point: PointComposition): SVGAttributes;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColorMapComposition;
