/* *
 *
 *  (c) 2009-2019 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
/*
 * Highcharts module that introduces multiple legends and sublegends.
 *
 * TODO:
 * - allow referring the legend by index
 *
 */
import U from '../parts/Utilities.js';
var defined = U.defined, pick = U.pick, extend = U.extend;
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Legend.js';
var marginNames = H.marginNames, addEvent = H.addEvent, wrap = H.wrap, fireEvent = H.fireEvent, merge = H.merge;
/* eslint-disable no-invalid-this, valid-jsdoc, no-undefined */
/**
 * Utility function for checking if the Advanced Module should kick in.
 *
 * @private
 * @function Highcharts.Chart#isAdvancedLegendEnabled
 * @return {boolean}
 */
H.Chart.prototype.isAdvancedLegendEnabled =
    function () {
        return Array.isArray(this.options.legend);
    };
/**
 * Extended version of Highcharts.Legend. It's used by Advanced Legend Module
 * to handle multiple legends in one chart. Advanced legend can also contain
 * another AdvancedLegend object (called sublegend) which acts as a legend item.
 * All legends are managed by Legend.Adapter class. Individual legends can be
 * found in `chart.legend` array.
 *
 * @class
 * @name Highcharts.AdvancedLegend
 * @augments Highcharts.Legend
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @param {Highcharts.LegendOptions} options
 *        Advanced Legend options.
 *
 * @param {Highcharts.AdvancedLegend} parentLegend
 *
 */
