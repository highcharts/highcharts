/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for chart legend.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';


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
    var items = this.legend.allItems,
        oldIx = this.highlightedLegendItemIx;

    if (items[ix]) {
        if (items[oldIx]) {
            H.fireEvent(
                items[oldIx].legendGroup.element,
                'mouseout'
            );
        }
        // Scroll if we have to
        if (items[ix].pageIx !== undefined &&
            items[ix].pageIx + 1 !== this.legend.currentPage) {
            this.legend.scroll(1 + items[ix].pageIx - this.legend.currentPage);
        }
        // Focus
        this.setFocusToElement(
            items[ix].legendItem, items[ix].a11yProxyElement
        );
        H.fireEvent(items[ix].legendGroup.element, 'mouseover');
        return true;
    }
    return false;
};

// Keep track of pressed state for legend items
H.addEvent(H.Legend, 'afterColorizeItem', function (e) {
    var chart = this.chart,
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
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var LegendComponent = function (chart) {
    this.initBase(chart);
};
LegendComponent.prototype = new AccessibilityComponent();
H.extend(LegendComponent.prototype, /** @lends Highcharts.LegendComponent */ {

    /**
     * The legend needs updates on every render, in order to update positioning
     * of the proxy overlays.
     */
    onChartRender: function () {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility,
            items = chart.legend && chart.legend.allItems,
            component = this;

        // Ignore render after proxy clicked. No need to destroy it, and
        // destroying also kills focus.
        if (component.legendProxyButtonClicked) {
            delete component.legendProxyButtonClicked;
            return;
        }

        // Always Remove group if exists
        this.removeElement(this.legendProxyGroup);

        // Skip everything if we do not have legend items, or if we have a
        // color axis
        if (
            !items || !items.length ||
            chart.colorAxis && chart.colorAxis.length ||
            !chart.options.legend.accessibility.enabled
        ) {
            return;
        }

        // Add proxy group
        this.legendProxyGroup = this.addProxyGroup({
            'aria-label': chart.langFormat(
                'accessibility.legendLabel'
            ),
            'role': a11yOptions.landmarkVerbosity === 'all' ?
                'region' : null
        });

        // Proxy the legend items
        items.forEach(function (item) {
            if (item.legendItem && item.legendItem.element) {
                item.a11yProxyElement = component.createProxyButton(
                    item.legendItem,
                    component.legendProxyGroup,
                    {
                        tabindex: -1,
                        'aria-pressed': !item.visible,
                        'aria-label': chart.langFormat(
                            'accessibility.legendItem',
                            {
                                chart: chart,
                                itemName: component.stripTags(item.name)
                            }
                        )
                    },
                    // Consider useHTML
                    item.legendGroup.div ? item.legendItem : item.legendGroup,
                    // Additional click event (fires first)
                    function () {
                        // Keep track of when we should ignore next render
                        component.legendProxyButtonClicked = true;
                    }
                );
            }
        });
    },


    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function () {
        var keys = this.keyCodes,
            component = this,
            chart = this.chart,
            a11yOptions = chart.options.accessibility;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Arrow key handling
                [[
                    keys.left, keys.right, keys.up, keys.down
                ], function (keyCode) {
                    var direction = (
                        keyCode === keys.left || keyCode === keys.up
                    ) ? -1 : 1;

                    // Try to highlight next/prev legend item
                    var res = chart.highlightLegendItem(
                        component.highlightedLegendItemIx + direction
                    );
                    if (res) {
                        component.highlightedLegendItemIx += direction;
                        return this.response.success;
                    }

                    // Failed, can we wrap around?
                    if (
                        chart.legend.allItems.length > 1 &&
                        a11yOptions.keyboardNavigation.wrapAround
                    ) {
                        // Wrap around if we failed and have more than 1 item
                        this.init(direction);
                        return this.response.success;
                    }

                    // No wrap, move
                    return this.response[direction > 0 ? 'next' : 'prev'];
                }],

                // Click item
                [[
                    keys.enter, keys.space
                ], function () {
                    var legendItem = chart.legend.allItems[
                        component.highlightedLegendItemIx
                    ];
                    if (legendItem && legendItem.a11yProxyElement) {
                        H.fireEvent(legendItem.a11yProxyElement, 'click');
                    }
                    return this.response.success;
                }]
            ],

            // Only run this module if we have at least one legend - wait for
            // it - item. Don't run if the legend is populated by a colorAxis.
            // Don't run if legend navigation is disabled.
            validate: function () {
                var legendOptions = chart.options.legend;
                return chart.legend && chart.legend.allItems &&
                    chart.legend.display &&
                    !(chart.colorAxis && chart.colorAxis.length) &&
                    legendOptions &&
                    legendOptions.accessibility &&
                    legendOptions.accessibility.enabled &&
                    legendOptions.accessibility.keyboardNavigation &&
                    legendOptions.accessibility.keyboardNavigation.enabled;
            },


            // Focus first/last item
            init: function (direction) {
                var ix = direction > 0 ? 0 : chart.legend.allItems.length - 1;
                chart.highlightLegendItem(ix);
                component.highlightedLegendItemIx = ix;
            }
        });
    }

});

export default LegendComponent;
