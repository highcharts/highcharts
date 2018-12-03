/**
 * (c) 2010-2018 Daniel Studencki
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var error = H.error;

var requiredIndicatorMixin = {
    /**
     * Check whether given indicator is loaded, else throw error.
     * @param {function} indicator Indicator constructor function.
     * @param {string} requiredIndicator required indicator type.
     * @param {string} type Type of indicator where function was called (parent).
     * @param {function} callback Callback which is triggered if the given
     *                            indicator is loaded. Takes indicator as
     *                            an argument.
     * @param {string} errMessage Error message that will be logged in console.
     * @returns {boolean} Returns false when there is no required indicator loaded.
     */
    isParentLoaded: function (
        indicator,
        requiredIndicator,
        type,
        callback,
        errMessage
    ) {
        if (indicator) {
            return callback ? callback(indicator) : true;
        }
        error(
            errMessage || this.generateMessage(type, requiredIndicator)
        );
        return false;
    },
    generateMessage: function (indicatorType, required) {
        return 'Error: "' + indicatorType +
            '" indicator type requires "' + required +
            '" indicator loaded before. Please read docs: ' +
            'https://api.highcharts.com/highstock/plotOptions.' +
            indicatorType;
    }
};
export default requiredIndicatorMixin;
