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
import type { StatesOptionsKey } from '../Core/Series/StatesOptions';
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
            series: ColorMapSeries;
            value: (number|null);
            isValid(): boolean;
            setState(state?: StatesOptionsKey): void;
        }
        interface ColorMapPointMixin {
            dataLabelOnNull: ColorMapPoint['dataLabelOnNull'];
            isValid: ColorMapPoint['isValid'];
            setState: ColorMapPoint['setState'];
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
    defined
} = U;

var noop = H.noop,
    seriesTypes = H.seriesTypes;

/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorMapPointMixin
 */
const colorMapPointMixin = {
    dataLabelOnNull: true,
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
    },

    /**
     * @private
     */
    setState: function (
        this: Highcharts.ColorMapPoint,
        state?: StatesOptionsKey
    ): void {
        Point.prototype.setState.call(this, state);
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
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
        var ret: SVGAttributes = {};

        if (defined(point.color)) {
            (ret as any)[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
};

const exports = {
    colorMapPointMixin,
    colorMapSeriesMixin
};

export default exports;
