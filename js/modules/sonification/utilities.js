/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Utility functions for sonification.
 *
 * License: www.highcharts.com/license
 */

'use strict';

var utilities = {

    /**
     * Calculate the extreme values in a chart for a data prop.
     * @private
     * @param {Highcharts.Chart} chart The chart
     * @param {String} prop The data prop to find extremes for
     * @return {Object} Object with min and max properties
     */
    calculateDataExtremes: function (chart, prop) {
        var extremes = {
            min: Infinity,
            max: -Infinity
        };
        chart.series.forEach(function (series) {
            series.data.forEach(function (point) {
                var val = point[prop] !== undefined ?
                        point[prop] : point.options[prop];
                extremes.min = Math.min(extremes.min, val);
                extremes.max = Math.max(extremes.max, val);
            });
        });
        return extremes;
    }

};

export default utilities;