H.AdvancedLegend = function (chart, options, parentLegend) {
    this.id = options.id;
    this.coll = 'legend';
    this.legend = parentLegend;
    this.init(chart, merge(H.defaultOptions.legend, options));
    return this;
};
// Advanced legend class is based on a standard legend.
// Advanced legend can work either as a sublegend or as highest-level
// (parent) legend.
H.extend(H.AdvancedLegend.prototype, H.Legend.prototype);
H.extend(H.AdvancedLegend.prototype, {
    /**
     * An id of the legend. It's used by objects renderable
     * as legend items (series, color axes, bubble legend or another
     * advanced legend) to indicate in which legend (or sublegend)
     * they should be rendered in.
     *
     * @since        8.0.0
     * @requires     highcharts-more
     * @requires     modules/heatmap
     * @requires     modules/advanced-legend
     * @type      {string}
     * @apioption legend.id
     */
    /**
     * An array of sublegends. Every legend have any number of
     * sublegends. Sublegends are advanced legend objects.
     *
     * @since        8.0.0
     * @requires     highcharts-more
     * @requires     modules/heatmap
     * @requires     modules/advanced-legend
     * @type      {Array<Highcharts.AdvancedLegend>}
     * @apioption legend.sublegends
     */
    // not used by AdvancedLegend
    drawLineMarker: H.noop,
    drawRectangle: H.noop,
    /**
     * Overwrite getAllItems fucntion form `Legend.prototype`. In Advanced
     * Legend Module every class renderable in legend (e.g. Point, Series,
     * BubbleLegend) has legendId property which points to its target
     * legend.
     * Fires the event `afterGetAllItems`.
     *
     * @private
     * @function Highcharts.AdvancedLegend#getAllItems
     * @return {Array<Highcharts.AdvancedLegendItem>}
     *         The current items in the legend.
     * @fires Highcharts.AdvancedLegend#event:afterGetAllItems
     */
    getAllItems: function () {
        var allItems = [];
        this.chart.series.forEach(function (series) {
            if (this.options.id === series.legendId) {
                allItems = allItems.concat(this.getSeriesItems(series));
            }
        }, this);
        fireEvent(this, 'afterGetAllItems', { allItems: allItems });
        return allItems;
    },
    /**
     * This method creates sublegends (which are AdvancedLegend objects) and
     * provides them with logic for their further management as legend items.
     *
     * @private
     * @function Highcharts.AdvancedLegend#renderSublegends
     * @return {Array<Highcharts.AdvancedLegend>}
     */
    renderSublegends: function () {
        var options = this.options;
        this.sublegends = [];
        options.sublegends
            .filter(function (sublegendOptions) {
            // Don't create sublegends without ids.
            return defined(sublegendOptions.id);
        }).forEach(function (sublegendOptions) {
            var item;
            item = new H.AdvancedLegend(this.chart, sublegendOptions, this); // render a sublegend
            if (this.sublegends) {
                this.sublegends.push(item);
            }
        }, this);
        return this.sublegends;
    },
    /**
     * Advanced legend object can be rendered as legend item as well -
     * it is called sublegend then.
     *
     * @private
     * @function Highcharts.AdvancedLegend#renderAsLegendItem
     * @return {void}
     */
    renderAsLegendItem: function () {
        var itemDistance = this.legend
            .options.layout === 'horizontal' ?
            pick(this.legend.options.itemDistance, 20) : 0;
        this.legendItem = this;
        // Sublegend's group is the same thing as item's legend.
        this.legendGroup = this.group;
        this.setState = H.noop;
        this.itemWidth = this.legendWidth + itemDistance;
        this.legend.maxItemWidth =
            Math.max(this.legend.maxItemWidth, this.itemWidth);
        this.legend.totalItemWidth += this.itemWidth;
        this.legend.itemHeight = this.itemHeight =
            Math.round(this.legendHeight);
        this.marginTop = pick(this.legend.itemMarginTop, 10);
    },
    /**
     * When sublegend is renderd it has to be added to its
     * parent's `scrollGroup`.
     *
     * @private
     * @function Highcharts.AdvancedLegend#renderLegendGroup
     * @return {void}
     */
    renderLegendGroup: function () {
        var renderer = this.chart.renderer;
        if (!this.group) {
            this.group = renderer.g('legend')
                .attr({ zIndex: 7 })
                .add(this.legend ? this.legend.scrollGroup : undefined);
            this.contentGroup = renderer.g()
                .attr({ zIndex: 1 }) // above background
                .add(this.group);
            this.scrollGroup = renderer.g()
                .add(this.contentGroup);
        }
    },
    /**
     * Utility method used for layouting sublegends.
     *
     * @private
     * @function Highcharts.AdvancedLegend#getBBox
     * @return {void}
     */
    getBBox: function () {
        return this.group.getBBox();
    },
    /**
     * Remove the legend from chart.
     *
     * @private
     * @function Highcharts.AdvancedLegend#remove
     * @return {void}
     */
    remove: function () {
        this.destroy();
        H.erase(this.chart.legend, this);
        this.chart.isDirtyLegend = this.chart.isDirtyBox = true;
        this.chart.redraw();
    },
    /**
     * Override the method from Highcharts.Legend prototype.
     * Add support for scrilling items higher than legend.
     *
     * @private
     * @function Highcharts.AdvancedLegend#createPages
     * @return {void}
     */
    createPages: function (clipHeight) {
        var pageH, allItems = this.allItems, pages = this.pages;
        allItems.forEach(function (item, i) {
            // -1 prevents clipping default legend symbol
            var y = item._legendItemPos[1] - 1, h = item.legendItem ?
                Math.round(item.legendItem.getBBox().height) :
                0;
            // At least one page is required.
            if (!pages.length) {
                pages.push(y);
            }
            if (pageH + h < clipHeight) {
                // Item placed within page without overflowing.
                pageH += h;
                return; // Finish this iteration.
            }
            if (y !== pages[pages.length - 1]) {
                // Create a new page.
                pages.push(y);
                pageH = 0;
            }
            while (h > 0) {
                // Should the item (or its part - in case of items higher than
                // clipHeight) start a new page?
                if (h > clipHeight) {
                    pages.push(pages[pages.length - 1] + clipHeight);
                    h -= clipHeight; // h is being constantly decreased
                    // in order to to determine the amount of pages needed
                    // for a single item.
                }
                else {
                    h = 0;
                }
            }
        });
    },
    /**
     * Override the method from Highcharts.Legend prototype.
     *
     * @private
     * @function Highcharts.AdvancedLegend#remove
     * @return {void}
     */
    align: function () {
        if (!this.legend) {
            // Sublegends shouldn't be aligned to the chart box.
            Highcharts.Legend.prototype.align.call(this);
        }
    },
    /**
     * Override the method from Highcharts.Legend prototype.
     *
     * @private
     * @function Highcharts.AdvancedLegend#getAllowedWidth
     * @return {number}
     */
    // Sublegend's allowed with is based on its parent allowed with.
    getAllowedWidth: function () {
        var parentLegend = this.legend;
        if (!this.legend) {
            return Highcharts.Legend.prototype.getAllowedWidth.call(this);
        }
        return parentLegend.maxLegendWidth - parentLegend.padding * 2;
    }
});
/**
 * Class that works as an iplamentation of the adapter desing pattern.
 * It is responsible for taking over all calls to methods of `chart.legend`
 * object and executing them on their desitnation legends.
 *
 * @class
 * @private
 * @name Highcharts.LegendAdapter
 *
 * @param {Highcharts.AdvancedLegendChart} chart
 *        The chart instance.
 *
 * @param {Highcharts.LegendOptions} commonLegendOptions
 *        Default options for all legend and sublegends
 *        (works just like plotOptions for series).
 */
