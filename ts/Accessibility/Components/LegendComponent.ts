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


/* *
 *
 *  Imports
 *
 * */


import type Accessibility from '../Accessibility';
import type Chart from '../../Core/Chart/Chart.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type ProxyElement from '../ProxyElement';

import A from '../../Core/Animation/AnimationUtilities.js';
const {
    animObject
} = A;
import H from '../../Core/Globals.js';
import Legend from '../../Core/Legend/Legend.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    isNumber,
    pick,
    syncTimeout
} = U;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

import CU from '../Utils/ChartUtilities.js';
const {
    getChartTitle
} = CU;
import HU from '../Utils/HTMLUtilities.js';
const {
    stripHTMLTagsFromString: stripHTMLTags,
    addClass,
    removeClass
} = HU;


/* *
 *
 *  Declarations
 *
 * */


declare module '../../Core/Legend/LegendItemObject' {
    interface LegendItemObject {
        a11yProxyElement?: ProxyElement;
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        a11yProxyElement?: ProxyElement;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        a11yProxyElement?: ProxyElement;
    }
}


/* *
 *
 *  Functions
 *
 * */


/* eslint-disable valid-jsdoc */

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


/* *
 *
 *  Class
 *
 * */


/**
 * The LegendComponent class
 *
 * @private
 * @class
 * @name Highcharts.LegendComponent
 */
class LegendComponent extends AccessibilityComponent {


    /* *
     *
     *  Properties
     *
     * */


    public highlightedLegendItemIx: number = NaN;


    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */


