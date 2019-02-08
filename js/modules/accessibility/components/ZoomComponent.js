/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for chart zoom.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationModule from '../KeyboardNavigationModule.js';


/**
 * Pan along axis in a direction (1 or -1), optionally with a defined
 * granularity (number of steps it takes to walk across current view)
 *
 * @private
 * @function Highcharts.Axis#panStep
 *
 * @param {number} direction
 *
 * @param {number} [granularity]
 */
H.Axis.prototype.panStep = function (direction, granularity) {
    var gran = granularity || 3,
        extremes = this.getExtremes(),
        step = (extremes.max - extremes.min) / gran * direction,
        newMax = extremes.max + step,
        newMin = extremes.min + step,
        size = newMax - newMin;

    if (direction < 0 && newMin < extremes.dataMin) {
        newMin = extremes.dataMin;
        newMax = newMin + size;
    } else if (direction > 0 && newMax > extremes.dataMax) {
        newMax = extremes.dataMax;
        newMin = newMax - size;
    }
    this.setExtremes(newMin, newMax);
};


/**
 * The ZoomComponent class
 *
 * @private
 * @class
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var ZoomComponent = function (chart) {
    this.initBase(chart);
    this.init();
};
ZoomComponent.prototype = new AccessibilityComponent();
H.extend(ZoomComponent.prototype, {

    /**
     * Init the component.
     */
    init: function () {},


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {},


    /**
     * Get keyboard navigation module for map zoom.
     * @private
     * @returns {KeyboardNavigationModule} The module object
     */
    getMapZoomNavigation: function () {
        var keys = this.keyCodes,
            chart = this.chart,
            component = this;

        return new KeyboardNavigationModule(chart, {
            keyCodeMap: [
                // Arrow keys
                [[
                    keys.up, keys.down, keys.left, keys.right
                ], function (keyCode) {
                    chart[
                        keyCode === keys.up || keyCode === keys.down ?
                            'yAxis' : 'xAxis'
                    ][0].panStep(
                        keyCode === keys.left || keyCode === keys.up ? -1 : 1
                    );
                    return this.response.success;
                }],

                // Tabs
                [[
                    keys.tab
                ], function (keyCode, e) {
                    var button;

                    // Deselect old
                    chart.mapNavButtons[
                        component.focusedMapNavButtonIx
                    ].setState(0);

                    // Trying to go somewhere we can't?
                    if (
                        e.shiftKey && !component.focusedMapNavButtonIx ||
                        !e.shiftKey && component.focusedMapNavButtonIx
                    ) {
                        chart.mapZoom(); // Reset zoom
                        // Nowhere to go, go to prev/next module
                        return this.response[e.shiftKey ? 'prev' : 'next'];
                    }

                    // Select other button
                    component.focusedMapNavButtonIx += e.shiftKey ? -1 : 1;
                    button = chart.mapNavButtons[
                        component.focusedMapNavButtonIx
                    ];
                    chart.setFocusToElement(button.box, button);
                    button.setState(2);

                    return this.response.success;
                }],

                // Press button
                [[
                    keys.space, keys.enter
                ], function () {
                    this.fakeClickEvent(
                        chart.mapNavButtons[
                            component.focusedMapNavButtonIx
                        ].element
                    );
                    return this.response.success;
                }]
            ],

            // Only run this module if we have map zoom on the chart
            validate: function () {
                return (
                    chart.mapZoom &&
                    chart.mapNavButtons &&
                    chart.mapNavButtons.length === 2
                );
            },

            // Make zoom buttons do their magic
            init: function (direction) {
                var zoomIn = chart.mapNavButtons[0],
                    zoomOut = chart.mapNavButtons[1],
                    initialButton = direction > 0 ? zoomIn : zoomOut;

                chart.mapNavButtons.forEach(function (button, i) {
                    button.element.setAttribute('tabindex', -1);
                    button.element.setAttribute('role', 'button');
                    button.element.setAttribute(
                        'aria-label',
                        chart.langFormat(
                            'accessibility.mapZoom' + (i ? 'Out' : 'In'),
                            { chart: chart }
                        )
                    );
                });

                chart.setFocusToElement(initialButton.box, initialButton);
                initialButton.setState(2);
                component.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
            }
        });
    },


    /**
     * Get keyboard navigation module for reset zoom.
     * @private
     * @returns {KeyboardNavigationModule} The module object
     */
    getResetZoomNavigation: function () {
        var keys = this.keyCodes,
            chart = this.chart;

        return new KeyboardNavigationModule(chart, {
            keyCodeMap: [
                // Arrow/tab just move
                [[
                    keys.tab, keys.up, keys.down, keys.left, keys.right
                ], function (keyCode, e) {
                    return this.response[
                        keyCode === this.tab && e.shiftKey ||
                        keyCode === keys.left || keyCode === keys.up ?
                            'prev' : 'next'
                    ];
                }],

                // Select to click
                [[
                    keys.space, keys.enter
                ], function () {
                    chart.zoomOut();
                    return this.response.success;
                }]
            ],

            // Only run if we have a reset zoom button
            validate: function () {
                return chart.resetZoomButton && chart.resetZoomButton.box;
            },

            // Focus button initially
            init: function () {
                chart.setFocusToElement(
                    chart.resetZoomButton.box, chart.resetZoomButton
                );
            }
        });
    },


    /**
     * Get keyboard navigation modules for this component.
     * @returns {Array<KeyboardNavigationModule>} List of module objects
     */
    getKeyboardNavigation: function () {
        return [this.getResetZoomNavigation(), this.getMapZoomNavigation()];
    }

});

export default ZoomComponent;
