/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var defined = H.defined,
    each = H.each,
    noop = H.noop,
    seriesTypes = H.seriesTypes;

/**
 * Mixin for maps and heatmaps
 */
H.colorPointMixin = {
    /**
     * Color points have a value option that determines whether or not it is
     * a null point
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
     */
    setVisible: function (vis) {
        var point = this,
            method = vis ? 'show' : 'hide';

        point.visible = Boolean(vis);

        // Show and hide associated elements
        each(['graphic', 'dataLabel'], function (key) {
            if (point[key]) {
                point[key][method]();
            }
        });
    },
    setState: function (state) {
        H.Point.prototype.setState.call(this, state);
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
    }
};

H.colorSeriesMixin = {
    pointArrayMap: ['value'],
    axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
    optionalAxis: 'colorAxis',
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    getSymbol: noop,
    parallelArrays: ['x', 'y', 'value'],
    colorKey: 'value',

    /*= if (build.classic) { =*/
    pointAttribs: seriesTypes.column.prototype.pointAttribs,
    /*= } =*/

    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     */
    translateColors: function () {
        var series = this,
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;

        each(this.data, function (point) {
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
     */
    colorAttribs: function (point) {
        var ret = {};
        if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }
};
