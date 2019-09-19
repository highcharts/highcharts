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
import U from '../../../parts/Utilities.js';
var extend = U.extend;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';


/**
 * Pan along axis in a direction (1 or -1), optionally with a defined
 * granularity (number of steps it takes to walk across current view)
 *
 * @private
 * @function Highcharts.Axis#panStep
 *
 * @param {number} direction
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
 * @name Highcharts.ZoomComponent
 */
var ZoomComponent = function () {};
ZoomComponent.prototype = new AccessibilityComponent();
extend(ZoomComponent.prototype, /** @lends Highcharts.ZoomComponent */ {

    /**
     * Initialize the component
     */
    init: function () {
        var component = this,
            chart = this.chart;
        [
            'afterShowResetZoom', 'afterDrilldown', 'drillupall'
        ].forEach(function (eventType) {
            component.addEvent(chart, eventType, function () {
                component.updateProxyOverlays();
            });
        });
    },


    /**
     * Called when chart is updated
     */
    onChartUpdate: function () {
        var chart = this.chart,
            component = this;

        // Make map zoom buttons accessible
        if (chart.mapNavButtons) {
            chart.mapNavButtons.forEach(function (button, i) {
                component.unhideElementFromScreenReaders(button.element);
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
        }
    },


    /**
     * Update the proxy overlays on every new render to ensure positions are
     * correct.
     */
    onChartRender: function () {
        this.updateProxyOverlays();
    },


    /**
     * Update proxy overlays, recreating the buttons.
     */
    updateProxyOverlays: function () {
        var component = this,
            chart = this.chart,
            proxyButton = function (buttonEl, buttonProp, groupProp, label) {
                component.removeElement(component[groupProp]);
                component[groupProp] = component.addProxyGroup();
                component[buttonProp] = component.createProxyButton(
                    buttonEl,
                    component[groupProp],
                    {
                        'aria-label': label,
                        tabindex: -1
                    }
                );
            };

        // Always start with a clean slate
        component.removeElement(component.drillUpProxyGroup);
        component.removeElement(component.resetZoomProxyGroup);

        if (chart.resetZoomButton) {
            proxyButton(
                chart.resetZoomButton, 'resetZoomProxyButton',
                'resetZoomProxyGroup', chart.langFormat(
                    'accessibility.resetZoomButton',
                    { chart: chart }
                )
            );
        }

        if (chart.drillUpButton) {
            proxyButton(
                chart.drillUpButton, 'drillUpProxyButton',
                'drillUpProxyGroup', chart.langFormat(
                    'accessibility.drillUpButton',
                    {
                        chart: chart,
                        buttonText: chart.getDrilldownBackText()
                    }
                )
            );
        }
    },


    /**
     * Get keyboard navigation handler for map zoom.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    getMapZoomNavigation: function () {
        var keys = this.keyCodes,
            chart = this.chart,
            component = this;

        return new KeyboardNavigationHandler(chart, {
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
                    chart.setFocusToElement(button.box, button.element);
                    button.setState(2);

                    return this.response.success;
                }],

                // Press button
                [[
                    keys.space, keys.enter
                ], function () {
                    component.fakeClickEvent(
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
                chart.setFocusToElement(
                    initialButton.box, initialButton.element
                );
                initialButton.setState(2);
                component.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
            }
        });
    },


    /**
     * Get keyboard navigation handler for a simple chart button. Provide the
     * button reference for the chart, and a function to call on click.
     *
     * @private
     * @param {string} buttonProp The property on chart referencing the button.
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    simpleButtonNavigation: function (buttonProp, proxyProp, onClick) {
        var keys = this.keyCodes,
            component = this,
            chart = this.chart;

        return new KeyboardNavigationHandler(chart, {
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
                    onClick(chart);
                    return this.response.success;
                }]
            ],

            // Only run if we have the button
            validate: function () {
                return chart[buttonProp] && chart[buttonProp].box &&
                    component[proxyProp];
            },

            // Focus button initially
            init: function () {
                chart.setFocusToElement(
                    chart[buttonProp].box, component[proxyProp]
                );
            }
        });
    },


    /**
     * Get keyboard navigation handlers for this component.
     * @return {Array<Highcharts.KeyboardNavigationHandler>}
     *         List of module objects
     */
    getKeyboardNavigation: function () {
        return [
            this.simpleButtonNavigation(
                'resetZoomButton',
                'resetZoomProxyButton',
                function (chart) {
                    chart.zoomOut();
                }
            ),
            this.simpleButtonNavigation(
                'drillUpButton',
                'drillUpProxyButton',
                function (chart) {
                    chart.drillUp();
                }
            ),
            this.getMapZoomNavigation()
        ];
    }

});

export default ZoomComponent;