    /**
     * Init the component
     * @private
     */
    public init(): void {
        const component = this;
        this.recreateProxies();

        // Note: Chart could create legend dynamically, so events can not be
        // tied to the component's chart's current legend.
        // @todo 1. attach component to created legends
        // @todo 2. move listeners to composition and access `this.component`
        this.addEvent(
            Legend as typeof LegendComponent.LegendComposition,
            'afterScroll',
            function (): void {
                if (this.chart === component.chart) {
                    component.proxyProvider.updateGroupProxyElementPositions('legend');
                    component.updateLegendItemProxyVisibility();
                    if (component.highlightedLegendItemIx > -1) {
                        this.chart.highlightLegendItem(
                            component.highlightedLegendItemIx
                        );
                    }
                }
            }
        );
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
                    (): void => component.proxyProvider
                        .updateGroupProxyElementPositions('legend'),
                    animObject(
                        pick(this.chart.renderer.globalAnimation, true)
                    ).duration
                );
            }
        });
    }


    /**
     * Update visibility of legend items when using paged legend
     * @private
     */
    public updateLegendItemProxyVisibility(): void {
        const chart = this.chart;
        const legend = chart.legend;
        const items = legend.allItems || [];
        const curPage = legend.currentPage || 1;
        const clipHeight = legend.clipHeight || 0;

        items.forEach(function (item: Legend.Item): void {
            if (item.a11yProxyElement) {
                const hasPages = legend.pages && legend.pages.length;
                const proxyEl = item.a11yProxyElement.element;
                let hide = false;

                if (hasPages) {
                    const itemPage = item.pageIx || 0;
                    const y = item._legendItemPos ? item._legendItemPos[1] : 0;
                    const h = item.legendItem ?
                        Math.round(item.legendItem.getBBox().height) :
                        0;
                    hide = y + h - legend.pages[itemPage] > clipHeight ||
                        itemPage !== curPage - 1;
                }

                if (hide) {
                    if (chart.styledMode) {
                        addClass(proxyEl, 'highcharts-a11y-invisible');
                    } else {
                        proxyEl.style.visibility = 'hidden';
                    }
                } else {
                    removeClass(proxyEl, 'highcharts-a11y-invisible');
                    proxyEl.style.visibility = '';
                }
            }
        });
    }


    /**
     * @private
     */
    public onChartRender(): void {
        if (!shouldDoLegendA11y(this.chart)) {
            this.removeProxies();
        }
    }


    /**
     * @private
     */
    public highlightAdjacentLegendPage(direction: number): void {
        const chart = this.chart;
        const legend = chart.legend;
        const curPageIx = legend.currentPage || 1;
        const newPageIx = curPageIx + direction;
        const pages = legend.pages || [];

        if (newPageIx > 0 && newPageIx <= pages.length) {
            const len = legend.allItems.length;
            for (let i = 0; i < len; ++i) {
                if ((legend.allItems[i].pageIx as number) + 1 === newPageIx) {
                    const res = chart.highlightLegendItem(i);
                    if (res) {
                        this.highlightedLegendItemIx = i;
                    }
                    return;
                }
            }
        }
    }


    /**
     * @private
     */
    public updateProxyPositionForItem(
        item: Legend.Item
    ): void {
        if (item.a11yProxyElement) {
            item.a11yProxyElement.refreshPosition();
        }
    }


    /**
     * Returns false if legend a11y is disabled and proxies were not created,
     * true otherwise.
     * @private
     */
    public recreateProxies(): boolean {
        this.removeProxies();

        if (shouldDoLegendA11y(this.chart)) {
            this.addLegendProxyGroup();
            this.proxyLegendItems();
            this.updateLegendItemProxyVisibility();
            this.updateLegendTitle();
            return true;
        }
        return false;
    }


    /**
     * @private
     */
    public removeProxies(): void {
        this.proxyProvider.removeGroup('legend');
    }


    /**
     * @private
     */
    public updateLegendTitle(): void {
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

        this.proxyProvider.updateGroupAttrs('legend', {
            'aria-label': legendLabel
        });
    }


    /**
     * @private
     */
    public addLegendProxyGroup(): void {
        const a11yOptions = this.chart.options.accessibility;
        const groupRole = a11yOptions.landmarkVerbosity === 'all' ? 'region' : null;

        this.proxyProvider.addGroup('legend', 'ul', {
            // Filled by updateLegendTitle, to keep up to date without
            // recreating group
            'aria-label': '_placeholder_',
            role: groupRole as string
        });
    }


    /**
     * @private
     */
    public proxyLegendItems(): void {
        const component = this,
            items = (
                this.chart.legend &&
                this.chart.legend.allItems || []
            );

        items.forEach(function (item: Legend.Item): void {
            if (item.legendItem && item.legendItem.element) {
                component.proxyLegendItem(item);
            }
        });
    }


    /**
     * @private
     * @param {Highcharts.BubbleLegendItem|Point|Highcharts.Series} item
     */
    public proxyLegendItem(
        item: Legend.Item
    ): void {
        if (!item.legendItem || !item.legendGroup) {
            return;
        }

        const itemLabel = this.chart.langFormat(
            'accessibility.legend.legendItem',
            {
                chart: this.chart,
                itemName: stripHTMLTags((item as any).name),
                item
            }
        );
        const attribs = {
            tabindex: -1,
            'aria-pressed': item.visible,
            'aria-label': itemLabel
        };
        // Considers useHTML
        const proxyPositioningElement = item.legendGroup.div ?
            item.legendItem :
            item.legendGroup;

        item.a11yProxyElement = this.proxyProvider.addProxyElement('legend', {
            click: item.legendItem as SVGElement,
            visual: proxyPositioningElement.element
        }, attribs);
    }


    /**
     * Get keyboard navigation handler for this component.
     * @private
     */
    public getKeyboardNavigation(): KeyboardNavigationHandler {
        const keys = this.keyCodes,
            component = this,
            chart = this.chart;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.left, keys.right, keys.up, keys.down],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return component.onKbdArrowKey(this, keyCode);
                    }
                ],
                [
                    [keys.enter, keys.space],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        if (H.isFirefox && keyCode === keys.space) { // #15520
                            return this.response.success;
                        }
                        return component.onKbdClick(this);
                    }
                ],
                [
                    [keys.pageDown, keys.pageUp],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        const direction = keyCode === keys.pageDown ? 1 : -1;
                        component.highlightAdjacentLegendPage(direction);
                        return this.response.success;
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
                component.highlightedLegendItemIx = -1;
                chart.legend.allItems.forEach(
                    (item): unknown => item.setState('', true));
            }
        });
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number}
     * Response code
     */
    public onKbdArrowKey(
        keyboardNavigationHandler: KeyboardNavigationHandler,
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
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @return {number} Response code
     */
    public onKbdClick(
        keyboardNavigationHandler: KeyboardNavigationHandler
    ): number {
        const legendItem: Legend.Item = this.chart.legend.allItems[
            this.highlightedLegendItemIx
        ];

        if (legendItem && legendItem.a11yProxyElement) {
            legendItem.a11yProxyElement.click();
        }

        return keyboardNavigationHandler.response.success;
    }


    /**
     * @private
     */
    public shouldHaveLegendNavigation(): (boolean) {
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
    }


    /**
     * @private
     * @param {number} direction
     */
    public onKbdNavigationInit(
        direction: number
    ): void {
        const chart = this.chart,
            lastIx = chart.legend.allItems.length - 1,
            ixToHighlight = direction > 0 ? 0 : lastIx;

        chart.highlightLegendItem(ixToHighlight);
        this.highlightedLegendItemIx = ixToHighlight;
    }

}


