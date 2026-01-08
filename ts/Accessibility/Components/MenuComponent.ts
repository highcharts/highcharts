/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Accessibility component for exporting menu.
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Accessibility from '../Accessibility';
import type Exporting from '../../Extensions/Exporting/Exporting';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type ProxyElement from '../ProxyElement';

import Chart from '../../Core/Chart/Chart.js';
import U from '../../Core/Utilities.js';
const { attr } = U;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

import ChartUtilities from '../Utils/ChartUtilities.js';
const {
    getChartTitle,
    unhideChartElementFromAT
} = ChartUtilities;

import HTMLUtilities from '../Utils/HTMLUtilities.js';
const {
    getFakeMouseEvent
} = HTMLUtilities;


/* *
 *
 *  Functions
 *
 * */


/**
 * Get the wrapped export button element of a chart.
 * @private
 */
function getExportMenuButtonElement(chart: Chart): (SVGElement|undefined) {
    return chart.exporting?.svgElements?.[0];
}


/**
 * @private
 */
function exportingShouldHaveA11y(chart: Chart): boolean {
    const exportingOpts = chart.options.exporting,
        exportButton = getExportMenuButtonElement(chart);

    return !!(
        exportingOpts &&
        exportingOpts.enabled !== false &&
        exportingOpts.accessibility &&
        exportingOpts.accessibility.enabled &&
        exportButton &&
        exportButton.element
    );
}


/* *
 *
 *  Class
 *
 * */


/**
 * The MenuComponent class
 *
 * @private
 * @class
 * @name Highcharts.MenuComponent
 */
class MenuComponent extends AccessibilityComponent {


    /* *
     *
     *  Properties
     *
     * */


    public exportButtonProxy?: ProxyElement;


    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */


    /**
     * Init the component
     */
    public init(): void {
        const chart = this.chart,
            component = this;

        this.addEvent(chart, 'exportMenuShown', function (): void {
            component.onMenuShown();
        });

        this.addEvent(chart, 'exportMenuHidden', function (): void {
            component.onMenuHidden();
        });

        this.createProxyGroup();
    }


    /**
     * @private
     */
    public onMenuHidden(): void {
        const menu: Exporting.DivElement|undefined =
            this.chart.exporting?.contextMenuEl;

        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }

