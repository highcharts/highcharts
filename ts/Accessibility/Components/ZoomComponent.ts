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

import type Chart from '../../Core/Chart/Chart';
import type {
    DOMElementType,
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
const {
    unhideChartElementFromAT
} = ChartUtilities;
import H from '../../Core/Globals.js';
const {
    noop
} = H;
import HTMLUtilities from '../Utils/HTMLUtilities.js';
const {
    removeElement,
    setElAttrs
} = HTMLUtilities;
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import U from '../../Core/Utilities.js';
var extend = U.extend,
    pick = U.pick;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class ZoomComponent extends AccessibilityComponent {
            public constructor();
            public drillUpProxyButton?: HTMLDOMElement;
            public drillUpProxyGroup?: HTMLDOMElement;
            public focusedMapNavButtonIx: number;
            public resetZoomProxyButton?: HTMLDOMElement;
            public resetZoomProxyGroup?: HTMLDOMElement;
            getKeyboardNavigation(): Array<KeyboardNavigationHandler>;
            getMapZoomNavigation(): KeyboardNavigationHandler;
            init(): void;
            onChartRender(): void;
            onChartUpdate(): void;
            onMapKbdArrow(
                keyboardNavigationHandler: KeyboardNavigationHandler,
                keyCode: number
            ): number;
            onMapKbdClick(
                keyboardNavigationHandler: KeyboardNavigationHandler
            ): number;
            onMapNavInit(direction: number): void;
            onMapKbdTab(
                keyboardNavigationHandler: KeyboardNavigationHandler,
                event: Event
            ): number;
            recreateProxyButtonAndGroup(
                buttonEl: SVGElement,
                buttonProp: ('drillUpProxyButton'|'resetZoomProxyButton'),
                groupProp: ('drillUpProxyGroup'|'resetZoomProxyGroup'),
                label: string
            ): void;
            setMapNavButtonAttrs(
                button: DOMElementType,
                labelFormatKey: string
            ): void;
            simpleButtonNavigation(
                buttonProp: string,
                proxyProp: string,
                onClick: Function
            ): KeyboardNavigationHandler;
            updateProxyOverlays(): void;
        }
        interface Axis {
            /** @requires modules/accessibility */
            panStep(direction: number, granularity?: number): void;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function chartHasMapZoom(
    chart: Highcharts.MapNavigationChart
): boolean {
    return !!(
        chart.mapZoom &&
        chart.mapNavButtons &&
        chart.mapNavButtons.length
    );
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
H.Axis.prototype.panStep = function (
    direction: number,
    granularity?: number
): void {
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
var ZoomComponent: typeof Highcharts.ZoomComponent = noop as any;
ZoomComponent.prototype = new (AccessibilityComponent as any)();
extend(ZoomComponent.prototype, /** @lends Highcharts.ZoomComponent */ {

    /**
     * Initialize the component
     */
    init: function (this: Highcharts.ZoomComponent): void {
        var component = this,
            chart = this.chart;
        [
            'afterShowResetZoom', 'afterDrilldown', 'drillupall'
        ].forEach(function (eventType: string): void {
            component.addEvent(chart, eventType, function (): void {
                component.updateProxyOverlays();
            });
        });
    },


    /**
     * Called when chart is updated
     */
    onChartUpdate: function (this: Highcharts.ZoomComponent): void {
        var chart = this.chart,
            component = this;

        // Make map zoom buttons accessible
        if (chart.mapNavButtons) {
            chart.mapNavButtons.forEach(function (
                button: Highcharts.SVGElement,
                i: number
            ): void {
                unhideChartElementFromAT(chart, button.element);
                component.setMapNavButtonAttrs(
                    button.element,
                    'accessibility.zoom.mapZoom' + (i ? 'Out' : 'In')
                );
            });
        }
    },


    /**
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} button
     * @param {string} labelFormatKey
     */
    setMapNavButtonAttrs: function (
        this: Highcharts.ZoomComponent,
        button: DOMElementType,
        labelFormatKey: string
    ): void {
        var chart = this.chart,
            label = chart.langFormat(
                labelFormatKey,
                { chart: chart }
            );

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
    onChartRender: function (this: Highcharts.ZoomComponent): void {
        this.updateProxyOverlays();
    },


    /**
     * Update proxy overlays, recreating the buttons.
     */
    updateProxyOverlays: function (this: Highcharts.ZoomComponent): void {
        var chart = this.chart;

        // Always start with a clean slate
        removeElement(this.drillUpProxyGroup);
        removeElement(this.resetZoomProxyGroup);

        if (chart.resetZoomButton) {
            this.recreateProxyButtonAndGroup(
                chart.resetZoomButton, 'resetZoomProxyButton',
                'resetZoomProxyGroup', chart.langFormat(
                    'accessibility.zoom.resetZoomButton',
                    { chart: chart }
                )
            );
        }

        if (chart.drillUpButton) {
            this.recreateProxyButtonAndGroup(
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
     * @private
     * @param {Highcharts.SVGElement} buttonEl
     * @param {string} buttonProp
     * @param {string} groupProp
     * @param {string} label
     */
    recreateProxyButtonAndGroup: function (
        this: Highcharts.ZoomComponent,
        buttonEl: Highcharts.SVGElement,
        buttonProp: ('drillUpProxyButton'|'resetZoomProxyButton'),
        groupProp: ('drillUpProxyGroup'|'resetZoomProxyGroup'),
        label: string
    ): void {
        removeElement(this[groupProp]);
        this[groupProp] = this.addProxyGroup();
        this[buttonProp] = this.createProxyButton(
            buttonEl,
            this[groupProp] as any,
            { 'aria-label': label, tabindex: -1 }
        );
    },


    /**
     * Get keyboard navigation handler for map zoom.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    getMapZoomNavigation: function (
        this: Highcharts.ZoomComponent
    ): Highcharts.KeyboardNavigationHandler {
        var keys = this.keyCodes,
            chart = this.chart,
            component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.up, keys.down, keys.left, keys.right],
                    function (
                        this: Highcharts.KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return component.onMapKbdArrow(this, keyCode);
                    }
                ],
                [
                    [keys.tab],
                    function (
                        this: Highcharts.KeyboardNavigationHandler,
                        _keyCode: number,
                        e: KeyboardEvent
                    ): number {
                        return component.onMapKbdTab(this, e);
                    }
                ],
                [
                    [keys.space, keys.enter],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): number {
                        return component.onMapKbdClick(this);
                    }
                ]
            ],

            validate: function (): boolean {
                return chartHasMapZoom(chart as any);
            },

            init: function (direction: number): void {
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
    onMapKbdArrow: function (
        this: Highcharts.ZoomComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler,
        keyCode: number
    ): number {
        var keys = this.keyCodes,
            panAxis: ('xAxis'|'yAxis') =
                (keyCode === keys.up || keyCode === keys.down) ?
                    'yAxis' : 'xAxis',
            stepDirection = (keyCode === keys.left || keyCode === keys.up) ?
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
    onMapKbdTab: function (
        this: Highcharts.ZoomComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler,
        event: KeyboardEvent
    ): number {
        var button: (Highcharts.SVGElement|undefined),
            chart: Highcharts.MapNavigationChart = this.chart as any,
            response = keyboardNavigationHandler.response,
            isBackwards = event.shiftKey,
            isMoveOutOfRange = isBackwards && !this.focusedMapNavButtonIx ||
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
    onMapKbdClick: function (
        this: Highcharts.ZoomComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler
    ): number {
        this.fakeClickEvent(
            (this.chart as any).mapNavButtons[this.focusedMapNavButtonIx]
                .element
        );
        return keyboardNavigationHandler.response.success;
    },


    /**
     * @private
     * @param {number} direction
     */
    onMapNavInit: function (
        this: Highcharts.ZoomComponent,
        direction: number
    ): void {
        var chart: Highcharts.MapNavigationChart = this.chart as any,
            zoomIn = chart.mapNavButtons[0],
            zoomOut = chart.mapNavButtons[1],
            initialButton = direction > 0 ? zoomIn : zoomOut;

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
    simpleButtonNavigation: function (
        this: Highcharts.ZoomComponent,
        buttonProp: string,
        proxyProp: string,
        onClick: Function
    ): Highcharts.KeyboardNavigationHandler {
        var keys = this.keyCodes,
            component = this,
            chart = this.chart;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.tab, keys.up, keys.down, keys.left, keys.right],
                    function (
                        this: Highcharts.KeyboardNavigationHandler,
                        keyCode: number,
                        e: KeyboardEvent
                    ): number {
                        var isBackwards = keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.left || keyCode === keys.up;

                        // Arrow/tab => just move
                        return this.response[isBackwards ? 'prev' : 'next'];
                    }
                ],
                [
                    [keys.space, keys.enter],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): void {
                        var res = onClick(this, chart);
                        return pick(res, this.response.success);
                    }
                ]
            ],

            validate: function (): boolean {
                var hasButton = (
                    (chart as any)[buttonProp] &&
                    (chart as any)[buttonProp].box &&
                    (component as any)[proxyProp]
                );
                return hasButton;
            },

            init: function (): void {
                chart.setFocusToElement(
                    (chart as any)[buttonProp].box,
                    (component as any)[proxyProp]
                );
            }
        });
    },


    /**
     * Get keyboard navigation handlers for this component.
     * @return {Array<Highcharts.KeyboardNavigationHandler>}
     *         List of module objects
     */
    getKeyboardNavigation: function (
        this: Highcharts.ZoomComponent
    ): Array<Highcharts.KeyboardNavigationHandler> {
        return [
            this.simpleButtonNavigation(
                'resetZoomButton',
                'resetZoomProxyButton',
                function (
                    _handler: Highcharts.KeyboardNavigationHandler,
                    chart: Chart
                ): void {
                    chart.zoomOut();
                }
            ),
            this.simpleButtonNavigation(
                'drillUpButton',
                'drillUpProxyButton',
                function (
                    handler: Highcharts.KeyboardNavigationHandler,
                    chart: Chart
                ): number {
                    chart.drillUp();
                    return handler.response.prev;
                }
            ),
            this.getMapZoomNavigation()
        ];
    }

});

export default ZoomComponent;
