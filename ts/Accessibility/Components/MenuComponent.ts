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

import type Chart from '../../Core/Chart/Chart';
import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    extend
} = U;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

import ChartUtilities from '../Utils/ChartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;

import HTMLUtilities from '../Utils/HTMLUtilities.js';
var removeElement = HTMLUtilities.removeElement,
    getFakeMouseEvent = HTMLUtilities.getFakeMouseEvent;

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
            public exportButtonProxy?: HTMLDOMElement;
            public exportProxyGroup?: HTMLDOMElement;
            public addAccessibleContextMenuAttribs(): void;
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
 * @param {Highcharts.Chart} chart
 * @returns {Highcharts.SVGElement}
 */
function getExportMenuButtonElement(chart: Chart): Highcharts.SVGElement|undefined {
    return chart.exportSVGElements && chart.exportSVGElements[0];
}


/**
 * Show the export menu and focus the first item (if exists).
 *
 * @private
 * @function Highcharts.Chart#showExportMenu
 */
H.Chart.prototype.showExportMenu = function (): void {
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
H.Chart.prototype.hideExportMenu = function (): void {
    var chart = this,
        exportList = chart.exportDivElements;

    if (exportList && chart.exportContextMenu) {
        // Reset hover states etc.
        exportList.forEach(function (el: Highcharts.ExportingDivElement): void {
            if (el.className === 'highcharts-menu-item' && el.onmouseout) {
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
 *
 * @param {number} ix
 *
 * @return {boolean}
 */
H.Chart.prototype.highlightExportItem = function (
    ix: number
): boolean {
    var listItem = this.exportDivElements && this.exportDivElements[ix],
        curHighlighted =
            this.exportDivElements &&
            this.exportDivElements[this.highlightedExportItemIx as any],
        hasSVGFocusSupport;

    if (
        listItem &&
        listItem.tagName === 'LI' &&
        !(listItem.children && listItem.children.length)
    ) {
        // Test if we have focus support for SVG elements
        hasSVGFocusSupport = !!(
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
 *
 * @private
 * @function Highcharts.Chart#highlightLastExportItem
 * @return {boolean}
 */
H.Chart.prototype.highlightLastExportItem = function (): boolean {
    var chart = this,
        i;

    if (chart.exportDivElements) {
        i = chart.exportDivElements.length;
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
 * @param {Highcharts.Chart} chart
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
var MenuComponent: typeof Highcharts.MenuComponent =
    function (): void {} as any;
MenuComponent.prototype = new (AccessibilityComponent as any)();
extend(MenuComponent.prototype, /** @lends Highcharts.MenuComponent */ {

    /**
     * Init the component
     */
    init: function (this: Highcharts.MenuComponent): void {
        var chart = this.chart,
            component = this;

        this.addEvent(chart, 'exportMenuShown', function (): void {
            component.onMenuShown();
        });

        this.addEvent(chart, 'exportMenuHidden', function (): void {
            component.onMenuHidden();
        });
    },


    /**
     * @private
     */
    onMenuHidden: function (this: Highcharts.MenuComponent): void {
        var menu: Highcharts.ExportingDivElement =
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
        var chart = this.chart,
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
        var button = this.exportButtonProxy;
        if (button) {
            button.setAttribute('aria-expanded', stateStr);
        }
    },


    /**
     * Called on each render of the chart. We need to update positioning of the
     * proxy overlay.
     */
    onChartRender: function (this: Highcharts.MenuComponent): void {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility;

        // Always start with a clean slate
        removeElement(this.exportProxyGroup);

        // Set screen reader properties on export menu
        if (exportingShouldHaveA11y(chart)) {
            // Proxy button and group
            this.exportProxyGroup = this.addProxyGroup(
                // Wrap in a region div if verbosity is high
                a11yOptions.landmarkVerbosity === 'all' ? {
                    'aria-label': chart.langFormat(
                        'accessibility.exporting.exportRegionLabel',
                        { chart: chart }
                    ),
                    'role': 'region'
                } : {}
            );

            const button: Highcharts.SVGElement = getExportMenuButtonElement(this.chart) as any;
            this.exportButtonProxy = this.createProxyButton(
                button,
                this.exportProxyGroup,
                {
                    'aria-label': chart.langFormat(
                        'accessibility.exporting.menuButtonLabel',
                        { chart: chart }
                    ),
                    'aria-expanded': false
                }
            );
        }
    },


    /**
     * @private
     */
    addAccessibleContextMenuAttribs: function (
        this: Highcharts.MenuComponent
    ): void {
        var chart = this.chart,
            exportList = chart.exportDivElements;

        if (exportList && exportList.length) {
            // Set tabindex on the menu items to allow focusing by script
            // Set role to give screen readers a chance to pick up the contents
            exportList.forEach(function (
                item: Highcharts.ExportingDivElement
            ): void {
                if (item.tagName === 'LI' &&
                    !(item.children && item.children.length)) {
                    item.setAttribute('tabindex', -1);
                } else {
                    item.setAttribute('aria-hidden', 'true');
                }
            });

            // Set accessibility properties on parent div
            var parentDiv: HTMLDOMElement = (
                exportList[0].parentNode as any
            );
            parentDiv.removeAttribute('aria-hidden');
            parentDiv.setAttribute(
                'aria-label',
                chart.langFormat(
                    'accessibility.exporting.chartMenuLabel', { chart: chart }
                )
            );
        }
    },


    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function (
        this: Highcharts.MenuComponent
    ): Highcharts.KeyboardNavigation {
        var keys = this.keyCodes,
            chart = this.chart,
            component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                // Arrow prev handler
                [
                    [keys.left, keys.up],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): number {
                        return component.onKbdPrevious(this);
                    }
                ],

                // Arrow next handler
                [
                    [keys.right, keys.down],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): number {
                        return component.onKbdNext(this);
                    }
                ],

                // Click handler
                [
                    [keys.enter, keys.space],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): number {
                        return component.onKbdClick(this);
                    }
                ]
            ],

            // Only run exporting navigation if exporting support exists and is
            // enabled on chart
            validate: function (): boolean {
                return chart.exportChart &&
                    chart.options.exporting.enabled !== false &&
                    (chart.options.exporting.accessibility as any).enabled !==
                    false;
            },

            // Focus export menu button
            init: function (): void {
                const exportBtn = component.exportButtonProxy,
                    exportGroup = chart.exportingGroup;

                if (exportGroup && exportBtn) {
                    chart.setFocusToElement(exportGroup, exportBtn);
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
     * @return {number}
     * Response code
     */
    onKbdPrevious: function (
        this: Highcharts.MenuComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler
    ): number {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility,
            response = keyboardNavigationHandler.response,
            i = chart.highlightedExportItemIx || 0;

        // Try to highlight prev item in list. Highlighting e.g.
        // separators will fail.
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
     * @return {number}
     * Response code
     */
    onKbdNext: function (
        this: Highcharts.MenuComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler
    ): number {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility,
            response = keyboardNavigationHandler.response,
            i = (chart.highlightedExportItemIx || 0) + 1;

        // Try to highlight next item in list. Highlighting e.g.
        // separators will fail.
        for (;i < (chart.exportDivElements as any).length; ++i) {
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
     * @return {number}
     * Response code
     */
    onKbdClick: function (
        this: Highcharts.MenuComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler
    ): number {
        const chart = this.chart,
            curHighlightedItem = (chart.exportDivElements as any)[
                chart.highlightedExportItemIx as any
            ],
            exportButtonElement = (getExportMenuButtonElement(chart) as Highcharts.SVGElement).element;

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
