/**
 * (c) 2010-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var reduce = H.reduce;

var reduceArrayMixin = {
    minInArray: function (arr, index) {
        return reduce(arr, function (min, target) {
            return Math.min(min, target[index]);
        }, Infinity);
    },
    maxInArray: function (arr, index) {
        return H.reduce(arr, function (min, target) {
            return Math.max(min, target[index]);
        }, 0);
    }
};
export default reduceArrayMixin;
