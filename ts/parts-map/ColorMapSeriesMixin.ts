/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ColorMapPoint extends Point {
            dataLabelOnNull: boolean;
            series: ColorMapSeries;
            value: (number|null);
            isValid(): boolean;
            setState(state?: string): void;
        }
        interface ColorMapPointMixin {
            dataLabelOnNull: ColorMapPoint['dataLabelOnNull'];
            isValid: ColorMapPoint['isValid'];
            setState: ColorMapPoint['setState'];
        }
        interface ColorMapSeries extends Series {
            colorProp?: string;
            data: Array<ColorMapPoint>;
            parallelArrays: Array<string>;
            pointArrayMap: Array<string>;
            pointAttribs: ColumnSeries['pointAttribs'];
            trackerGroups: Array<string>;
            colorAttribs(point: ColorMapPoint): SVGAttributes;
        }
        interface ColorMapSeriesMixin {
            axisTypes: ColorSeries['axisTypes'];
            colorAttribs: ColorMapSeries['colorAttribs'];
            colorKey: ColorSeries['colorKey'];
            getSymbol: Function;
            parallelArrays: ColorMapSeries['parallelArrays'];
            pointArrayMap: ColorMapSeries['pointArrayMap'];
            pointAttribs: ColorMapSeries['pointAttribs'];
            trackerGroups: ColorMapSeries['trackerGroups'];
        }
        interface Point {
            dataLabelOnNull?: ColorMapPoint['dataLabelOnNull'];
        }
        let colorMapPointMixin: ColorMapPointMixin;
        let colorMapSeriesMixin: ColorMapSeriesMixin;
    }
}

import U from '../parts/Utilities.js';
var defined = U.defined;

var noop = H.noop,
    seriesTypes = H.seriesTypes;

/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorMapPointMixin
 */
H.colorMapPointMixin = {
    dataLabelOnNull: true,
    /* eslint-disable valid-jsdoc */
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     * @function Highcharts.colorMapPointMixin.isValid
     * @return {boolean}
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
     * @function Highcharts.colorMapPointMixin.setState
     * @param {string} state
     * @return {void}
     */
    setState: function (this: Highcharts.ColorMapPoint, state?: string): void {
        H.Point.prototype.setState.call(this, state);
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
H.colorMapSeriesMixin = {
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
    ): Highcharts.SVGAttributes {
        var ret = {} as Highcharts.SVGAttributes;

        if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
};
