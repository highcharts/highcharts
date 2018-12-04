/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var defined = H.defined,
    noop = H.noop,
    seriesTypes = H.seriesTypes;

/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorPointMixin
 */
H.colorPointMixin = {
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     *
     * @function Highcharts.colorPointMixin.isValid
     *
     * @return {boolean}
     */
    isValid: function () {
        // undefined is allowed
        return (
            this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity
        );
    },

    /**
     * Set the visibility of a single point
     *
     * @function Highcharts.colorPointMixin.setVisible
     *
     * @param {boolean} visible
     */
    setVisible: function (vis) {
        var point = this,
            method = vis ? 'show' : 'hide';

        point.visible = Boolean(vis);

        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key) {
            if (point[key]) {
                point[key][method]();
            }
        });
    },
    /**
     * @function Highcharts.colorPointMixin.setState
     *
     * @param {string} state
     */
    setState: function (state) {
        H.Point.prototype.setState.call(this, state);
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
    }
};

/**
 * @private
 * @mixin Highcharts.colorSeriesMixin
 */
H.colorSeriesMixin = {
    pointArrayMap: ['value'],
    axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
    optionalAxis: 'colorAxis',
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    getSymbol: noop,
    parallelArrays: ['x', 'y', 'value'],
    colorKey: 'value',

    pointAttribs: seriesTypes.column.prototype.pointAttribs,

    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     *
     * @function Highcharts.colorSeriesMixin.translateColors
     */
    translateColors: function () {
        var series = this,
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;

        this.data.forEach(function (point) {
            var value = point[colorKey],
                color;

            color = point.options.color ||
                (
                    point.isNull ?
                        nullColor :
                        (colorAxis && value !== undefined) ?
                            colorAxis.toColor(value, point) :
                            point.color || series.color
                );

            if (color) {
                point.color = color;
            }
        });
    },

    /**
     * Get the color attibutes to apply on the graphic
     *
     * @function Highcharts.colorSeriesMixin.colorAttribs
     *
     * @param {Highcharts.Point} point
     *
     * @return {Highcharts.Dictionary<Highcharts.ColorString>}
     */
    colorAttribs: function (point) {
        var ret = {};
        if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
};
