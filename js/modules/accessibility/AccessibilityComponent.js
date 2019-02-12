/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component class definition
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';
import Highcharts from '../../parts/Globals.js';


/**
 * The AccessibilityComponent base class, representing a part of the chart that
 * has accessibility logic connected to it. Must call initBase after inheriting.
 *
 * @private
 * @class
 */
function AccessibilityComponent() {}
AccessibilityComponent.prototype = {

    /**
     * Initialize the class
     * @private
     * @param {Highcharts.Chart} chart
     *        Chart object
     */
    initBase: function (chart) {
        this.chart = chart;
        this.eventRemovers = [];
        this.domElements = [];
        this.keyCodes = {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            enter: 13,
            space: 32,
            esc: 27,
            tab: 9
        };
    },

    /**
     * Add an event to an element and keep track of it for destroy().
     * Same args as Highcharts.addEvent
     * @private
     */
    addEvent: function () {
        var remover = Highcharts.addEvent.apply(Highcharts, arguments);
        this.eventRemovers.push(remover);
        return remover;
    },

    /**
     * Create an element and keep track of it for destroy().
     * Same args as document.createElement
     * @private
     */
    createElement: function () {
        var el = Highcharts.win.document.createElement.apply(
            Highcharts.win.document, arguments
        );
        this.domElements.push(el);
        return el;
    },

    /**
     * Should remove any event handlers added, as well as any DOM elements.
     * @private
     */
    destroy: function () {
        this.eventRemovers.forEach(function (remover) {
            remover();
        });
        this.domElements.forEach(function (element) {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.eventRemovers = [];
        this.domElements = [];
    },

    /**
     * Utility function to strip tags from a string. Used for aria-label
     * attributes, painting on a canvas will fail if the text contains tags.
     * @private
     * @param {string} s The string to strip tags from
     * @return {string} The new string.
     */
    stripTags: function (s) {
        return typeof s === 'string' ? s.replace(/<\/?[^>]+(>|$)/g, '') : s;
    },

    /**
     * HTML encode some characters vulnerable for XSS.
     * @private
     * @param {string} html The input string.
     * @return {string} The escaped string.
     */
    htmlencode: function (html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },


    // Functions to be overridden by derived classes

    /**
     * Initialize component.
     */
    init: function () {},

    /**
     * Get keyboard navigation module for this component.
     */
    getKeyboardNavigation: function () {},

    /**
     * Called on updates to the chart, including options changes.
     * Note that this is also called on first render of chart.
     */
    onChartUpdate: function () {}

};

export default AccessibilityComponent;
