/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Keyboard navigation handler base class definition
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
var find = H.find;


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
 * @param {Highcharts.Chart} chart The chart this module should act on.
 * @param {object} options
 * @param {Array<Array<Number>, Function>} options.keyCodeMap
 *      An array containing pairs of an array of keycodes, mapped to a handler
 *      function. When the keycode is received, the handler is called with the
 *      keycode as parameter.
 * @param {Function} [options.init]
 *      Function to run on initialization of module
 * @param {Function} [options.validate]
 *      Function to run to validate module. Should return false if module should
 *      not run, true otherwise. Receives chart as parameter.
 * @param {Function} [options.terminate]
 *      Function to run before moving to next/prev module. Receives moving
 *      direction as parameter: +1 for next, -1 for previous.
 * @param {Function} [options.init]
 *      Function to run on initialization of module
 */
function KeyboardNavigationHandler(chart, options) {
    this.chart = chart;
    this.keyCodeMap = options.keyCodeMap || [];
    this.validate = options.validate;
    this.init = options.init;
    this.terminate = options.terminate;
    // Response enum
    this.response = {
        success: 1, // Keycode was handled
        prev: 2, // Move to prev module
        next: 3, // Move to next module
        noHandler: 4, // There is no handler for this keycode
        fail: 5 // Handler failed
    };
}
KeyboardNavigationHandler.prototype = {

    /**
     * Find handler function(s) for key code in the keyCodeMap and run it.
     *
     * @function KeyboardNavigationHandler#run
     * @param {global.Event} e
     * @return {number} Returns a response code indicating whether the run was
     *      a success/fail/unhandled, or if we should move to next/prev module.
     */
    run: function (e) {
        var keyCode = e.which || e.keyCode,
            response = this.response.noHandler,
            handlerCodeSet = find(this.keyCodeMap, function (codeSet) {
                return codeSet[0].indexOf(keyCode) > -1;
            });

        if (handlerCodeSet) {
            response = handlerCodeSet[1].call(this, keyCode, e);
        } else if (keyCode === 9) {
            // Default tab handler, move to next/prev module
            response = this.response[e.shiftKey ? 'prev' : 'next'];
        } else if (keyCode === 27) {
            // Default esc handler, hide tooltip
            if (this.chart && this.chart.tooltip) {
                this.chart.tooltip.hide(0);
            }
            response = this.response.success;
        }

        return response;
    }

};

export default KeyboardNavigationHandler;
