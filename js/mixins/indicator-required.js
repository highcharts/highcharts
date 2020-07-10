/**
 *
 *  (c) 2010-2020 Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../Core/Utilities.js';
var error = U.error;
/* eslint-disable no-invalid-this, valid-jsdoc */
var requiredIndicatorMixin = {
    /**
     * Check whether given indicator is loaded, else throw error.
     * @private
     * @param {Highcharts.Indicator} indicator
     *        Indicator constructor function.
     * @param {string} requiredIndicator
     *        Required indicator type.
     * @param {string} type
     *        Type of indicator where function was called (parent).
     * @param {Highcharts.IndicatorCallbackFunction} callback
     *        Callback which is triggered if the given indicator is loaded.
     *        Takes indicator as an argument.
     * @param {string} errMessage
     *        Error message that will be logged in console.
     * @return {boolean}
     *         Returns false when there is no required indicator loaded.
     */
    isParentLoaded: function (indicator, requiredIndicator, type, callback, errMessage) {
        if (indicator) {
            return callback ? callback(indicator) : true;
        }
        error(errMessage || this.generateMessage(type, requiredIndicator));
        return false;
    },
    /**
     * @private
     * @param {string} indicatorType
     *        Indicator type
     * @param {string} required
     *        Required indicator
     * @return {string}
     *         Error message
     */
    generateMessage: function (indicatorType, required) {
        return 'Error: "' + indicatorType +
            '" indicator type requires "' + required +
            '" indicator loaded before. Please read docs: ' +
            'https://api.highcharts.com/highstock/plotOptions.' +
            indicatorType;
    }
};
export default requiredIndicatorMixin;