H.LegendAdapter = function (chart, commonLegendOptions) {
    this.chart = chart;
    this.options = commonLegendOptions;
    this.legends = chart.legend;
    this.display = true;
    return this;
};
extend(H.LegendAdapter.prototype, {
    adjustMargins: function (margin, spacing) {
        var chart = this.chart, titleMarginOption, titleMargin, titleMarginBottom;
        if (chart.options.title) {
            titleMarginOption = chart.options.title.margin;
        }
        titleMargin = titleMarginOption !== undefined ?
            chart.titleOffset[0] + titleMarginOption :
            0;
        titleMarginBottom = titleMarginOption !== undefined ?
            chart.titleOffset[2] + titleMarginOption :
            0;
        this.legends.forEach(function (legend) {
            var options = legend.options, alignment = legend.getAlignment(), marginValue;
            if (alignment && options.enabled) { //  move options.enabled higher
                ([
                    /(lth|ct|rth)/,
                    /(rtv|rm|rbv)/,
                    /(rbh|cb|lbh)/,
                    /(lbv|lm|ltv)/
                ]).forEach(function (alignments, side) {
                    if (alignments.test(alignment) && !defined(margin[side])) {
                        // Now we have detected on which side of the
                        // chart we should reserve space for the legend
                        marginValue = Math.max(chart[marginNames[side]], (legend[(side + 1) % 2 ?
                            'legendHeight' : 'legendWidth'] +
                            [1, -1, -1, 1][side] * legend[(side % 2) ? 'xOption' : 'yOption'] +
                            pick(options.margin, 12) +
                            spacing[side] +
                            (side === 0 &&
                                (chart.titleOffset[0] === 0 ?
                                    0 : titleMargin)) + // #7428, #7894
                            (side === 2 &&
                                (chart.titleOffset[2] === 0 ?
                                    0 : titleMarginBottom))));
                        chart[marginNames[side]] = marginValue;
                    }
                });
            }
        }, this);
    },
    colorizeItem: function (item, visible) {
        this.legends.forEach(function (legend) {
            legend.colorizeItem(item, visible);
        });
    },
    destroyItem: function (item) {
        this.legends.forEach(function (legend) {
            legend.destroyItem(item);
        });
    },
    // TODO: it doesn't work for now.
    // A workaround utilizes `labelFormat` option:
    // http://jsfiddle.net/BlackLabel/scmxq0tz/
    positionCheckboxes: function () {
        this.legends.forEach(function (legend) {
            legend.positionCheckboxes();
        });
    },
    positionItems: function () {
        this.legends.forEach(function (legend) {
            if (legend.proximate) {
                legend.positionItems();
            }
        });
    },
    proximatePositions: function () {
        this.legends.forEach(function (legend) {
            if (legend.proximate) {
                legend.proximatePositions();
            }
        });
    },
    render: function () {
        this.legends.forEach(function (legend) {
            if (legend.options.enabled) {
                legend.render();
            }
        });
    },
    update: function (options, redraw) {
        this.legends.forEach(function (legend) {
            legend.update(merge(true, options, legend.options), redraw);
        });
    }
});
wrap(H.Chart.prototype, 'renderLegend', function (originalFunc) {
    if (!this.isAdvancedLegendEnabled()) {
        originalFunc.call(this);
        return;
    }
    // Create multiple legends.
    this.legend = [];
    this.options
        .legend.forEach(function (legendOptions, index) {
        legendOptions.index = index;
        this.legend.push(new H.AdvancedLegend(this, legendOptions));
    }, this);
    this.legendAdapter =
        new H.LegendAdapter(this, merge(H.defaultOptions.legend));
    // Legend array works as a legend adapter
    extend(this.legend, this.legendAdapter);
    // Add legends array to updatable collections.
    this.collectionsWithUpdate.push('legend');
});
/**
 * Add a new legend to chart.
 *
 * @private
 * @function Highcharts.Chart.addLegend
 * @param {Highcharts.AdvancedLegendOptions} options
 * @return {void}
 */
