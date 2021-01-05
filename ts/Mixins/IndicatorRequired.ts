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

import type SMAIndicator from '../Stock/Indicators/SMA/SMAIndicator';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Indicator {
            generateMessage: RequiredIndicatorMixin['generateMessage'];
            isParentLoaded: RequiredIndicatorMixin['isParentLoaded'];
            prototype: SMAIndicator;
        }

        interface IndicatorCallbackFunction {
            (indicator: Indicator): (boolean|undefined);
        }
        interface RequiredIndicatorMixin {
            generateMessage(indicatorType: string, required: string): string;
            isParentLoaded(
                indicator: (Indicator|undefined),
                requiredIndicator: string,
                type: string,
                callback: IndicatorCallbackFunction,
                errMessage?: string
            ): (boolean|undefined);
        }
    }
}

import U from '../Core/Utilities.js';
const {
    error
} = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

const requiredIndicatorMixin: Highcharts.RequiredIndicatorMixin = {
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
    isParentLoaded: function (
        this: Highcharts.Indicator,
        indicator: (Highcharts.Indicator|undefined),
        requiredIndicator: string,
        type: string,
        callback: Highcharts.IndicatorCallbackFunction,
        errMessage?: string
    ): (boolean|undefined) {
        if (indicator) {
            return callback ? callback(indicator) : true;
        }
        error(
            errMessage || this.generateMessage(type, requiredIndicator)
        );
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
    generateMessage: function (
        indicatorType: string,
        required: string
    ): string {
        return 'Error: "' + indicatorType +
            '" indicator type requires "' + required +
            '" indicator loaded before. Please read docs: ' +
            'https://api.highcharts.com/highstock/plotOptions.' +
            indicatorType;
    }
};

export default requiredIndicatorMixin;
