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
import Chart from '../../Core/Chart/Chart.js';
import U from '../../Core/Utilities.js';
var attr = U.attr;
import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
var getChartTitle = ChartUtilities.getChartTitle, unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;
import HTMLUtilities from '../Utils/HTMLUtilities.js';
var getFakeMouseEvent = HTMLUtilities.getFakeMouseEvent;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * Get the wrapped export button element of a chart.
 * @private
 */
function getExportMenuButtonElement(chart) {
    return chart.exportSVGElements && chart.exportSVGElements[0];
}
/**
 * @private
 */
function exportingShouldHaveA11y(chart) {
    var exportingOpts = chart.options.exporting, exportButton = getExportMenuButtonElement(chart);
    return !!(exportingOpts &&
        exportingOpts.enabled !== false &&
        exportingOpts.accessibility &&
        exportingOpts.accessibility.enabled &&
        exportButton &&
        exportButton.element);
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
var MenuComponent = /** @class */ (function (_super) {
    __extends(MenuComponent, _super);
    function MenuComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Init the component
     */
    MenuComponent.prototype.init = function () {
        var chart = this.chart, component = this;
        this.addEvent(chart, 'exportMenuShown', function () {
            component.onMenuShown();
        });
        this.addEvent(chart, 'exportMenuHidden', function () {
            component.onMenuHidden();
        });
        this.createProxyGroup();
    };
    /**
     * @private
     */
    MenuComponent.prototype.onMenuHidden = function () {
        var menu = this.chart.exportContextMenu;
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }
        this.isExportMenuShown = false;
        this.setExportButtonExpandedState('false');
    };
    /**
     * @private
     */
    MenuComponent.prototype.onMenuShown = function () {
        var chart = this.chart, menu = chart.exportContextMenu;
        if (menu) {
            this.addAccessibleContextMenuAttribs();
            unhideChartElementFromAT(chart, menu);
        }
        this.isExportMenuShown = true;
        this.setExportButtonExpandedState('true');
    };
    /**
     * @private
     * @param {string} stateStr
     */
    MenuComponent.prototype.setExportButtonExpandedState = function (stateStr) {
        if (this.exportButtonProxy) {
            this.exportButtonProxy.buttonElement.setAttribute('aria-expanded', stateStr);
        }
    };
    /**
     * Called on each render of the chart. We need to update positioning of the
     * proxy overlay.
     */
    MenuComponent.prototype.onChartRender = function () {
        var chart = this.chart, focusEl = chart.focusElement, a11y = chart.accessibility;
        this.proxyProvider.clearGroup('chartMenu');
        this.proxyMenuButton();
        if (this.exportButtonProxy &&
            focusEl &&
            focusEl === chart.exportingGroup) {
            if (focusEl.focusBorder) {
                chart.setFocusToElement(focusEl, this.exportButtonProxy.buttonElement);
            }
            else if (a11y) {
                a11y.keyboardNavigation.tabindexContainer.focus();
            }
        }
    };
    /**
     * @private
     */
    MenuComponent.prototype.proxyMenuButton = function () {
        var chart = this.chart;
        var proxyProvider = this.proxyProvider;
        var buttonEl = getExportMenuButtonElement(chart);
        if (exportingShouldHaveA11y(chart) && buttonEl) {
            this.exportButtonProxy = proxyProvider.addProxyElement('chartMenu', { click: buttonEl }, {
                'aria-label': chart.langFormat('accessibility.exporting.menuButtonLabel', {
                    chart: chart,
                    chartTitle: getChartTitle(chart)
                }),
                'aria-expanded': false,
                title: chart.options.lang.contextButtonTitle || null
            });
        }
    };
    /**
     * @private
     */
    MenuComponent.prototype.createProxyGroup = function () {
        var chart = this.chart;
        if (chart && this.proxyProvider) {
            this.proxyProvider.addGroup('chartMenu', 'div');
        }
    };
    /**
     * @private
     */
    MenuComponent.prototype.addAccessibleContextMenuAttribs = function () {
        var chart = this.chart, exportList = chart.exportDivElements;
        if (exportList && exportList.length) {
            // Set tabindex on the menu items to allow focusing by script
            // Set role to give screen readers a chance to pick up the contents
            exportList.forEach(function (item) {
                if (item) {
                    if (item.tagName === 'LI' &&
                        !(item.children && item.children.length)) {
                        item.setAttribute('tabindex', -1);
                    }
                    else {
                        item.setAttribute('aria-hidden', 'true');
                    }
                }
            });
            // Set accessibility properties on parent div
            var parentDiv = (exportList[0] && exportList[0].parentNode);
            if (parentDiv) {
                attr(parentDiv, {
                    'aria-hidden': void 0,
                    'aria-label': chart.langFormat('accessibility.exporting.chartMenuLabel', { chart: chart }),
                    role: 'list' // Needed for webkit/VO
                });
            }
        }
    };
    /**
     * Get keyboard navigation handler for this component.
     * @private
     */
    MenuComponent.prototype.getKeyboardNavigation = function () {
        var keys = this.keyCodes, chart = this.chart, component = this;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Arrow prev handler
                [
                    [keys.left, keys.up],
                    function () {
                        return component.onKbdPrevious(this);
                    }
                ],
                // Arrow next handler
                [
                    [keys.right, keys.down],
                    function () {
                        return component.onKbdNext(this);
                    }
                ],
                // Click handler
                [
                    [keys.enter, keys.space],
                    function () {
                        return component.onKbdClick(this);
                    }
                ]
            ],
            // Only run exporting navigation if exporting support exists and is
            // enabled on chart
            validate: function () {
                return !!chart.exporting &&
                    chart.options.exporting.enabled !== false &&
                    chart.options.exporting.accessibility.enabled !==
                        false;
            },
            // Focus export menu button
            init: function () {
                var proxy = component.exportButtonProxy;
                var svgEl = component.chart.exportingGroup;
                if (proxy && svgEl) {
                    chart.setFocusToElement(svgEl, proxy.buttonElement);
                }
            },
            // Hide the menu
            terminate: function () {
                chart.hideExportMenu();
            }
        });
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    MenuComponent.prototype.onKbdPrevious = function (keyboardNavigationHandler) {
        var chart = this.chart;
        var a11yOptions = chart.options.accessibility;
        var response = keyboardNavigationHandler.response;
        // Try to highlight prev item in list. Highlighting e.g.
        // separators will fail.
        var i = chart.highlightedExportItemIx || 0;
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
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    MenuComponent.prototype.onKbdNext = function (keyboardNavigationHandler) {
        var chart = this.chart;
        var a11yOptions = chart.options.accessibility;
        var response = keyboardNavigationHandler.response;
        // Try to highlight next item in list. Highlighting e.g.
        // separators will fail.
        for (var i = (chart.highlightedExportItemIx || 0) + 1; i < chart.exportDivElements.length; ++i) {
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
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    MenuComponent.prototype.onKbdClick = function (keyboardNavigationHandler) {
        var chart = this.chart;
        var curHighlightedItem = chart.exportDivElements[chart.highlightedExportItemIx];
        var exportButtonElement = getExportMenuButtonElement(chart).element;
        if (this.isExportMenuShown) {
            this.fakeClickEvent(curHighlightedItem);
        }
        else {
            this.fakeClickEvent(exportButtonElement);
            chart.highlightExportItem(0);
        }
        return keyboardNavigationHandler.response.success;
    };
    return MenuComponent;
}(AccessibilityComponent));
/* *
 *
 *  Class Namespace
 *
 * */
(function (MenuComponent) {
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
    var composedClasses = [];
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    function compose(ChartClass) {
        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);
            var chartProto = Chart.prototype;
            chartProto.hideExportMenu = chartHideExportMenu;
            chartProto.highlightExportItem = chartHighlightExportItem;
            chartProto.highlightLastExportItem = chartHighlightLastExportItem;
            chartProto.showExportMenu = chartShowExportMenu;
        }
    }
    MenuComponent.compose = compose;
    /**
     * Show the export menu and focus the first item (if exists).
     *
     * @private
     * @function Highcharts.Chart#showExportMenu
     */
    function chartShowExportMenu() {
        var exportButton = getExportMenuButtonElement(this);
        if (exportButton) {
            var el = exportButton.element;
            if (el.onclick) {
                el.onclick(getFakeMouseEvent('click'));
            }
        }
    }
    /**
     * @private
     * @function Highcharts.Chart#hideExportMenu
     */
    function chartHideExportMenu() {
        var chart = this, exportList = chart.exportDivElements;
        if (exportList && chart.exportContextMenu) {
            // Reset hover states etc.
            exportList.forEach(function (el) {
                if (el &&
                    el.className === 'highcharts-menu-item' &&
                    el.onmouseout) {
                    el.onmouseout(getFakeMouseEvent('mouseout'));
                }
            });
            chart.highlightedExportItemIx = 0;
            // Hide the menu div
            chart.exportContextMenu.hideMenu();
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
    function chartHighlightExportItem(ix) {
        var listItem = this.exportDivElements && this.exportDivElements[ix];
        var curHighlighted = this.exportDivElements &&
            this.exportDivElements[this.highlightedExportItemIx];
        if (listItem &&
            listItem.tagName === 'LI' &&
            !(listItem.children && listItem.children.length)) {
            // Test if we have focus support for SVG elements
            var hasSVGFocusSupport = !!(this.renderTo.getElementsByTagName('g')[0] || {}).focus;
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
    function chartHighlightLastExportItem() {
        var chart = this;
        if (chart.exportDivElements) {
            var i = chart.exportDivElements.length;
            while (i--) {
                if (chart.highlightExportItem(i)) {
                    return true;
                }
            }
        }
        return false;
    }
})(MenuComponent || (MenuComponent = {}));
/* *
 *
 *  Default Export
 *
 * */
export default MenuComponent;
