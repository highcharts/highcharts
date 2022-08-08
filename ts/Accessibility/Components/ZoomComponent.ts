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


/* *
 *
 *  Imports
 *
 * */


import type Axis from '../../Core/Axis/Axis';
import type Chart from '../../Core/Chart/Chart';
import type {
    DOMElementType,
    SVGDOMElement
} from '../../Core/Renderer/DOMElementType';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type ProxyElement from '../ProxyElement';

import AccessibilityComponent from '../AccessibilityComponent.js';
import CU from '../Utils/ChartUtilities.js';
const { unhideChartElementFromAT } = CU;
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import U from '../../Core/Utilities.js';
const {
    attr,
    pick
} = U;


/* *
 *
 *  Functions
 *
 * */


/**
 * Pan along axis in a direction (1 or -1), optionally with a defined
 * granularity (number of steps it takes to walk across current view)
 * @private
 */
function axisPanStep(
    axis: Axis,
    direction: number,
    granularity?: number
): void {
    const gran = granularity || 3;
    const extremes = axis.getExtremes();
    const step = (extremes.max - extremes.min) / gran * direction;
    let newMax = extremes.max + step;
    let newMin = extremes.min + step;
    const size = newMax - newMin;

    if (direction < 0 && newMin < extremes.dataMin) {
        newMin = extremes.dataMin;
        newMax = newMin + size;
    } else if (direction > 0 && newMax > extremes.dataMax) {
        newMax = extremes.dataMax;
        newMin = newMax - size;
    }

    axis.setExtremes(newMin, newMax);
}


/**
 * @private
 */
