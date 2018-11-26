/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Utility functions for sonification.
 *
 * License: www.highcharts.com/license
 */

'use strict';

import musicalFrequencies from 'musicalFrequencies.js';

var utilities = {

    // List of musical frequencies from C0 to C8
    musicalFrequencies: musicalFrequencies,

    /**
     * Get a musical scale by specifying the semitones from 1-12 to include.
     *  1: C, 2: C#, 3: D, 4: D#, 5: E, 6: F,
     *  7: F#, 8: G, 9: G#, 10: A, 11: Bb, 12: B
     *
     * @private
     * @param {Array<number>} semitones Array of semitones from 1-12 to include
     *      in the scale. Duplicate entries are ignored.
     *
     * @return {Array<number>} Array of frequencies from C0 to C8 that are
     *  included in this scale.
     */
    getMusicalScale: function (semitones) {
        return musicalFrequencies.filter(function (freq, i) {
            var interval = i % 12 + 1;
            return semitones.some(function (allowedInterval) {
                return allowedInterval === interval;
            });
        });
    },

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