/* *
 *
 *  Class Prototype
 *
 * */


interface LegendComponent {
    chart: LegendComponent.ChartComposition;
}


/* *
 *
 *  Class Namespace
 *
 * */


namespace LegendComponent {


    /* *
     *
     *  Declarations
     *
     * */


    export declare class ChartComposition extends Accessibility.ChartComposition {
        highlightedLegendItemIx?: number;
        /** @requires modules/accessibility */
        highlightLegendItem(ix: number): boolean;
    }

    export declare class LegendComposition extends Legend {
        chart: ChartComposition;
    }


    /* *
     *
     *  Constants
     *
     * */


    const composedClasses: Array<Function> = [];


    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */


    /**
     * Highlight legend item by index.
     * @private
     */
    function chartHighlightLegendItem(
        this: ChartComposition,
        ix: number
    ): boolean {
        const items = this.legend.allItems;
        const oldIx = this.accessibility &&
                this.accessibility.components.legend.highlightedLegendItemIx;
        const itemToHighlight = items[ix];

        if (itemToHighlight) {
            if (isNumber(oldIx) && items[oldIx]) {
                fireEvent((items[oldIx].legendGroup as any).element, 'mouseout');
            }

            scrollLegendToItem(this.legend, ix);

            const legendItemProp = itemToHighlight.legendItem;
            const proxyBtn = itemToHighlight.a11yProxyElement &&
                itemToHighlight.a11yProxyElement.buttonElement;
            if (legendItemProp && legendItemProp.element && proxyBtn) {
                this.setFocusToElement(legendItemProp as SVGElement, proxyBtn);
            }

            if (itemToHighlight.legendGroup) {
                fireEvent(itemToHighlight.legendGroup.element, 'mouseover');
            }
            return true;
        }
        return false;
    }


    /**
     * @private
     */
    export function compose(
        ChartClass: typeof Chart,
        LegendClass: typeof Legend
    ): void {

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            const chartProto = ChartClass.prototype as ChartComposition;

            chartProto.highlightLegendItem = chartHighlightLegendItem;
        }

        if (composedClasses.indexOf(LegendClass) === -1) {
            composedClasses.push(LegendClass);

            addEvent(
                LegendClass as typeof LegendComposition,
                'afterColorizeItem',
                legendOnAfterColorizeItem
            );
        }
    }


    /**
     * Keep track of pressed state for legend items.
     * @private
     */
    function legendOnAfterColorizeItem(
        this: LegendComposition,
        e: {
            item: Legend.Item;
            visible: (boolean|undefined);
        }
    ): void {
        const chart: Accessibility.ChartComposition = this.chart as any,
            a11yOptions = chart.options.accessibility,
            legendItem = e.item;

        if (a11yOptions.enabled && legendItem && legendItem.a11yProxyElement) {
            legendItem.a11yProxyElement.buttonElement.setAttribute(
                'aria-pressed', e.visible ? 'true' : 'false'
            );
        }
    }

}


/* *
 *
 *  Default Export
 *
 * */


export default LegendComponent;
