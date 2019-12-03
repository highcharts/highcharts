/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for chart legend.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import U from '../../../parts/Utilities.js';
var extend = U.extend;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

import HTMLUtilities from '../utils/htmlUtilities.js';
var stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString,
    removeElement = HTMLUtilities.removeElement;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class LegendComponent extends AccessibilityComponent {
            public constructor();
            public highlightedLegendItemIx: number;
            public legendProxyButtonClicked?: boolean;
            public legendProxyGroup: HTMLDOMElement;
            public addLegendProxyGroup(): void;
            public getKeyboardNavigation(): KeyboardNavigationHandler;
            public init(): void;
            public onChartRender(): void;
            public onKbdArrowKey(
                keyboardNavigationHandler: KeyboardNavigationHandler,
                keyCode: number
            ): number;
            public onKbdClick(
                keyboardNavigationHandler: KeyboardNavigationHandler
            ): number;
            public onKbdNavigationInit(direction: number): void;
            public proxyLegendItem(
                item: (
                    Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series
                )
            ): void;
            public proxyLegendItems(): void;
            public shouldHaveLegendNavigation(): (boolean);
            public updateLegendItemProxyVisibility(): void;
            public updateProxies(): void;
        }
        interface BubbleLegend {
            a11yProxyElement?: HTMLDOMElement;
        }
        interface Chart {
            highlightedLegendItemIx?: number;
            /** @requires modules/accessibility */
            highlightLegendItem(ix: number): boolean;
        }
        interface Point {
            a11yProxyElement?: HTMLDOMElement;
        }
        interface Series {
            a11yProxyElement?: HTMLDOMElement;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function scrollLegendToItem(legend: Highcharts.Legend, itemIx: number): void {
    var itemPage = legend.allItems[itemIx].pageIx,
        curPage: number = legend.currentPage as any;

    if (typeof itemPage !== 'undefined' && itemPage + 1 !== curPage) {
        legend.scroll(1 + itemPage - curPage);
    }
}


/**
 * @private
 */
function shouldDoLegendA11y(chart: Highcharts.Chart): boolean {
    var items = chart.legend && chart.legend.allItems,
        legendA11yOptions: Highcharts.LegendAccessibilityOptions = (
            (chart.options.legend as any).accessibility || {}
        );

    return !!(
        items && items.length &&
        !(chart.colorAxis && chart.colorAxis.length) &&
        legendA11yOptions.enabled !== false
    );
}


/**
 * Highlight legend item by index.
 *
 * @private
 * @function Highcharts.Chart#highlightLegendItem
 *
 * @param {number} ix
 *
 * @return {boolean}
 */
H.Chart.prototype.highlightLegendItem = function (ix: number): boolean {
    var items = this.legend.allItems,
        oldIx: number = this.highlightedLegendItemIx as any;

    if (items[ix]) {
        if (items[oldIx]) {
            H.fireEvent((items[oldIx].legendGroup as any).element, 'mouseout');
        }

        scrollLegendToItem(this.legend, ix);

        this.setFocusToElement(
            items[ix].legendItem as any,
            items[ix].a11yProxyElement
        );

        H.fireEvent((items[ix].legendGroup as any).element, 'mouseover');
        return true;
    }
    return false;
};

// Keep track of pressed state for legend items
H.addEvent(H.Legend, 'afterColorizeItem', function (
    e: {
        item: (Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series);
        visible: (boolean|undefined);
    }
): void {
    var chart: Highcharts.AccessibilityChart = this.chart as any,
        a11yOptions = chart.options.accessibility,
        legendItem = e.item;

    if (a11yOptions.enabled && legendItem && legendItem.a11yProxyElement) {
        legendItem.a11yProxyElement.setAttribute(
            'aria-pressed', e.visible ? 'false' : 'true'
        );
    }
});


/**
 * The LegendComponent class
 *
 * @private
 * @class
 * @name Highcharts.LegendComponent
 */
var LegendComponent: typeof Highcharts.LegendComponent =
    function (): void {} as any;
LegendComponent.prototype = new (AccessibilityComponent as any)();
extend(LegendComponent.prototype, /** @lends Highcharts.LegendComponent */ {

    /**
     * Init the component
     * @private
     */
    init: function (this: Highcharts.LegendComponent): void {
        var component = this;

        this.addEvent(H.Legend, 'afterScroll', function (): void {
            if (this.chart === component.chart) {
                component.updateProxies();
            }
        });
    },


    /**
     * @private
     */
    updateLegendItemProxyVisibility: function (
        this: Highcharts.LegendComponent
    ): void {
        var legend = this.chart.legend,
            items = legend.allItems || [],
            curPage = legend.currentPage || 1;

        items.forEach(function (
            item: (Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series)
        ): void {
            var itemPage = item.pageIx || 0,
                hide = itemPage !== curPage - 1;

            if (item.a11yProxyElement) {
                item.a11yProxyElement.style.visibility = hide ?
                    'hidden' : 'visible';
            }
        });
    },


    /**
     * The legend needs updates on every render, in order to update positioning
     * of the proxy overlays.
     */
    onChartRender: function (this: Highcharts.LegendComponent): void {
        var component = this;

        // Ignore render after proxy clicked. No need to destroy it, and
        // destroying also kills focus.
        if (this.legendProxyButtonClicked) {
            delete component.legendProxyButtonClicked;
            return;
        }

        this.updateProxies();
    },


    /**
     * @private
     */
    updateProxies: function (this: Highcharts.LegendComponent): void {
        removeElement(this.legendProxyGroup);

        if (shouldDoLegendA11y(this.chart)) {
            this.addLegendProxyGroup();
            this.proxyLegendItems();
            this.updateLegendItemProxyVisibility();
        }
    },


    /**
     * @private
     */
    addLegendProxyGroup: function (this: Highcharts.LegendComponent): void {
        var a11yOptions = this.chart.options.accessibility,
            groupLabel = this.chart.langFormat(
                'accessibility.legend.legendLabel', {}
            ),
            groupRole = a11yOptions.landmarkVerbosity === 'all' ?
                'region' : null;

        this.legendProxyGroup = this.addProxyGroup({
            'aria-label': groupLabel,
            'role': groupRole as any
        });
    },


    /**
     * @private
     */
    proxyLegendItems: function (this: Highcharts.LegendComponent): void {
        var component = this,
            items = (
                this.chart.legend &&
                this.chart.legend.allItems || []
            );

        items.forEach(function (
            item: (Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series)
        ): void {
            if (item.legendItem && item.legendItem.element) {
                component.proxyLegendItem(item);
            }
        });
    },


    /**
     * @private
     * @param {Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series} item
     */
    proxyLegendItem: function (
        this: Highcharts.LegendComponent,
        item: (Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series)
    ): void {
        var component = this,
            itemLabel = this.chart.langFormat(
                'accessibility.legend.legendItem',
                {
                    chart: this.chart,
                    itemName: stripHTMLTags((item as any).name)
                }
            ),
            attribs = {
                tabindex: -1,
                'aria-pressed': !item.visible,
                'aria-label': itemLabel
            },
            // Keep track of when we should ignore next render
            preClickEvent = function (): void {
                component.legendProxyButtonClicked = true;
            },
            // Considers useHTML
            proxyPositioningElement = (item.legendGroup as any).div ?
                item.legendItem : item.legendGroup;

        item.a11yProxyElement = this.createProxyButton(
            item.legendItem as any,
            this.legendProxyGroup as any,
            attribs,
            proxyPositioningElement,
            preClickEvent
        );
    },


    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function (
        this: Highcharts.LegendComponent
    ): Highcharts.KeyboardNavigationHandler {
        var keys = this.keyCodes,
            component = this,
            chart = this.chart;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.left, keys.right, keys.up, keys.down],
                    function (
                        this: Highcharts.KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return component.onKbdArrowKey(this, keyCode);
                    }
                ],
                [
                    [keys.enter, keys.space],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): number {
                        return component.onKbdClick(this);
                    }
                ]
            ],

            validate: function (): (boolean) {
                return component.shouldHaveLegendNavigation();
            },

            init: function (direction: number): void {
                return component.onKbdNavigationInit(direction);
            }
        });
    },


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number}
     * Response code
     */
    onKbdArrowKey: function (
        this: Highcharts.LegendComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler,
        keyCode: number
    ): number {
        var keys = this.keyCodes,
            response = keyboardNavigationHandler.response,
            chart = this.chart,
            a11yOptions = chart.options.accessibility,
            numItems = chart.legend.allItems.length,
            direction = (keyCode === keys.left || keyCode === keys.up) ? -1 : 1;

        var res = chart.highlightLegendItem(
            this.highlightedLegendItemIx + direction
        );
        if (res) {
            this.highlightedLegendItemIx += direction;
            return response.success;
        }

        if (
            numItems > 1 &&
            a11yOptions.keyboardNavigation.wrapAround
        ) {
            keyboardNavigationHandler.init(direction);
            return response.success;
        }

        // No wrap, move
        return response[direction > 0 ? 'next' : 'prev'];
    },


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number}
     * Response code
     */
    onKbdClick: function (
        this: Highcharts.LegendComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler
    ): number {
        var legendItem: (
            Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series
        ) = this.chart.legend.allItems[
            this.highlightedLegendItemIx
        ];

        if (legendItem && legendItem.a11yProxyElement) {
            H.fireEvent(legendItem.a11yProxyElement, 'click');
        }

        return keyboardNavigationHandler.response.success;
    },


    /**
     * @private
     * @return {boolean|undefined}
     */
    shouldHaveLegendNavigation: function (
        this: Highcharts.LegendComponent
    ): (boolean) {
        var chart = this.chart,
            legendOptions = chart.options.legend || {},
            hasLegend = chart.legend && chart.legend.allItems,
            hasColorAxis = chart.colorAxis && chart.colorAxis.length,
            legendA11yOptions: DeepPartial<(
                Highcharts.LegendAccessibilityOptions
            )> = (
                legendOptions.accessibility || {}
            );

        return !!(
            hasLegend &&
            chart.legend.display &&
            !hasColorAxis &&
            legendA11yOptions.enabled &&
            legendA11yOptions.keyboardNavigation &&
            legendA11yOptions.keyboardNavigation.enabled
        );
    },


    /**
     * @private
     * @param {number} direction
     */
    onKbdNavigationInit: function (
        this: Highcharts.LegendComponent,
        direction: number
    ): void {
        var chart = this.chart,
            lastIx = chart.legend.allItems.length - 1,
            ixToHighlight = direction > 0 ? 0 : lastIx;

        chart.highlightLegendItem(ixToHighlight);
        this.highlightedLegendItemIx = ixToHighlight;
    }

});

export default LegendComponent;
