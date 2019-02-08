/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Keyboard navigation module base class definition
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
var doc = H.win.document;


/**
 * Abstraction layer for keyboard navigation. Keep a map of keyCodes to handler
 * functions.
 *
 * @private
 * @class
 * @name KeyboardNavigationModule
 *
 * @param {Highcharts.Chart} chart The chart this module should act on.
 * @param {object} options
 * @param {Array<Array<Number>, function>} options.keyCodeMap
 *      An array containing pairs of an array of keycodes, mapped to a handler
 *      function. When the keycode is received, the handler is called with the
 *      keycode as parameter.
 * @param {function} [options.init]
 *      Function to run on initialization of module
 * @param {function} [options.validate]
 *      Function to run to validate module. Should return false if module should
 *      not run, true otherwise. Receives chart as parameter.
 * @param {function} [options.terminate]
 *      Function to run before moving to next/prev module. Receives moving
 *      direction as parameter - +1 for next, -1 for previous.
 * @param {function} [options.init]
 *      Function to run on initialization of module
 */
function KeyboardNavigationModule(chart, options) {
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
KeyboardNavigationModule.prototype = {

    /**
     * Utility function to attempt to fake a click event on an element.
     *
     * @private
     * @function KeyboardNavigationModule#fakeClickEvent
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement}
     * @returns {undefined}
     */
    fakeClickEvent: function (element) {
        if (element && element.onclick && doc.createEvent) {
            var fakeEvent = doc.createEvent('Events');
            fakeEvent.initEvent('click', true, false);
            element.onclick(fakeEvent);
        }
    },


    /**
     * Find handler function(s) for key code in the keyCodeMap and run it.
     *
     * @function KeyboardNavigationModule#run
     * @param {global.Event} e
     * @returns {number} Returns a response code indicating whether the run was
     *      a success/fail/unhandled, or if we should move to next/prev module.
     */
    run: function (e) {
        var keyCode = e.which || e.keyCode,
            response = this.response.noHandler,
            handlerCodeSet = this.keyCodeMap.find(function (codeSet) {
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

export default KeyboardNavigationModule;
