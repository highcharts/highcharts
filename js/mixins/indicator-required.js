/**
 * (c) 2010-2018 Daniel Studencki
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var error = H.error;

/**
 * Check whether given indicator is loaded, else throw error.
 * @param {function} indicator Indicator constructor function.
 * @param {string} indicatorName Given indicator name.
 * @param {string} type Type of indicator where function was called.
 * @param {function} callback Callback which is triggered if the given
 *                            indicator is loaded.
 * @param {string} errMessage Error message that will be logged in console.
 * @returns {boolean} Returns false when there is no required indicator loaded.
 */
var requiredIndicatorMixin = {
    isParentIndicatorLoaded: function (
        indicator,
        indicatorName,
        type,
        callback,
        errMessage
    ) {
        var apiLink = 'https://api.highcharts.com/highstock/';

        if (indicator) {
            return callback(indicator);
        }
        error(
            errMessage || 'Error: "' + type +
            '" indicator type requires ' + indicatorName +
            ' indicator loaded before. Please read docs: ' +
            '' + apiLink + 'plotOptions.' + type
        );
        return false;
    }
};
export default requiredIndicatorMixin;
