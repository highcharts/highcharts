/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Accessibility component for chart legend.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
import Legend from '../../Core/Legend.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, extend = U.extend, find = U.find, fireEvent = U.fireEvent;
import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import HTMLUtilities from '../Utils/HTMLUtilities.js';
var stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString, removeElement = HTMLUtilities.removeElement;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function scrollLegendToItem(legend, itemIx) {
    var itemPage = legend.allItems[itemIx].pageIx, curPage = legend.currentPage;
    if (typeof itemPage !== 'undefined' && itemPage + 1 !== curPage) {
        legend.scroll(1 + itemPage - curPage);
    }
}
/**
 * @private
 */
function shouldDoLegendA11y(chart) {
    var items = chart.legend && chart.legend.allItems, legendA11yOptions = (chart.options.legend.accessibility || {});
    return !!(items && items.length &&
        !(chart.colorAxis && chart.colorAxis.length) &&
        legendA11yOptions.enabled !== false);
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
H.Chart.prototype.highlightLegendItem = function (ix) {
    var items = this.legend.allItems, oldIx = this.highlightedLegendItemIx;
    if (items[ix]) {
        if (items[oldIx]) {
            fireEvent(items[oldIx].legendGroup.element, 'mouseout');
        }
        scrollLegendToItem(this.legend, ix);
        this.setFocusToElement(items[ix].legendItem, items[ix].a11yProxyElement);
        fireEvent(items[ix].legendGroup.element, 'mouseover');
        return true;
    }
    return false;
};
// Keep track of pressed state for legend items
addEvent(Legend, 'afterColorizeItem', function (e) {
    var chart = this.chart, a11yOptions = chart.options.accessibility, legendItem = e.item;
    if (a11yOptions.enabled && legendItem && legendItem.a11yProxyElement) {
        legendItem.a11yProxyElement.setAttribute('aria-pressed', e.visible ? 'false' : 'true');
    }
});
/**
 * The LegendComponent class
 *
 * @private
 * @class
 * @name Highcharts.LegendComponent
 */
var LegendComponent = function () { };
LegendComponent.prototype = new AccessibilityComponent();
extend(LegendComponent.prototype, /** @lends Highcharts.LegendComponent */ {
    /**
     * Init the component
     * @private
     */
    init: function () {
        var component = this;
        this.proxyElementsList = [];
        this.recreateProxies();
        // Note: Chart could create legend dynamically, so events can not be
        // tied to the component's chart's current legend.
        this.addEvent(Legend, 'afterScroll', function () {
            if (this.chart === component.chart) {
                component.updateProxiesPositions();
                component.updateLegendItemProxyVisibility();
                this.chart.highlightLegendItem(component.highlightedLegendItemIx);
            }
        });
        this.addEvent(Legend, 'afterPositionItem', function (e) {
            if (this.chart === component.chart && this.chart.renderer) {
                component.updateProxyPositionForItem(e.item);
            }
        });
    },
    /**
     * @private
     */
    updateLegendItemProxyVisibility: function () {
        var legend = this.chart.legend, items = legend.allItems || [], curPage = legend.currentPage || 1, clipHeight = legend.clipHeight || 0;
        items.forEach(function (item) {
            var itemPage = item.pageIx || 0, y = item._legendItemPos ? item._legendItemPos[1] : 0, h = item.legendItem ? Math.round(item.legendItem.getBBox().height) : 0, hide = y + h - legend.pages[itemPage] > clipHeight || itemPage !== curPage - 1;
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
    onChartRender: function () {
        if (shouldDoLegendA11y(this.chart)) {
            this.updateProxiesPositions();
        }
        else {
            this.removeProxies();
        }
    },
    /**
     * @private
     */
    updateProxiesPositions: function () {
        for (var _i = 0, _a = this.proxyElementsList; _i < _a.length; _i++) {
            var _b = _a[_i], element = _b.element, posElement = _b.posElement;
            this.updateProxyButtonPosition(element, posElement);
        }
    },
    /**
     * @private
     */
    updateProxyPositionForItem: function (item) {
        var proxyRef = find(this.proxyElementsList, function (ref) { return ref.item === item; });
        if (proxyRef) {
            this.updateProxyButtonPosition(proxyRef.element, proxyRef.posElement);
        }
    },
    /**
     * @private
     */
    recreateProxies: function () {
        this.removeProxies();
        if (shouldDoLegendA11y(this.chart)) {
            this.addLegendProxyGroup();
            this.proxyLegendItems();
            this.updateLegendItemProxyVisibility();
        }
    },
    /**
     * @private
     */
    removeProxies: function () {
        removeElement(this.legendProxyGroup);
        this.proxyElementsList = [];
    },
    /**
     * @private
     */
    addLegendProxyGroup: function () {
        var a11yOptions = this.chart.options.accessibility, groupLabel = this.chart.langFormat('accessibility.legend.legendLabel', {}), groupRole = a11yOptions.landmarkVerbosity === 'all' ?
            'region' : null;
        this.legendProxyGroup = this.addProxyGroup({
            'aria-label': groupLabel,
            'role': groupRole
        });
    },
    /**
     * @private
     */
    proxyLegendItems: function () {
        var component = this, items = (this.chart.legend &&
            this.chart.legend.allItems || []);
        items.forEach(function (item) {
            if (item.legendItem && item.legendItem.element) {
                component.proxyLegendItem(item);
            }
        });
    },
    /**
     * @private
     * @param {Highcharts.BubbleLegend|Point|Highcharts.Series} item
     */
    proxyLegendItem: function (item) {
        if (!item.legendItem || !item.legendGroup) {
            return;
        }
        var itemLabel = this.chart.langFormat('accessibility.legend.legendItem', {
            chart: this.chart,
            itemName: stripHTMLTags(item.name)
        }), attribs = {
            tabindex: -1,
            'aria-pressed': !item.visible,
            'aria-label': itemLabel
        }, 
        // Considers useHTML
        proxyPositioningElement = item.legendGroup.div ?
            item.legendItem : item.legendGroup;
        item.a11yProxyElement = this.createProxyButton(item.legendItem, this.legendProxyGroup, attribs, proxyPositioningElement);
        this.proxyElementsList.push({
            item: item,
            element: item.a11yProxyElement,
            posElement: proxyPositioningElement
        });
    },
    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function () {
        var keys = this.keyCodes, component = this, chart = this.chart;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [
                    [keys.left, keys.right, keys.up, keys.down],
                    function (keyCode) {
                        return component.onKbdArrowKey(this, keyCode);
                    }
                ],
                [
                    [keys.enter, keys.space],
                    function () {
                        return component.onKbdClick(this);
                    }
                ]
            ],
            validate: function () {
                return component.shouldHaveLegendNavigation();
            },
            init: function (direction) {
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
    onKbdArrowKey: function (keyboardNavigationHandler, keyCode) {
        var keys = this.keyCodes, response = keyboardNavigationHandler.response, chart = this.chart, a11yOptions = chart.options.accessibility, numItems = chart.legend.allItems.length, direction = (keyCode === keys.left || keyCode === keys.up) ? -1 : 1;
        var res = chart.highlightLegendItem(this.highlightedLegendItemIx + direction);
        if (res) {
            this.highlightedLegendItemIx += direction;
            return response.success;
        }
        if (numItems > 1 &&
            a11yOptions.keyboardNavigation.wrapAround) {
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
    onKbdClick: function (keyboardNavigationHandler) {
        var legendItem = this.chart.legend.allItems[this.highlightedLegendItemIx];
        if (legendItem && legendItem.a11yProxyElement) {
            fireEvent(legendItem.a11yProxyElement, 'click');
        }
        return keyboardNavigationHandler.response.success;
    },
    /**
     * @private
     * @return {boolean|undefined}
     */
    shouldHaveLegendNavigation: function () {
        var chart = this.chart, legendOptions = chart.options.legend || {}, hasLegend = chart.legend && chart.legend.allItems, hasColorAxis = chart.colorAxis && chart.colorAxis.length, legendA11yOptions = (legendOptions.accessibility || {});
        return !!(hasLegend &&
            chart.legend.display &&
            !hasColorAxis &&
            legendA11yOptions.enabled &&
            legendA11yOptions.keyboardNavigation &&
            legendA11yOptions.keyboardNavigation.enabled);
    },
    /**
     * @private
     * @param {number} direction
     */
    onKbdNavigationInit: function (direction) {
        var chart = this.chart, lastIx = chart.legend.allItems.length - 1, ixToHighlight = direction > 0 ? 0 : lastIx;
        chart.highlightLegendItem(ixToHighlight);
        this.highlightedLegendItemIx = ixToHighlight;
    }
});
export default LegendComponent;
