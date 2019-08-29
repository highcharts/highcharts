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
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorPointMixin
 */
H.colorPointMixin = {
    /* eslint-disable valid-jsdoc */
    /**
     * Set the visibility of a single point
     * @private
     * @function Highcharts.colorPointMixin.setVisible
     * @param {boolean} visible
     * @return {void}
     */
    setVisible: function (vis) {
        var point = this, method = vis ? 'show' : 'hide';
        point.visible = Boolean(vis);
        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key) {
            if (point[key]) {
                point[key][method]();
            }
        });
    }
    /* eslint-enable valid-jsdoc */
};
/**
 * @private
 * @mixin Highcharts.colorSeriesMixin
 */
H.colorSeriesMixin = {
    optionalAxis: 'colorAxis',
    colorAxis: 0,
    /* eslint-disable valid-jsdoc */
    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     * @private
     * @function Highcharts.colorSeriesMixin.translateColors
     * @return {void}
     */
    translateColors: function () {
        var series = this, points = this.data.length ? this.data : this.points, nullColor = this.options.nullColor, colorAxis = this.colorAxis, colorKey = this.colorKey;
        points.forEach(function (point) {
            var value = point[colorKey], color;
            color = point.options.color ||
                (point.isNull ?
                    nullColor :
                    (colorAxis && value !== undefined) ?
                        colorAxis.toColor(value, point) :
                        point.color || series.color);
            if (color) {
                point.color = color;
            }
        });
    }
    /* eslint-enable valid-jsdoc */
};