        this.setExportButtonExpandedState('false');
    }


    /**
     * @private
     */
    public onMenuShown(): void {
        const chart = this.chart,
            menu = chart.exporting?.contextMenuEl;

        if (menu) {
            this.addAccessibleContextMenuAttribs();
            unhideChartElementFromAT(chart, menu);
        }

        this.setExportButtonExpandedState('true');
    }


    /**
     * @private
     * @param {string} stateStr
     */
    public setExportButtonExpandedState(
        stateStr: string
    ): void {
        if (this.exportButtonProxy) {
            this.exportButtonProxy.innerElement.setAttribute(
                'aria-expanded',
                stateStr
            );
        }
    }


    /**
     * Called on each render of the chart. We need to update positioning of the
     * proxy overlay.
     */
    public onChartRender(): void {
        const chart = this.chart,
            focusEl = chart.focusElement,
            a11y = chart.accessibility;
        this.proxyProvider.clearGroup('chartMenu');
        this.proxyMenuButton();

        if (
            this.exportButtonProxy &&
            focusEl &&
            focusEl === chart.exporting?.group
        ) {
            if (focusEl.focusBorder) {
                chart.setFocusToElement(
                    focusEl, this.exportButtonProxy.innerElement
                );
            } else if (a11y) {
                a11y.keyboardNavigation.tabindexContainer.focus();
            }
        }
    }


    /**
     * @private
     */
    public proxyMenuButton(): void {
        const chart = this.chart;
        const proxyProvider = this.proxyProvider;
        const buttonEl = getExportMenuButtonElement(chart);

        if (exportingShouldHaveA11y(chart) && buttonEl) {
            this.exportButtonProxy = proxyProvider.addProxyElement(
                'chartMenu',
                { click: buttonEl },
                'button',
                {
                    'aria-label': chart.langFormat(
                        'accessibility.exporting.menuButtonLabel',
                        {
                            chart: chart,
                            chartTitle: getChartTitle(chart)
                        }
                    ),
                    'aria-expanded': false,
                    title: chart.options.lang.contextButtonTitle || null
                }
            );
        }
    }


    /**
     * @private
     */
    public createProxyGroup(): void {
        const chart = this.chart;
        if (chart && this.proxyProvider) {
            this.proxyProvider.addGroup('chartMenu');
        }
    }


    /**
     * @private
     */
    public addAccessibleContextMenuAttribs(): void {
        const chart = this.chart,
            exportList = chart.exporting?.divElements;

        if (exportList && exportList.length) {
            // Set tabindex on the menu items to allow focusing by script
            // Set role to give screen readers a chance to pick up the contents
            exportList.forEach((item): void => {
                if (item) {
                    if (
                        item.tagName === 'LI' &&
                        !(item.children && item.children.length)
                    ) {
                        item.setAttribute('tabindex', -1);
                    } else {
                        item.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            // Set accessibility properties on parent div
            const parentDiv = (exportList[0] && exportList[0].parentNode);
            if (parentDiv) {
                attr(parentDiv, {
                    'aria-hidden': void 0,
                    'aria-label': chart.langFormat(
                        'accessibility.exporting.chartMenuLabel',
                        { chart }
                    ),
                    role: 'list' // Needed for webkit/VO
                });
            }
        }
    }


    /**
     * Get keyboard navigation handler for this component.
     * @private
     */
    public getKeyboardNavigation(): KeyboardNavigationHandler {
        const keys = this.keyCodes,
            chart = this.chart,
            component = this;

        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Arrow prev handler
                [
                    [keys.left, keys.up],
                    function (
                        this: KeyboardNavigationHandler
                    ): number {
                        return component.onKbdPrevious(this);
                    }
                ],

                // Arrow next handler
                [
                    [keys.right, keys.down],
                    function (
                        this: KeyboardNavigationHandler
                    ): number {
                        return component.onKbdNext(this);
                    }
                ],

                // Click handler
                [
                    [keys.enter, keys.space],
                    function (
                        this: KeyboardNavigationHandler
                    ): number {
                        return component.onKbdClick(this);
                    }
                ]
            ],

            // Only run exporting navigation if exporting support exists and is
            // enabled on chart
            validate: function (): boolean {
                return !!chart.exporting &&
                    chart
                        .options
                        .exporting
                        ?.buttons
                        ?.contextButton.enabled !== false &&
                    chart.options.exporting.enabled !== false &&
                    (
                        chart.options.exporting.accessibility?.enabled || false
                    ) !== false;
            },

            // Focus export menu button
            init: function (): void {
                const proxy = component.exportButtonProxy;
                const svgEl = component.chart.exporting?.group;

                if (proxy && svgEl) {
                    chart.setFocusToElement(svgEl, proxy.innerElement);
                }
            },

            // Hide the menu
            terminate: function (): void {
                chart.hideExportMenu();
            }
        });
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    public onKbdPrevious(
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const chart = this.chart;
        const a11yOptions = chart.options.accessibility;
        const response = keyboardNavigationHandler.response;

        // Try to highlight prev item in list. Highlighting e.g.
        // separators will fail.
        let i = chart.highlightedExportItemIx || 0;
        while (i--) {
            if (chart.highlightExportItem(i)) {
                return response.success;
            }
        }

        // We failed, so wrap around or move to prev module
        if (a11yOptions.keyboardNavigation.wrapAround) {
            chart.highlightLastExportItem();
            return response.success;
        }
        return response.prev;
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    public onKbdNext(
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const chart = this.chart;
        const a11yOptions = chart.options.accessibility;
        const response = keyboardNavigationHandler.response;

        // Try to highlight next item in list. Highlighting e.g.
        // separators will fail.
        for (
            let i = (chart.highlightedExportItemIx || 0) + 1;
            i < (chart.exporting?.divElements?.length || 0);
            ++i
        ) {
            if (chart.highlightExportItem(i)) {
                return response.success;
            }
        }

        // We failed, so wrap around or move to next module
        if (a11yOptions.keyboardNavigation.wrapAround) {
            chart.highlightExportItem(0);
            return response.success;
        }
        return response.next;
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    public onKbdClick(
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const chart = this.chart;
        const curHighlightedItem =
            chart.highlightedExportItemIx !== void 0 &&
                chart.exporting?.divElements?.[
                    chart.highlightedExportItemIx
                ];
        const exportButtonElement = getExportMenuButtonElement(chart)?.element;

        if (chart.exporting?.openMenu) {
            curHighlightedItem && this.fakeClickEvent(curHighlightedItem);
        } else {
            exportButtonElement && this.fakeClickEvent(exportButtonElement);
            chart.highlightExportItem(0);
        }

        return keyboardNavigationHandler.response.success;
    }

}


/* *
 *
 *  Class Prototype
 *
 * */


interface MenuComponent {
    chart: MenuComponent.ChartComposition;
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace MenuComponent {


    /* *
     *
     *  Declarations
     *
     * */


    export declare class ChartComposition extends Accessibility.ChartComposition {
        public highlightedExportItemIx?: number;
        /** @requires modules/accessibility */
        public hideExportMenu(): void;
        /** @requires modules/accessibility */
        public highlightExportItem(ix: number): (boolean|undefined);
        /** @requires modules/accessibility */
        public highlightLastExportItem(): boolean;
        /** @requires modules/accessibility */
        public showExportMenu(): void;
    }


    /* *
     *
     *  Functions
     *
     * */


    /**
     * @private
     */
    export function compose(
        ChartClass: typeof Chart
    ): void {
        const chartProto = ChartClass.prototype as ChartComposition;

        if (!chartProto.hideExportMenu) {
            chartProto.hideExportMenu = chartHideExportMenu;
            chartProto.highlightExportItem = chartHighlightExportItem;
            chartProto.highlightLastExportItem = chartHighlightLastExportItem;
            chartProto.showExportMenu = chartShowExportMenu;
        }

    }

    /**
     * Show the export menu and focus the first item (if exists).
     *
     * @private
     * @function Highcharts.Chart#showExportMenu
     */
    function chartShowExportMenu(
        this: ChartComposition
    ): void {
        const exportButton = getExportMenuButtonElement(this);

        if (exportButton) {
            const el = exportButton.element;
            if (el.onclick) {
                el.onclick = function (): void {
                    getFakeMouseEvent('click');
                };
            }
        }
    }

    /**
     * @private
     * @function Highcharts.Chart#hideExportMenu
     */
    function chartHideExportMenu(
        this: ChartComposition
    ): void {
        const chart = this,
            exportList = chart.exporting?.divElements;

        if (
            exportList &&
            chart.exporting?.contextMenuEl &&
            chart.exporting?.openMenu
        ) {
            // Reset hover states etc.
            exportList.forEach((el): void => {
                if (
                    el &&
                    el.className === 'highcharts-menu-item' &&
                    el.onmouseout
                ) {
                    el.onmouseout(getFakeMouseEvent('mouseout'));
                }
            });
            chart.highlightedExportItemIx = 0;
            // Hide the menu div
            chart.exporting.contextMenuEl.hideMenu();
            // Make sure the chart has focus and can capture keyboard events
            chart.container.focus();
        }
    }


    /**
     * Highlight export menu item by index.
     *
     * @private
     * @function Highcharts.Chart#highlightExportItem
     */
    function chartHighlightExportItem(
        this: ChartComposition,
        ix: number
    ): boolean {
        const listItem = this.exporting?.divElements?.[ix],
            curHighlighted = this.highlightedExportItemIx !== void 0 &&
                this.exporting?.divElements?.[
                    this.highlightedExportItemIx
                ];

        if (
            listItem &&
            listItem.tagName === 'LI' &&
            !(listItem.children && listItem.children.length)
        ) {
            // Test if we have focus support for SVG elements
            const hasSVGFocusSupport = !!(
                this.renderTo.getElementsByTagName('g')[0] || {}
            ).focus;

            // Only focus if we can set focus back to the elements after
            // destroying the menu (#7422)
            if (listItem.focus && hasSVGFocusSupport) {
                listItem.focus();
            }
            if (curHighlighted && curHighlighted.onmouseout) {
                curHighlighted.onmouseout(getFakeMouseEvent('mouseout'));
            }
            if (listItem.onmouseover) {
                listItem.onmouseover(getFakeMouseEvent('mouseover'));
            }
            this.highlightedExportItemIx = ix;
            return true;
        }

        return false;
    }


    /**
     * Try to highlight the last valid export menu item.
     *
     * @private
     * @function Highcharts.Chart#highlightLastExportItem
     */
    function chartHighlightLastExportItem(
        this: ChartComposition
    ): boolean {
        const chart = this;
        if (chart.exporting?.divElements) {
            let i = chart.exporting?.divElements.length;
            while (i--) {
                if (chart.highlightExportItem(i)) {
                    return true;
                }
            }
        }
        return false;
    }


}

/* *
 *
 *  Default Export
 *
 * */

export default MenuComponent;
