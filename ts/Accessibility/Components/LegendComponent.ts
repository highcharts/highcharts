/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for chart legend.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type BubbleLegendItem from '../../Series/Bubble/BubbleLegendItem';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import A from '../../Core/Animation/AnimationUtilities.js';
const {
    animObject
} = A;
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import Legend from '../../Core/Legend/Legend.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    find,
    fireEvent,
    isNumber,
    pick,
    syncTimeout
} = U;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

import HTMLUtilities from '../Utils/HTMLUtilities.js';
const {
    removeElement,
    stripHTMLTagsFromString: stripHTMLTags
} = HTMLUtilities;
import ChartUtils from '../Utils/ChartUtilities.js';
const {
    getChartTitle
} = ChartUtils;

type LegendItem = (BubbleLegendItem|Series|Point);

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        highlightedLegendItemIx?: number;
        /** @requires modules/accessibility */
        highlightLegendItem(ix: number): boolean;
    }
}

declare module '../../Core/Legend/LegendItemObject' {
    interface LegendItemObject {
        a11yProxyElement?: HTMLDOMElement;
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        a11yProxyElement?: HTMLDOMElement;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        a11yProxyElement?: HTMLDOMElement;
    }
}

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
            public legendListContainer?: HTMLDOMElement;
            public proxyElementsList: Array<A11yLegendProxyButtonReference>;
            public addLegendProxyGroup(): void;
            public addLegendListContainer(): void;
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
            public proxyLegendItem(item: LegendItem): void;
            public proxyLegendItems(): void;
            public recreateProxies(): boolean;
            public removeProxies(): void;
            public shouldHaveLegendNavigation(): (boolean);
            public updateLegendItemProxyVisibility(): void;
            public updateLegendTitle(): void;
            public updateProxiesPositions(): void;
            public updateProxyPositionForItem(item: LegendItem): void;
        }
        interface A11yLegendProxyButtonReference {
            item: LegendItem;
            element: HTMLDOMElement;
            posElement: SVGElement;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function scrollLegendToItem(legend: Legend, itemIx: number): void {
    const itemPage = legend.allItems[itemIx].pageIx,
        curPage: number = legend.currentPage as any;

    if (typeof itemPage !== 'undefined' && itemPage + 1 !== curPage) {
        legend.scroll(1 + itemPage - curPage);
    }
}


/**
 * @private
 */
function shouldDoLegendA11y(chart: Chart): boolean {
    const items = chart.legend && chart.legend.allItems,
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
Chart.prototype.highlightLegendItem = function (ix: number): boolean {
    const items = this.legend.allItems,
        oldIx = this.accessibility &&
            this.accessibility.components.legend.highlightedLegendItemIx;

    if (items[ix]) {
        if (isNumber(oldIx) && items[oldIx]) {
            fireEvent((items[oldIx].legendGroup as any).element, 'mouseout');
        }

        scrollLegendToItem(this.legend, ix);

        this.setFocusToElement(
            items[ix].legendItem as any,
            items[ix].a11yProxyElement
        );

        fireEvent((items[ix].legendGroup as any).element, 'mouseover');
        return true;
    }
    return false;
};

// Keep track of pressed state for legend items
addEvent(Legend, 'afterColorizeItem', function (
    e: {
        item: LegendItem;
        visible: (boolean|undefined);
    }
): void {
    const chart: Highcharts.AccessibilityChart = this.chart as any,
        a11yOptions = chart.options.accessibility,
        legendItem = e.item;

    if (a11yOptions.enabled && legendItem && legendItem.a11yProxyElement) {
        legendItem.a11yProxyElement.setAttribute(
            'aria-pressed', e.visible ? 'true' : 'false'
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
const LegendComponent: typeof Highcharts.LegendComponent =
    function (): void {} as any;
LegendComponent.prototype = new (AccessibilityComponent as any)();
extend(LegendComponent.prototype, /** @lends Highcharts.LegendComponent */ {

    /**
     * Init the component
     * @private
     */
    init: function (this: Highcharts.LegendComponent): void {
        const component = this;
        this.proxyElementsList = [];
        this.recreateProxies();

        // Note: Chart could create legend dynamically, so events can not be
        // tied to the component's chart's current legend.
        this.addEvent(Legend, 'afterScroll', function (): void {
            if (this.chart === component.chart) {
                component.updateProxiesPositions();
                component.updateLegendItemProxyVisibility();
                this.chart.highlightLegendItem(component.highlightedLegendItemIx);
            }
        });
        this.addEvent(Legend, 'afterPositionItem', function (e: AnyRecord): void {
            if (this.chart === component.chart && this.chart.renderer) {
                component.updateProxyPositionForItem(e.item);
            }
        });
        this.addEvent(Legend, 'afterRender', function (): void { // #15902
            if (
                this.chart === component.chart &&
                this.chart.renderer &&
                component.recreateProxies()
            ) {
                syncTimeout(
                    (): void => component.updateProxiesPositions(),
                    animObject(
                        pick(this.chart.renderer.globalAnimation, true)
                    ).duration
                );
            }
        });
    },


    /**
     * @private
     */
    updateLegendItemProxyVisibility: function (
        this: Highcharts.LegendComponent
    ): void {
        const legend = this.chart.legend,
            items = legend.allItems || [],
            curPage = legend.currentPage || 1,
            clipHeight = legend.clipHeight || 0;

        items.forEach(function (item: LegendItem): void {
            const itemPage = item.pageIx || 0,
                y = item._legendItemPos ? item._legendItemPos[1] : 0,
                h = item.legendItem ? Math.round(item.legendItem.getBBox().height) : 0,
                hide = y + h - legend.pages[itemPage] > clipHeight || itemPage !== curPage - 1;

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
        if (!shouldDoLegendA11y(this.chart)) {
            this.removeProxies();
        }
    },


    /**
     * @private
     */
    onChartUpdate: function (this: Highcharts.LegendComponent): void {
        this.updateLegendTitle();
    },


    /**
     * @private
     */
    updateProxiesPositions: function (this: Highcharts.LegendComponent): void {
        for (const { element, posElement } of this.proxyElementsList) {
            this.updateProxyButtonPosition(element, posElement);
        }
    },


    /**
     * @private
     */
    updateProxyPositionForItem: function (
        this: Highcharts.LegendComponent,
        item: LegendItem
    ): void {
        const proxyRef = find(this.proxyElementsList,
            (ref: Highcharts.A11yLegendProxyButtonReference): boolean => ref.item === item);

        if (proxyRef) {
            this.updateProxyButtonPosition(proxyRef.element, proxyRef.posElement);
        }
    },


    /**
     * @private
     */
    recreateProxies: function (this: Highcharts.LegendComponent): boolean {
        this.removeProxies();

        if (shouldDoLegendA11y(this.chart)) {
            this.addLegendProxyGroup();
            this.addLegendListContainer();
            this.proxyLegendItems();
            this.updateLegendItemProxyVisibility();
            return true;
        }
        return false;
    },


    /**
     * @private
     */
    removeProxies: function (this: Highcharts.LegendComponent): void {
        removeElement(this.legendProxyGroup);
        this.proxyElementsList = [];
    },


    /**
     * @private
     */
    updateLegendTitle: function (this: Highcharts.LegendComponent): void {
        const chart = this.chart;
        const legendTitle = stripHTMLTags(
            (
                chart.legend &&
                chart.legend.options.title &&
                chart.legend.options.title.text ||
                ''
            ).replace(/<br ?\/?>/g, ' ')
        );
        const legendLabel = chart.langFormat(
            'accessibility.legend.legendLabel' + (legendTitle ? '' : 'NoTitle'), {
                chart,
                legendTitle,
                chartTitle: getChartTitle(chart)
            }
        );

        if (this.legendProxyGroup) {
            this.legendProxyGroup.setAttribute('aria-label', legendLabel);
        }
    },


    /**
     * @private
     */
    addLegendProxyGroup: function (this: Highcharts.LegendComponent): void {
        const a11yOptions = this.chart.options.accessibility,
            groupRole = a11yOptions.landmarkVerbosity === 'all' ?
                'region' : null;

        this.legendProxyGroup = this.addProxyGroup({
            'aria-label': '_placeholder_', // Filled in by updateLegendTitle
            role: groupRole as any
        });
    },


    /**
     * @private
     */
    addLegendListContainer: function (this: Highcharts.LegendComponent): void {
        if (this.legendProxyGroup) {
            const container = this.legendListContainer = this.createElement('ul');
            container.style.listStyle = 'none';
            this.legendProxyGroup.appendChild(container);
        }
    },


    /**
     * @private
     */
    proxyLegendItems: function (this: Highcharts.LegendComponent): void {
        const component = this,
            items = (
                this.chart.legend &&
                this.chart.legend.allItems || []
            );

        items.forEach(function (item: LegendItem): void {
            if (item.legendItem && item.legendItem.element) {
                component.proxyLegendItem(item);
            }
        });
    },


    /**
     * @private
     * @param {Highcharts.BubbleLegendItem|Point|Highcharts.Series} item
     */
    proxyLegendItem: function (
        this: Highcharts.LegendComponent,
        item: LegendItem
    ): void {
        if (!item.legendItem || !item.legendGroup || !this.legendListContainer) {
            return;
        }

        const itemLabel = this.chart.langFormat(
                'accessibility.legend.legendItem',
                {
                    chart: this.chart,
                    itemName: stripHTMLTags((item as any).name),
                    item
                }
            ),
            attribs = {
                tabindex: -1,
                'aria-pressed': item.visible,
                'aria-label': itemLabel
            },
            // Considers useHTML
            proxyPositioningElement = item.legendGroup.div ?
                item.legendItem : item.legendGroup;

        const listItem = this.createElement('li');
        this.legendListContainer.appendChild(listItem);

        item.a11yProxyElement = this.createProxyButton(
            item.legendItem as any,
            listItem,
            attribs,
            proxyPositioningElement as any
        );

        this.proxyElementsList.push({
            item: item,
            element: item.a11yProxyElement,
            posElement: proxyPositioningElement as any
        });
    },


    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function (
        this: Highcharts.LegendComponent
    ): Highcharts.KeyboardNavigationHandler {
        const keys = this.keyCodes,
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
                        this: Highcharts.KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        if (H.isFirefox && keyCode === keys.space) { // #15520
                            return this.response.success;
                        }
                        return component.onKbdClick(this);
                    }
                ]
            ],

            validate: function (): (boolean) {
                return component.shouldHaveLegendNavigation();
            },

            init: function (direction: number): void {
                return component.onKbdNavigationInit(direction);
            },

            terminate: function (): void {
                chart.legend.allItems.forEach(
                    (item): unknown => item.setState('', true));
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
        const keys = this.keyCodes,
            response = keyboardNavigationHandler.response,
            chart = this.chart,
            a11yOptions = chart.options.accessibility,
            numItems = chart.legend.allItems.length,
            direction = (keyCode === keys.left || keyCode === keys.up) ? -1 : 1;

        const res = chart.highlightLegendItem(
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
        const legendItem: LegendItem = this.chart.legend.allItems[
            this.highlightedLegendItemIx
        ];

        if (legendItem && legendItem.a11yProxyElement) {
            fireEvent(legendItem.a11yProxyElement, 'click');
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
        const chart = this.chart,
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
        const chart = this.chart,
            lastIx = chart.legend.allItems.length - 1,
            ixToHighlight = direction > 0 ? 0 : lastIx;

        chart.highlightLegendItem(ixToHighlight);
        this.highlightedLegendItemIx = ixToHighlight;
    }

});

export default LegendComponent;
