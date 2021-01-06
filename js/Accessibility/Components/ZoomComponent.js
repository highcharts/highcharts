/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for chart zoom.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;
import H from '../../Core/Globals.js';
var noop = H.noop;
import HTMLUtilities from '../Utils/HTMLUtilities.js';
var removeElement = HTMLUtilities.removeElement, setElAttrs = HTMLUtilities.setElAttrs;
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, pick = U.pick;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function chartHasMapZoom(chart) {
    return !!(chart.mapZoom &&
        chart.mapNavButtons &&
        chart.mapNavButtons.length);
}
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
    var gran = granularity || 3, extremes = this.getExtremes(), step = (extremes.max - extremes.min) / gran * direction, newMax = extremes.max + step, newMin = extremes.min + step, size = newMax - newMin;
    if (direction < 0 && newMin < extremes.dataMin) {
        newMin = extremes.dataMin;
        newMax = newMin + size;
    }
    else if (direction > 0 && newMax > extremes.dataMax) {
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
var ZoomComponent = noop;
ZoomComponent.prototype = new AccessibilityComponent();
extend(ZoomComponent.prototype, /** @lends Highcharts.ZoomComponent */ {
    /**
     * Initialize the component
     */
    init: function () {
        var component = this, chart = this.chart;
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
        var chart = this.chart, component = this;
        // Make map zoom buttons accessible
        if (chart.mapNavButtons) {
            chart.mapNavButtons.forEach(function (button, i) {
                unhideChartElementFromAT(chart, button.element);
                component.setMapNavButtonAttrs(button.element, 'accessibility.zoom.mapZoom' + (i ? 'Out' : 'In'));
            });
        }
    },
    /**
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} button
     * @param {string} labelFormatKey
     */
    setMapNavButtonAttrs: function (button, labelFormatKey) {
        var chart = this.chart, label = chart.langFormat(labelFormatKey, { chart: chart });
        setElAttrs(button, {
            tabindex: -1,
            role: 'button',
            'aria-label': label
        });
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
        var chart = this.chart;
        // Always start with a clean slate
        removeElement(this.drillUpProxyGroup);
        removeElement(this.resetZoomProxyGroup);
        if (chart.resetZoomButton) {
            this.recreateProxyButtonAndGroup(chart.resetZoomButton, 'resetZoomProxyButton', 'resetZoomProxyGroup', chart.langFormat('accessibility.zoom.resetZoomButton', { chart: chart }));
        }
        if (chart.drillUpButton) {
            this.recreateProxyButtonAndGroup(chart.drillUpButton, 'drillUpProxyButton', 'drillUpProxyGroup', chart.langFormat('accessibility.drillUpButton', {
                chart: chart,
                buttonText: chart.getDrilldownBackText()
            }));
        }
    },
    /**
     * @private
     * @param {Highcharts.SVGElement} buttonEl
     * @param {string} buttonProp
     * @param {string} groupProp
     * @param {string} label
     */
    recreateProxyButtonAndGroup: function (buttonEl, buttonProp, groupProp, label) {
        removeElement(this[groupProp]);
        this[groupProp] = this.addProxyGroup();
        this[buttonProp] = this.createProxyButton(buttonEl, this[groupProp], { 'aria-label': label, tabindex: -1 });
    },
    /**
     * Get keyboard navigation handler for map zoom.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    getMapZoomNavigation: function () {
        var keys = this.keyCodes, chart = this.chart, component = this;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [
                    [keys.up, keys.down, keys.left, keys.right],
                    function (keyCode) {
                        return component.onMapKbdArrow(this, keyCode);
                    }
                ],
                [
                    [keys.tab],
                    function (_keyCode, e) {
                        return component.onMapKbdTab(this, e);
                    }
                ],
                [
                    [keys.space, keys.enter],
                    function () {
                        return component.onMapKbdClick(this);
                    }
                ]
            ],
            validate: function () {
                return chartHasMapZoom(chart);
            },
            init: function (direction) {
                return component.onMapNavInit(direction);
            }
        });
    },
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number} Response code
     */
    onMapKbdArrow: function (keyboardNavigationHandler, keyCode) {
        var keys = this.keyCodes, panAxis = (keyCode === keys.up || keyCode === keys.down) ?
            'yAxis' : 'xAxis', stepDirection = (keyCode === keys.left || keyCode === keys.up) ?
            -1 : 1;
        this.chart[panAxis][0].panStep(stepDirection);
        return keyboardNavigationHandler.response.success;
    },
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {global.KeyboardEvent} event
     * @return {number} Response code
     */
    onMapKbdTab: function (keyboardNavigationHandler, event) {
        var button, chart = this.chart, response = keyboardNavigationHandler.response, isBackwards = event.shiftKey, isMoveOutOfRange = isBackwards && !this.focusedMapNavButtonIx ||
            !isBackwards && this.focusedMapNavButtonIx;
        // Deselect old
        chart.mapNavButtons[this.focusedMapNavButtonIx].setState(0);
        if (isMoveOutOfRange) {
            chart.mapZoom(); // Reset zoom
            return response[isBackwards ? 'prev' : 'next'];
        }
        // Select other button
        this.focusedMapNavButtonIx += isBackwards ? -1 : 1;
        button = chart.mapNavButtons[this.focusedMapNavButtonIx];
        chart.setFocusToElement(button.box, button.element);
        button.setState(2);
        return response.success;
    },
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    onMapKbdClick: function (keyboardNavigationHandler) {
        this.fakeClickEvent(this.chart.mapNavButtons[this.focusedMapNavButtonIx]
            .element);
        return keyboardNavigationHandler.response.success;
    },
    /**
     * @private
     * @param {number} direction
     */
    onMapNavInit: function (direction) {
        var chart = this.chart, zoomIn = chart.mapNavButtons[0], zoomOut = chart.mapNavButtons[1], initialButton = direction > 0 ? zoomIn : zoomOut;
        chart.setFocusToElement(initialButton.box, initialButton.element);
        initialButton.setState(2);
        this.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
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
        var keys = this.keyCodes, component = this, chart = this.chart;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [
                    [keys.tab, keys.up, keys.down, keys.left, keys.right],
                    function (keyCode, e) {
                        var isBackwards = keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.left || keyCode === keys.up;
                        // Arrow/tab => just move
                        return this.response[isBackwards ? 'prev' : 'next'];
                    }
                ],
                [
                    [keys.space, keys.enter],
                    function () {
                        var res = onClick(this, chart);
                        return pick(res, this.response.success);
                    }
                ]
            ],
            validate: function () {
                var hasButton = (chart[buttonProp] &&
                    chart[buttonProp].box &&
                    component[proxyProp]);
                return hasButton;
            },
            init: function () {
                chart.setFocusToElement(chart[buttonProp].box, component[proxyProp]);
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
            this.simpleButtonNavigation('resetZoomButton', 'resetZoomProxyButton', function (_handler, chart) {
                chart.zoomOut();
            }),
            this.simpleButtonNavigation('drillUpButton', 'drillUpProxyButton', function (handler, chart) {
                chart.drillUp();
                return handler.response.prev;
            }),
            this.getMapZoomNavigation()
        ];
    }
});
export default ZoomComponent;
