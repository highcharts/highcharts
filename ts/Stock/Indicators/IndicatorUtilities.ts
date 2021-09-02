/**
 *
 *  (c) 2010-2021 Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SMAIndicator from './SMA/SMAIndicator';

import U from '../../Core/Utilities.js';
const { error } = U;

/* *
 *
 *  Functions
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

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
function isParentLoaded<T extends typeof SMAIndicator>(
    indicator: (T|undefined),
    requiredIndicator: string,
    type: string,
    callback: (indicator: T) => (boolean|undefined),
    errMessage?: string
): (boolean|undefined) {
    if (indicator) {
        return callback ? callback(indicator) : true;
    }
    error(
        errMessage || generateMessage(type, requiredIndicator)
    );
    return false;
}

/**
 * @private
 * @param {string} indicatorType
 *        Indicator type
 * @param {string} required
 *        Required indicator
 * @return {string}
 *         Error message
 */
function generateMessage(
    indicatorType: string,
    required: string
): string {
    return 'Error: "' + indicatorType +
        '" indicator type requires "' + required +
        '" indicator loaded before. Please read docs: ' +
        'https://api.highcharts.com/highstock/plotOptions.' +
        indicatorType;
}

/* *
 *
 *  Default Export
 *
 * */

const IndicatorUtilities = {
    isParentLoaded,
    generateMessage
};

export default IndicatorUtilities;
