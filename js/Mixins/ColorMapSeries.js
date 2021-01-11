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
import H from '../Core/Globals.js';
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
var defined = U.defined;
var noop = H.noop, seriesTypes = H.seriesTypes;
/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorMapPointMixin
 */
var colorMapPointMixin = {
    dataLabelOnNull: true,
    /* eslint-disable valid-jsdoc */
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    isValid: function () {
        // undefined is allowed
        return (this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity);
    },
    /**
     * @private
     */
    setState: function (state) {
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
var colorMapSeriesMixin = {
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
    colorAttribs: function (point) {
        var ret = {};
        if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
};
var exports = {
    colorMapPointMixin: colorMapPointMixin,
    colorMapSeriesMixin: colorMapSeriesMixin
};
export default exports;
