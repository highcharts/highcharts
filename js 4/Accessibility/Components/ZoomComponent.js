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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;
import H from '../../Core/Globals.js';
var noop = H.noop;
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import U from '../../Core/Utilities.js';
var attr = U.attr, extend = U.extend, pick = U.pick;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * @private
 */
function chartHasMapZoom(chart) {
    return !!(chart.mapZoom &&
        chart.mapNavigation &&
        chart.mapNavigation.navButtons.length);
}
/* *
 *
 *  Class
 *
 * */
/**
 * The ZoomComponent class
 *
 * @private
 * @class
 * @name Highcharts.ZoomComponent
 */
var ZoomComponent = /** @class */ (function (_super) {
    __extends(ZoomComponent, _super);
    function ZoomComponent() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.focusedMapNavButtonIx = -1;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Initialize the component
     */
    ZoomComponent.prototype.init = function () {
        var component = this, chart = this.chart;
        this.proxyProvider.addGroup('zoom', 'div');
        [
            'afterShowResetZoom', 'afterApplyDrilldown', 'drillupall'
        ].forEach(function (eventType) {
            component.addEvent(chart, eventType, function () {
                component.updateProxyOverlays();
            });
        });
    };
    /**
     * Called when chart is updated
     */
    ZoomComponent.prototype.onChartUpdate = function () {
        var chart = this.chart, component = this;
        // Make map zoom buttons accessible
        if (chart.mapNavigation) {
            chart.mapNavigation.navButtons.forEach(function (button, i) {
                unhideChartElementFromAT(chart, button.element);
                component.setMapNavButtonAttrs(button.element, 'accessibility.zoom.mapZoom' + (i ? 'Out' : 'In'));
            });
        }
    };
    /**
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} button
     * @param {string} labelFormatKey
     */
    ZoomComponent.prototype.setMapNavButtonAttrs = function (button, labelFormatKey) {
        var chart = this.chart, label = chart.langFormat(labelFormatKey, { chart: chart });
        attr(button, {
            tabindex: -1,
            role: 'button',
            'aria-label': label
        });
    };
    /**
     * Update the proxy overlays on every new render to ensure positions are
     * correct.
     */
    ZoomComponent.prototype.onChartRender = function () {
        this.updateProxyOverlays();
    };
    /**
     * Update proxy overlays, recreating the buttons.
     */
    ZoomComponent.prototype.updateProxyOverlays = function () {
        var chart = this.chart;
        // Always start with a clean slate
        this.proxyProvider.clearGroup('zoom');
        if (chart.resetZoomButton) {
            this.createZoomProxyButton(chart.resetZoomButton, 'resetZoomProxyButton', chart.langFormat('accessibility.zoom.resetZoomButton', { chart: chart }));
        }
        if (chart.drillUpButton &&
            chart.breadcrumbs &&
            chart.breadcrumbs.list) {
            var lastBreadcrumb = chart.breadcrumbs.list[chart.breadcrumbs.list.length - 1];
            this.createZoomProxyButton(chart.drillUpButton, 'drillUpProxyButton', chart.langFormat('accessibility.drillUpButton', {
                chart: chart,
                buttonText: chart.breadcrumbs.getButtonText(lastBreadcrumb)
            }));
        }
    };
    /**
     * @private
     * @param {Highcharts.SVGElement} buttonEl
     * @param {string} buttonProp
     * @param {string} label
     */
    ZoomComponent.prototype.createZoomProxyButton = function (buttonEl, buttonProp, label) {
        this[buttonProp] = this.proxyProvider.addProxyElement('zoom', {
            click: buttonEl
        }, {
            'aria-label': label,
            tabindex: -1
        });
    };
    /**
     * Get keyboard navigation handler for map zoom.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    ZoomComponent.prototype.getMapZoomNavigation = function () {
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
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number} Response code
     */
    ZoomComponent.prototype.onMapKbdArrow = function (keyboardNavigationHandler, keyCode) {
        var keys = this.keyCodes, panAxis = (keyCode === keys.up || keyCode === keys.down) ?
            'yAxis' : 'xAxis', stepDirection = (keyCode === keys.left || keyCode === keys.up) ?
            -1 : 1;
        this.chart[panAxis][0].panStep(stepDirection);
        return keyboardNavigationHandler.response.success;
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {global.KeyboardEvent} event
     * @return {number} Response code
     */
    ZoomComponent.prototype.onMapKbdTab = function (keyboardNavigationHandler, event) {
        var chart = this.chart;
        var response = keyboardNavigationHandler.response;
        var isBackwards = event.shiftKey;
        var isMoveOutOfRange = isBackwards && !this.focusedMapNavButtonIx ||
            !isBackwards && this.focusedMapNavButtonIx;
        // Deselect old
        chart.mapNavigation.navButtons[this.focusedMapNavButtonIx].setState(0);
        if (isMoveOutOfRange) {
            chart.mapZoom(); // Reset zoom
            return response[isBackwards ? 'prev' : 'next'];
        }
        // Select other button
        this.focusedMapNavButtonIx += isBackwards ? -1 : 1;
        var button = chart.mapNavigation.navButtons[this.focusedMapNavButtonIx];
        chart.setFocusToElement(button.box, button.element);
        button.setState(2);
        return response.success;
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    ZoomComponent.prototype.onMapKbdClick = function (keyboardNavigationHandler) {
        var el = this.chart.mapNavButtons[this.focusedMapNavButtonIx].element;
        this.fakeClickEvent(el);
        return keyboardNavigationHandler.response.success;
    };
    /**
     * @private
     * @param {number} direction
     */
    ZoomComponent.prototype.onMapNavInit = function (direction) {
        var chart = this.chart, zoomIn = chart.mapNavigation.navButtons[0], zoomOut = chart.mapNavigation.navButtons[1], initialButton = direction > 0 ? zoomIn : zoomOut;
        chart.setFocusToElement(initialButton.box, initialButton.element);
        initialButton.setState(2);
        this.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
    };
    /**
     * Get keyboard navigation handler for a simple chart button. Provide the
     * button reference for the chart, and a function to call on click.
     *
     * @private
     * @param {string} buttonProp The property on chart referencing the button.
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    ZoomComponent.prototype.simpleButtonNavigation = function (buttonProp, proxyProp, onClick) {
        var keys = this.keyCodes, component = this, chart = this.chart;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [
                    [keys.tab, keys.up, keys.down, keys.left, keys.right],
                    function (keyCode, e) {
                        var isBackwards = (keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.left ||
                            keyCode === keys.up);
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
                    component[proxyProp].buttonElement);
                return hasButton;
            },
            init: function () {
                chart.setFocusToElement(chart[buttonProp].box, component[proxyProp].buttonElement);
            }
        });
    };
    /**
     * Get keyboard navigation handlers for this component.
     * @return {Array<Highcharts.KeyboardNavigationHandler>}
     *         List of module objects
     */
    ZoomComponent.prototype.getKeyboardNavigation = function () {
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
    };
    return ZoomComponent;
}(AccessibilityComponent));
/* *
 *
 *  Class Namespace
 *
 * */
(function (ZoomComponent) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    ZoomComponent.composedClasses = [];
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    function compose(AxisClass) {
        if (ZoomComponent.composedClasses.indexOf(AxisClass) === -1) {
            ZoomComponent.composedClasses.push(AxisClass);
            var axisProto = AxisClass.prototype;
            axisProto.panStep = axisPanStep;
        }
    }
    ZoomComponent.compose = compose;
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
    function axisPanStep(direction, granularity) {
        var gran = granularity || 3;
        var extremes = this.getExtremes();
        var step = (extremes.max - extremes.min) / gran * direction;
        var newMax = extremes.max + step;
        var newMin = extremes.min + step;
        var size = newMax - newMin;
        if (direction < 0 && newMin < extremes.dataMin) {
            newMin = extremes.dataMin;
            newMax = newMin + size;
        }
        else if (direction > 0 && newMax > extremes.dataMax) {
            newMax = extremes.dataMax;
            newMin = newMax - size;
        }
        this.setExtremes(newMin, newMax);
    }
})(ZoomComponent || (ZoomComponent = {}));
/* *
 *
 *  Default Export
 *
 * */
export default ZoomComponent;
