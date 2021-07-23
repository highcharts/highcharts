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

import type ScatterPoint from '../Series/Scatter/ScatterPoint';
import type ScatterSeries from '../Series/Scatter/ScatterSeries';
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
    isValid: function (this: Highcharts.ColorMapPoint): boolean {
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

const ColorMapSeries = {
    colorMapPointMixin,
    colorMapSeriesMixin
};

export default ColorMapSeries;
