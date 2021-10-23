/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for exporting menu.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Exporting from '../../Extensions/Exporting/Exporting';
import type { SVGDOMElement } from '../../Core/Renderer/DOMElementType';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type ProxyElement from '../ProxyElement';

import Chart from '../../Core/Chart/Chart.js';
import U from '../../Core/Utilities.js';
const {
    attr,
    extend
} = U;

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

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        highlightedExportItemIx?: number;
        /** @requires modules/accessibility */
        hideExportMenu(): void;
        /** @requires modules/accessibility */
        highlightExportItem(ix: number): (boolean|undefined);
        /** @requires modules/accessibility */
        highlightLastExportItem(): boolean;
        /** @requires modules/accessibility */
        showExportMenu(): void;
    }
}
/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class MenuComponent extends AccessibilityComponent {
            public constructor();
            public exportButtonProxy?: ProxyElement;
            public addAccessibleContextMenuAttribs(): void;
            public proxyMenuButton(): void;
            public createProxyGroup(): void;
            public getKeyboardNavigation(): KeyboardNavigationHandler;
            public onChartRender(): void;
            public onKbdClick(
                keyboardNavigationHandler: KeyboardNavigationHandler
            ): number;
            public onKbdNext(
                keyboardNavigationHandler: KeyboardNavigationHandler
            ): number;
            public onKbdPrevious(
                keyboardNavigationHandler: KeyboardNavigationHandler
            ): number;
            public onMenuHidden(): void;
            public onMenuShown(): void;
            public setExportButtonExpandedState(stateStr: string): void;
            isExportMenuShown: boolean;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */


/**
 * Get the wrapped export button element of a chart.
 *
 * @private
 */
function getExportMenuButtonElement(chart: Chart): (SVGElement|undefined) {
    return chart.exportSVGElements && chart.exportSVGElements[0];
}


/**
 * Show the export menu and focus the first item (if exists).
 *
 * @private
 * @function Highcharts.Chart#showExportMenu
 */
Chart.prototype.showExportMenu = function (): void {
    const exportButton = getExportMenuButtonElement(this);

    if (exportButton) {
        const el = exportButton.element;
        if (el.onclick) {
            el.onclick(getFakeMouseEvent('click'));
        }
    }
};


/**
 * @private
 * @function Highcharts.Chart#hideExportMenu
 */
Chart.prototype.hideExportMenu = function (): void {
    const chart = this,
        exportList = chart.exportDivElements;

    if (exportList && chart.exportContextMenu) {
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
        chart.exportContextMenu.hideMenu();
        // Make sure the chart has focus and can capture keyboard events
        chart.container.focus();
    }
};


/**
 * Highlight export menu item by index.
 *
 * @private
 * @function Highcharts.Chart#highlightExportItem
 */
Chart.prototype.highlightExportItem = function (
    ix: number
): boolean {
    const listItem = this.exportDivElements && this.exportDivElements[ix];
    const curHighlighted =
            this.exportDivElements &&
            this.exportDivElements[this.highlightedExportItemIx as any];

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
};


/**
 * Try to highlight the last valid export menu item.
 * @private
 */
Chart.prototype.highlightLastExportItem = function (): boolean {
    const chart = this;
    if (chart.exportDivElements) {
        let i = chart.exportDivElements.length;
        while (i--) {
            if (chart.highlightExportItem(i)) {
                return true;
            }
        }
    }
    return false;
};


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


/**
 * The MenuComponent class
 *
 * @private
 * @class
 * @name Highcharts.MenuComponent
 */
const MenuComponent: typeof Highcharts.MenuComponent =
    function (): void {} as any;
MenuComponent.prototype = new (AccessibilityComponent as any)();
extend(MenuComponent.prototype, /** @lends Highcharts.MenuComponent */ {

    /**
     * Init the component
     */
    init: function (this: Highcharts.MenuComponent): void {
        const chart = this.chart,
            component = this;

        this.addEvent(chart, 'exportMenuShown', function (): void {
            component.onMenuShown();
        });

        this.addEvent(chart, 'exportMenuHidden', function (): void {
            component.onMenuHidden();
        });

        this.createProxyGroup();
    },


    /**
     * @private
     */
    onMenuHidden: function (this: Highcharts.MenuComponent): void {
        const menu: Exporting.DivElement =
            (this.chart as any).exportContextMenu;
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }

        this.isExportMenuShown = false;
        this.setExportButtonExpandedState('false');
    },


    /**
     * @private
     */
    onMenuShown: function (this: Highcharts.MenuComponent): void {
        const chart = this.chart,
            menu = chart.exportContextMenu;

        if (menu) {
            this.addAccessibleContextMenuAttribs();
            unhideChartElementFromAT(chart, menu);
        }

        this.isExportMenuShown = true;
        this.setExportButtonExpandedState('true');
    },


    /**
     * @private
     * @param {string} stateStr
     */
    setExportButtonExpandedState: function (
        this: Highcharts.MenuComponent,
        stateStr: string
    ): void {
        if (this.exportButtonProxy) {
            this.exportButtonProxy.buttonElement.setAttribute('aria-expanded', stateStr);
        }
    },


    /**
     * Called on each render of the chart. We need to update positioning of the
     * proxy overlay.
     */
    onChartRender: function (this: Highcharts.MenuComponent): void {
        this.proxyProvider.clearGroup('chartMenu');
        this.proxyMenuButton();
    },


    /**
     * @private
     */
    proxyMenuButton: function (
        this: Highcharts.MenuComponent
    ): void {
        const chart = this.chart;
        const proxyProvider = this.proxyProvider;
        const buttonEl = getExportMenuButtonElement(chart);

        if (exportingShouldHaveA11y(chart) && buttonEl) {
            this.exportButtonProxy = proxyProvider.addProxyElement(
                'chartMenu',
                { click: buttonEl },
                {
                    'aria-label': chart.langFormat(
                        'accessibility.exporting.menuButtonLabel',
                        {
                            chart: chart,
                            chartTitle: getChartTitle(chart)
                        }
                    ),
                    'aria-expanded': false
                }
            );
        }
    },


    /**
     * @private
     */
    createProxyGroup: function (
        this: Highcharts.MenuComponent
    ): void {
        const chart = this.chart;
        if (chart && this.proxyProvider) {
            this.proxyProvider.addGroup('chartMenu', 'div');
        }
    },


    /**
     * @private
     */
    addAccessibleContextMenuAttribs: function (
        this: Highcharts.MenuComponent
    ): void {
        const chart = this.chart,
            exportList = chart.exportDivElements;

        if (exportList && exportList.length) {
            // Set tabindex on the menu items to allow focusing by script
            // Set role to give screen readers a chance to pick up the contents
            exportList.forEach((item): void => {
                if (item) {
                    if (item.tagName === 'LI' &&
                        !(item.children && item.children.length)) {
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
                        'accessibility.exporting.chartMenuLabel', { chart: chart }
                    ),
                    role: 'list' // Needed for webkit/VO
                });
            }
        }
    },


    /**
     * Get keyboard navigation handler for this component.
     */
    getKeyboardNavigation: function (
        this: Highcharts.MenuComponent
    ): KeyboardNavigationHandler {
        const keys = this.keyCodes,
            chart = this.chart,
            component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
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
                    chart.options.exporting.enabled !== false &&
                    (chart.options.exporting.accessibility as any).enabled !==
                    false;
            },

            // Focus export menu button
            init: function (): void {
                const proxy = component.exportButtonProxy;
                const svgEl = component.chart.exportingGroup;
                if (proxy && svgEl) {
                    chart.setFocusToElement(svgEl, proxy.buttonElement);
                }
            },

            // Hide the menu
            terminate: function (): void {
                chart.hideExportMenu();
            }
        });
    },


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    onKbdPrevious: function (
        this: Highcharts.MenuComponent,
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
    },


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    onKbdNext: function (
        this: Highcharts.MenuComponent,
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const chart = this.chart;
        const a11yOptions = chart.options.accessibility;
        const response = keyboardNavigationHandler.response;

        // Try to highlight next item in list. Highlighting e.g.
        // separators will fail.
        for (
            let i = (chart.highlightedExportItemIx || 0) + 1;
            i < (chart.exportDivElements as any).length;
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
    },


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    onKbdClick: function (
        this: Highcharts.MenuComponent,
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const chart = this.chart;
        const curHighlightedItem = (chart.exportDivElements as any)[
            chart.highlightedExportItemIx as any
        ];
        const exportButtonElement: SVGDOMElement = (getExportMenuButtonElement(chart) as any).element;

        if (this.isExportMenuShown) {
            this.fakeClickEvent(curHighlightedItem);
        } else {
            this.fakeClickEvent(exportButtonElement);
            chart.highlightExportItem(0);
        }

        return keyboardNavigationHandler.response.success;
    }

});

export default MenuComponent;