function chartHasMapZoom(
    chart: Highcharts.MapNavigationChart
): boolean {
    return !!(
        (chart.mapZoom) &&
        chart.mapNavigation &&
        chart.mapNavigation.navButtons.length
    );
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
class ZoomComponent extends AccessibilityComponent {


    /* *
     *
     *  Properties
     *
     * */


    public drillUpProxyButton?: ProxyElement;
    public resetZoomProxyButton?: ProxyElement;
    public focusedMapNavButtonIx: number = -1;


    /* *
     *
     *  Functions
     *
     * */


    /**
     * Initialize the component
     */
    public init(): void {
        const component = this,
            chart = this.chart;

        this.proxyProvider.addGroup('zoom', 'div');

        [
            'afterShowResetZoom', 'afterApplyDrilldown', 'drillupall'
        ].forEach((eventType): void => {
            component.addEvent(chart, eventType, function (): void {
                component.updateProxyOverlays();
            });
        });
    }


    /**
     * Called when chart is updated
     */
    public onChartUpdate(): void {
        const chart = this.chart,
            component = this;

        // Make map zoom buttons accessible
        if (chart.mapNavigation) {
            chart.mapNavigation.navButtons.forEach((button, i): void => {
                unhideChartElementFromAT(chart, button.element);
                component.setMapNavButtonAttrs(
                    button.element,
                    'accessibility.zoom.mapZoom' + (i ? 'Out' : 'In')
                );
            });
        }
    }


    /**
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} button
     * @param {string} labelFormatKey
     */
    public setMapNavButtonAttrs(
        button: DOMElementType,
        labelFormatKey: string
    ): void {
        const chart = this.chart,
            label = chart.langFormat(
                labelFormatKey,
                { chart: chart }
            );

        attr(button, {
            tabindex: -1,
            role: 'button',
            'aria-label': label
        });
    }


    /**
     * Update the proxy overlays on every new render to ensure positions are
     * correct.
     */
    public onChartRender(): void {
        this.updateProxyOverlays();
    }


    /**
     * Update proxy overlays, recreating the buttons.
     */
    public updateProxyOverlays(): void {
        const chart = this.chart;

        // Always start with a clean slate
        this.proxyProvider.clearGroup('zoom');

        if (chart.resetZoomButton) {
            this.createZoomProxyButton(
                chart.resetZoomButton, 'resetZoomProxyButton',
                chart.langFormat(
                    'accessibility.zoom.resetZoomButton',
                    { chart: chart }
                )
            );
        }

        if (
            chart.drillUpButton &&
            chart.breadcrumbs &&
            chart.breadcrumbs.list
        ) {
            const lastBreadcrumb =
                chart.breadcrumbs.list[chart.breadcrumbs.list.length - 1];

            this.createZoomProxyButton(
                chart.drillUpButton, 'drillUpProxyButton',
                chart.langFormat(
                    'accessibility.drillUpButton',
                    {
                        chart: chart,
                        buttonText: chart.breadcrumbs.getButtonText(
                            lastBreadcrumb
                        )
                    }
                )
            );
        }
    }


    /**
     * @private
     * @param {Highcharts.SVGElement} buttonEl
     * @param {string} buttonProp
     * @param {string} label
     */
    public createZoomProxyButton(
        buttonEl: SVGElement,
        buttonProp: ('drillUpProxyButton'|'resetZoomProxyButton'),
        label: string
    ): void {
        this[buttonProp] = this.proxyProvider.addProxyElement('zoom', {
            click: buttonEl
        }, {
            'aria-label': label,
            tabindex: -1
        });
    }


    /**
     * Get keyboard navigation handler for map zoom.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    public getMapZoomNavigation(): KeyboardNavigationHandler {
        const keys = this.keyCodes,
            chart = this.chart as Highcharts.MapNavigationChart,
            component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.up, keys.down, keys.left, keys.right],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return component.onMapKbdArrow(this, keyCode);
                    }
                ],
                [
                    [keys.tab],
                    function (
                        this: KeyboardNavigationHandler,
                        _keyCode: number,
                        e: KeyboardEvent
                    ): number {
                        return component.onMapKbdTab(this, e);
                    }
                ],
                [
                    [keys.space, keys.enter],
                    function (
                        this: KeyboardNavigationHandler
                    ): number {
                        return component.onMapKbdClick(this);
                    }
                ]
            ],

            validate: function (): boolean {
                return chartHasMapZoom(chart);
            },

            init: function (direction: number): void {
                return component.onMapNavInit(direction);
            }
        });
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number} Response code
     */
    public onMapKbdArrow(
        keyboardNavigationHandler: KeyboardNavigationHandler,
        keyCode: number
    ): number {
        const keys = this.keyCodes,
            panAxis: ('xAxis'|'yAxis') =
                (keyCode === keys.up || keyCode === keys.down) ?
                    'yAxis' : 'xAxis',
            stepDirection = (keyCode === keys.left || keyCode === keys.up) ?
                -1 : 1;

        axisPanStep(this.chart[panAxis][0], stepDirection);

        return keyboardNavigationHandler.response.success;
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {global.KeyboardEvent} event
     * @return {number} Response code
     */
    public onMapKbdTab(
        keyboardNavigationHandler: KeyboardNavigationHandler,
        event: KeyboardEvent
    ): number {
        const chart: Highcharts.MapNavigationChart = (
            this.chart as Highcharts.MapNavigationChart
        );
        const response = keyboardNavigationHandler.response;
        const isBackwards = event.shiftKey;
        const isMoveOutOfRange = isBackwards && !this.focusedMapNavButtonIx ||
                !isBackwards && this.focusedMapNavButtonIx;

        // Deselect old
        chart.mapNavigation.navButtons[this.focusedMapNavButtonIx].setState(0);

        if (isMoveOutOfRange) {
            chart.mapZoom(); // Reset zoom
            return response[isBackwards ? 'prev' : 'next'];
        }

        // Select other button
        this.focusedMapNavButtonIx += isBackwards ? -1 : 1;
        const button = chart.mapNavigation.navButtons[
            this.focusedMapNavButtonIx
        ];
        chart.setFocusToElement(button.box, button.element);
        button.setState(2);

        return response.success;
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    public onMapKbdClick(
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const el: SVGDOMElement = (this.chart as any).mapNavButtons[
            this.focusedMapNavButtonIx
        ].element;
        this.fakeClickEvent(el);
        return keyboardNavigationHandler.response.success;
    }


    /**
     * @private
     * @param {number} direction
     */
    public onMapNavInit(
        direction: number
    ): void {
        const chart: Highcharts.MapNavigationChart = this.chart as any,
            zoomIn = chart.mapNavigation.navButtons[0],
            zoomOut = chart.mapNavigation.navButtons[1],
            initialButton = direction > 0 ? zoomIn : zoomOut;

        chart.setFocusToElement(initialButton.box, initialButton.element);
        initialButton.setState(2);

        this.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
    }


    /**
     * Get keyboard navigation handler for a simple chart button. Provide the
     * button reference for the chart, and a function to call on click.
     *
     * @private
     * @param {string} buttonProp The property on chart referencing the button.
     * @return {Highcharts.KeyboardNavigationHandler} The module object
     */
    public simpleButtonNavigation(
        buttonProp: string,
        proxyProp: string,
        onClick: Function
    ): KeyboardNavigationHandler {
        const keys = this.keyCodes,
            component = this,
            chart = this.chart;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.tab, keys.up, keys.down, keys.left, keys.right],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number,
                        e: KeyboardEvent
                    ): number {
                        const isBackwards = (
                            keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.left ||
                            keyCode === keys.up
                        );

                        // Arrow/tab => just move
                        return this.response[isBackwards ? 'prev' : 'next'];
                    }
                ],
                [
                    [keys.space, keys.enter],
                    function (
                        this: KeyboardNavigationHandler
                    ): void {
                        const res = onClick(this, chart);
                        return pick(res, this.response.success);
                    }
                ]
            ],

            validate: function (): boolean {
                const hasButton = (
                    (chart as any)[buttonProp] &&
                    (chart as any)[buttonProp].box &&
                    (component as any)[proxyProp].buttonElement
                );
                return hasButton;
            },

            init: function (): void {
                chart.setFocusToElement(
                    (chart as any)[buttonProp].box,
                    (component as any)[proxyProp].buttonElement
                );
            }
        });
    }


    /**
     * Get keyboard navigation handlers for this component.
     * @return {Array<Highcharts.KeyboardNavigationHandler>}
     *         List of module objects
     */
    public getKeyboardNavigation(): Array<KeyboardNavigationHandler> {
        return [
            this.simpleButtonNavigation(
                'resetZoomButton',
                'resetZoomProxyButton',
                function (
                    _handler: KeyboardNavigationHandler,
                    chart: Chart
                ): void {
                    chart.zoomOut();
                }
            ),
            this.simpleButtonNavigation(
                'drillUpButton',
                'drillUpProxyButton',
                function (
                    handler: KeyboardNavigationHandler,
                    chart: Chart
                ): number {
                    chart.drillUp();
                    return handler.response.prev;
                }
            ),
            this.getMapZoomNavigation()
        ];
    }

}


/* *
 *
 *  Default Export
 *
 * */


export default ZoomComponent;