H.Chart.prototype.addLegend = function (options) {
    this.legend.push(new H.AdvancedLegend(this, merge(H.defaultOptions.legend, options)));
    this.isDirtyLegend = this.isDirtyBox = true;
    this.redraw();
};
/**
 * @private
 * @mixin Highcharts.LegendItemMixin
 */
H.LegendItemMixin =
    function () {
        return this;
    };
/**
 * Get the options of the legend where the item should be rendered.
 *
 * @private
 * @function Highcharts.LegendItemMixin.findTargetLegendOptions
 *
 * @return {Highcharts.AdvancedLegendOptions}
 */
H.LegendItemMixin.prototype.findTargetLegendOptions =
    function (item) {
        var id = item.legendId =
            // Get legend id from user options.
            item.userOptions ?
                item.userOptions.legend :
                // Use options if user options don't specify
                // the legend id.
                (item.options ? item
                    .options.legend : undefined), allLegendsOptions = item.chart.options.legend, legendOptions, sublegends, targetLegendOptions;
        if (allLegendsOptions) {
            for (var i = 0; i < allLegendsOptions.length; i++) {
                legendOptions = allLegendsOptions[i];
                sublegends = legendOptions.sublegends;
                if (legendOptions.id === id) {
                    targetLegendOptions = legendOptions;
                    break;
                }
                else if (sublegends && sublegends.length > 0) {
                    for (var j = 0; j < sublegends.length; j++) {
                        if (sublegends[j].id === id) {
                            targetLegendOptions = sublegends[j];
                            break;
                        }
                    }
                }
            }
            // The default legend is the first one.
            if (!defined(id) && !targetLegendOptions &&
                allLegendsOptions.length > 0) {
                targetLegendOptions = allLegendsOptions[0];
            }
        }
        return targetLegendOptions;
    };
/**
 * Add `legendOptions` property to legend item object or
 * throw an error if target legend was not found.
 *
 * @private
 * @function Highcharts.LegendItemMixin.setTargetLegendOptions
 *
 * @return {Highcharts.AdvancedLegendOptions}
*/
H.LegendItemMixin.prototype.setTargetLegendOptions =
    function (item) {
        if (item.chart && item.chart.isAdvancedLegendEnabled()) {
            var options = H.LegendItemMixin.prototype.findTargetLegendOptions(item);
            if (!options && defined(item.legendId)) {
                // Options for legend not found although they're expected
                H.error(32, false, item.chart);
            }
            else {
                item.parentLegendOptions =
                    options;
            }
        }
    };
