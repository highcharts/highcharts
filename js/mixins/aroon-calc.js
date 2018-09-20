/**
 * (c) 2010-2018 Wojciech Chmiel
 *
 * License: www.highcharts.com/license
 */

'use strict';

var aroonIndicatorMixin = {

    /**
     * Index of element with minimal value
     * @param {array} arr Data array with values
     * @returns {number} Returns index of minimal element
     */
    minIndexInArray: function (arr) {
        var minValue = Math.min.apply(null, arr);
        return arr.lastIndexOf(minValue);
    },

    /**
     * Index of element with maximal value
     * @param {array} arr Data array with values
     * @returns {number} Returns index of maximal element
     */
    maxIndexInArray: function (arr) {
        var maxValue = Math.max.apply(null, arr);
        return arr.lastIndexOf(maxValue);
    },

    /**
     * Calculate aroon Up and Down indicators
     * @param {array} dataset Data array with points in particular period
     * @param {number} period Indicator period
     * @param {number} low data low index in dataset (not required)
     * @param {number} high data high index in dataset (not required)
     * @returns {object} Returns object with aroon Up and Down values
     */
    calculateAroonUpAndDown: function (dataset, period, low = 2, high = 1) {
        var xLow,
            xHigh;

        xLow = this.minIndexInArray(dataset.map(function (elem) {
            if (elem[low]) {
                return elem[low];
            }
            return elem;
        }));

        xHigh = this.maxIndexInArray(dataset.map(function (elem) {
            if (elem[high]) {
                return elem[high];
            }
            return elem;
        }));

        return {
            aroonUp: (xHigh / period) * 100,
            aroonDown: (xLow / period) * 100
        };
    }
};

export default aroonIndicatorMixin;
