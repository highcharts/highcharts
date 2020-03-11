/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Keyboard navigation handler base class definition
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../../parts/Utilities.js';
var find = U.find;
/**
 * Options for the keyboard navigation handler.
 *
 * @interface Highcharts.KeyboardNavigationHandlerOptionsObject
 */ /**
* An array containing pairs of an array of keycodes, mapped to a handler
* function. When the keycode is received, the handler is called with the
* keycode as parameter.
* @name Highcharts.KeyboardNavigationHandlerOptionsObject#keyCodeMap
* @type {Array<Array<Array<number>, Function>>}
*/ /**
* Function to run on initialization of module.
* @name Highcharts.KeyboardNavigationHandlerOptionsObject#init
* @type {Function}
*/ /**
* Function to run before moving to next/prev module. Receives moving direction
* as parameter: +1 for next, -1 for previous.
* @name Highcharts.KeyboardNavigationHandlerOptionsObject#terminate
* @type {Function|undefined}
*/ /**
* Function to run to validate module. Should return false if module should not
* run, true otherwise. Receives chart as parameter.
* @name Highcharts.KeyboardNavigationHandlerOptionsObject#validate
* @type {Function|undefined}
*/
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Define a keyboard navigation handler for use with a
 * Highcharts.AccessibilityComponent instance. This functions as an abstraction
 * layer for keyboard navigation, and defines a map of keyCodes to handler
 * functions.
 *
 * @requires module:modules/accessibility
 *
 * @sample highcharts/accessibility/custom-component
 *         Custom accessibility component
 *
 * @class
 * @name Highcharts.KeyboardNavigationHandler
 *
 * @param {Highcharts.Chart} chart
 * The chart this module should act on.
 *
 * @param {Highcharts.KeyboardNavigationHandlerOptionsObject} options
 * Options for the keyboard navigation handler.
 */
function KeyboardNavigationHandler(chart, options) {
    this.chart = chart;
    this.keyCodeMap = options.keyCodeMap || [];
    this.validate = options.validate;
    this.init = options.init;
    this.terminate = options.terminate;
    // Response enum
    this.response = {
        success: 1,
        prev: 2,
        next: 3,
        noHandler: 4,
        fail: 5 // Handler failed
    };
}
KeyboardNavigationHandler.prototype = {
    /**
     * Find handler function(s) for key code in the keyCodeMap and run it.
     *
     * @function KeyboardNavigationHandler#run
     * @param {global.KeyboardEvent} e
     * @return {number} Returns a response code indicating whether the run was
     *      a success/fail/unhandled, or if we should move to next/prev module.
     */
    run: function (e) {
        var keyCode = e.which || e.keyCode, response = this.response.noHandler, handlerCodeSet = find(this.keyCodeMap, function (codeSet) {
            return codeSet[0].indexOf(keyCode) > -1;
        });
        if (handlerCodeSet) {
            response = handlerCodeSet[1].call(this, keyCode, e);
        }
        else if (keyCode === 9) {
            // Default tab handler, move to next/prev module
            response = this.response[e.shiftKey ? 'prev' : 'next'];
        }
        return response;
    }
};
export default KeyboardNavigationHandler;