/**
 * The id of a legend where the series should be rendred.
 * The default legend is the first one that appears in
 * chart's options.
 *
 * @type      {string}
 * @apioption plotOptions.series.legendId
 */
// Provide the series with information about its target legend.
H.extend(H.Series.prototype, H.LegendItemMixin);
addEvent(H.Series, 'afterSetOptions', function () {
    H.LegendItemMixin.prototype.setTargetLegendOptions(this);
});
addEvent(H.AdvancedLegend.prototype, 'beforeRender', function () {
    // Always render sublegends from scratch.
    if (this.sublegends) {
        this.sublegends.forEach(function (sublegend) {
            sublegend.destroy();
        });
    }
    this.sublegends = [];
});
addEvent(H.AdvancedLegend.prototype, 'afterSetOptions', function () {
    var parentLegend = this.legend, options = this.options;
    // Alter bBox options for sublegend using
    // parent legend (not the whole chart box)
    // as a baseline.
    if (parentLegend) {
        if (parentLegend.widthOption) {
            this.widthOption = H.relativeLength(options.width, parentLegend.widthOption) - parentLegend.padding * 2;
        }
        if (parentLegend.heightOption) {
            this.heightOption = H.relativeLength(options.width, parentLegend.heightOption) - parentLegend.padding * 2;
        }
    }
});
addEvent(H.AdvancedLegend.prototype, 'afterGetAllItems', function (e) {
    var legend = this;
    if (legend.options.sublegends) {
        legend.renderSublegends().forEach(function (sublegend) {
            e.allItems.push(sublegend);
        });
    }
});
// COLOR AXIS INTERGRATION:
if (H.ColorAxis) {
    /**
     * The id of a legend where the color axis should be rendred.
     * The default legend is the first one that appears in chart's options.
     *
     * @type      {string}
     * @apioption colorAxis.legendId
     */
    // Provide the color axis with information about its target legend.
    H.extend(H.ColorAxis.prototype, H.LegendItemMixin);
    addEvent(H.ColorAxis.prototype, 'beforeBuildOptions', function () {
        H.LegendItemMixin.prototype.setTargetLegendOptions(this);
    });
    // Find out if there's a targed legend for color axis.
    wrap(H.ColorAxis.prototype, 'shouldBeRendered', function (originalFunc, legend) {
        if (this.chart && !this.chart.isAdvancedLegendEnabled()) {
            return originalFunc.call(this, legend);
        }
        var options = this.options;
        return (options && options.showInLegend &&
            this.parentLegendOptions &&
            legend && legend.options &&
            (this.parentLegendOptions.id === legend.options.id));
    });
}
// BUBBLE LEGEND INTERGRATION:
if (H.BubbleLegend) {
    // Provide the bubble legend with information about its target legend.
    H.extend(H.BubbleLegend.prototype, H.LegendItemMixin);
    addEvent(H.BubbleLegend, 'afterSetOptions', function () {
        H.LegendItemMixin.prototype.setTargetLegendOptions(this);
    });
    wrap(H.Chart.prototype, 'getLegendForBubbleLegend', function (originalFunc) {
        if (!this.isAdvancedLegendEnabled()) {
            return originalFunc.call(this);
        }
        return H.find(this.legend, function (legend) {
            // Only one bubble legend per chart is supported for now -
            // return its first occurence in options.
            return !!legend.bubbleLegend;
        });
    });
    wrap(H.Chart.prototype, 'redrawLegend', function (originalFunc) {
        if (!this.isAdvancedLegendEnabled()) {
            return originalFunc.call(this);
        }
        this.legendAdapter.render();
        this.isDirtyLegend = false;
    });
}
