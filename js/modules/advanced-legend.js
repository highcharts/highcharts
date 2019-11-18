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
 * - add docs for `legend` options in series, bubble legend and color
 *   axis options
 * - add support for multiple bubble legends in one chart
 * - create demos for options
 * - allow to import advanced legend module without loading
 *   coloraxis and bubble legend modules beforehand
 * - allow referring the legend by index
 *
 */
import U from '../parts/Utilities.js';
var defined = U.defined, pick = U.pick, extend = U.extend;
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Legend.js';
var marginNames = H.marginNames, addEvent = H.addEvent, wrap = H.wrap, fireEvent = H.fireEvent;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Utility function for checking if the Advanced Module should kick in.
 *
 * @private
 * @function Highcharts.Chart#isAdvancedLegendEnabled
 * @return {boolean}
 */
H.Chart.prototype.isAdvancedLegendEnabled =
    function () {
        return (!!this.options.legends);
    };
/**
 * Extended version of Highcharts.Legend. It's used by Advanced Legend Module
 * to handle multiple legends in one chart. Advanced legend can also contain
 * another AdvancedLegend object (called sublegend) which acts as a legend item.
 * All legends are managed by Legend.Adapter class. Individual legends can be
 * found in `chart.legends` array.
 *
 * @class
 * @name Highcharts.AdvancedLegend
 *
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
    this.id = options.id; // for debugging puposes
    this.legend = parentLegend; // TODO: refactor to this.parentLegend
    // chart.legend servers as default options for all legends and sublegends.
    this.init(chart, H.merge(chart.options.legend, options));
    return this;
};
// Advanced legend class is based on a standard legend.
// Advanced legend can work either as a sublegend or as highest-level
// (parent) legend.
H.extend(H.AdvancedLegend.prototype, H.Legend.prototype);
H.extend(H.AdvancedLegend.prototype, {
    /**
     * An array of advanced legends.
     * The options are almost the same as for a regular
     * [Legend](/class-reference/Highcharts.Legend) object.
     * Two more properties were added: `id` & `sublegends`.
     * When `legends` array is defined then `legend` options
     * work as default options for all legends and sublegends.
     *
     * @sample highcharts/advanced-legend/basic/
     *         Multiple legends with sublegends
     * @sample highcharts/advanced-legend/rich/
     *         Multiple legends with sublegends, color axes and bubble legend
     *
     * @type         {Array<*>}
     * @since        8.0.0
     * @requires     modules/highcharts-more
     * @requires     modules/heatmap
     * @requires     modules/advanced-legend
     * @optionparent legends
     */
    /**
     * An id of the legend. It's used by objects renderable
     * as legend items (series, color axes, bubble legend or another
     * advanced legend) to indicate in which legend (or sublegend)
     * they should be rendered in.
     *
     * @type      {string}
     * @apioption legends.id
     */
    /**
     * An array of sublegends. Every legend have any number of
     * sublegends. Sublegends are advanced legend objects.
     *
     * @type      {Array<Highcharts.AdvancedLegend>}
     * @apioption legends.sublegends
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
            var seriesOptions = series && series.options, legendOptions;
            // Handle showInLegend. If the series is linked to another series,
            // defaults to false.
            if (series && pick(seriesOptions.showInLegend, !defined(seriesOptions.linkedTo) ? undefined : false, true)) {
                legendOptions = series.parentLegendOptions;
                if (legendOptions && this.options.id === legendOptions.id) {
                    // Use points or series for the legend item depending on
                    // legendType
                    // TODO: below logic is copied form Legend.ts file -
                    // move it to a separate function and override it in
                    // advanced legend module.
                    allItems = allItems.concat(series.legendItems ||
                        (seriesOptions.legendType === 'point' ?
                            series.data :
                            series));
                }
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
        // TODO: this two lines of code will probably cause failure
        // during the update. Handle this scenario.
        this.legendItem = this;
        // Sublegend's group is the same thing item's legend too.
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
     * Override the default legend's method. Advanced legend can act as a
     * legedn item (sublegend) thus positionItem method has to be equiped with
     * knowledge of how to position sublegends.
     *
     * @private
     * @function Highcharts.AdvancedLegend#positionItem
     * @param {Highcharts.AdvancedLegendItem} item
     *        The item to position
     * @return {void}
     */
    positionItem: function (item) {
        var legend = this, options = legend.options, symbolPadding = options.symbolPadding, ltr = !options.rtl, legendItemPos = item._legendItemPos, itemX = legendItemPos[0], itemY = legendItemPos[1], checkbox = item.checkbox, legendGroup = item.legendGroup, sublegend;
        // Positioning of a sublegend
        if (legendGroup && legendGroup.element) { // item is sublegend?
            // TODO: replace all below sublegend references with
            // properties of AdvancedLegendItem.
            sublegend = item;
            legendGroup[defined(legendGroup.translateY) ? 'animate' : 'attr']({
                translateX: ltr ?
                    itemX :
                    legend.legendWidth - itemX - (sublegend.allItems ?
                        sublegend.legendWidth : 2 * symbolPadding + 4),
                translateY: itemY
            });
        }
        if (checkbox) {
            checkbox.x = itemX;
            checkbox.y = itemY;
        }
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
    }
});
// Sublegends shouldn't be aligned to chart box.
wrap(H.AdvancedLegend.prototype, 'align', function (originalFunc) {
    if (!this.legend) {
        originalFunc.call(this);
    }
});
// Sublegend's allowed with is based on its parent allowed with.
wrap(H.AdvancedLegend.prototype, 'getAllowedWidth', function (originalFunc) {
    var parentLegend = this.legend;
    if (!this.legend) {
        return originalFunc.call(this);
    }
    return parentLegend.maxLegendWidth - parentLegend.padding * 2;
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
    this.legends = chart.legends;
    this.display = true;
    return this;
};
extend(H.LegendAdapter.prototype, {
    adjustMargins: function (margin, spacing) {
        this.legends.forEach(function (legend) {
            // TODO: title handling shouldn't be inside forEach
            var chart = this.chart, options = legend.options, alignment = legend.getAlignment(), value, titleMarginOption, titleMargin, titleMarginBottom;
            if (chart.options.title) {
                titleMarginOption = chart.options.title.margin;
            }
            titleMargin = titleMarginOption !== undefined ?
                chart.titleOffset[0] + titleMarginOption :
                0;
            titleMarginBottom = titleMarginOption !== undefined ?
                chart.titleOffset[2] + titleMarginOption :
                0;
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
                        value = Math.max(chart[marginNames[side]], (legend[(side + 1) % 2 ?
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
                        chart[marginNames[side]] = value;
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
    }
});
wrap(H.Chart.prototype, 'renderLegend', function (originalFunc) {
    if (!this.isAdvancedLegendEnabled()) {
        originalFunc.call(this);
        return;
    }
    // Create multiple legends.
    this.legends = [];
    this.options
        .legends.forEach(function (legendOptions, index) {
        legendOptions.index = index;
        // options.legend provides base options for all legends
        this.legends.push(new H.AdvancedLegend(this, legendOptions));
    }, this);
    this.legend = new H.LegendAdapter(this, this.options.legend);
});
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
        // TODO: refactor this enigmatic piece of code.
        var id = item.legendId =
            item.userOptions ?
                item.userOptions.legend :
                (item.options ? item
                    .options.legend : undefined), allLegendsOptions = item.chart.options.legends, legendOptions, sublegends, targetLegendOptions;
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
// BUBBLE LEGEND INTERGRATION:
// Provide the bubble legend with information about its target legend.
H.extend(H.BubbleLegend.prototype, H.LegendItemMixin);
addEvent(H.BubbleLegend, 'afterSetOptions', function () {
    H.LegendItemMixin.prototype.setTargetLegendOptions(this);
});
// Overwrite the method defined in Bubble Legend module.
wrap(H.Chart.prototype, 'getLegendForBubbleLegend', function (originalFunc) {
    if (!this.isAdvancedLegendEnabled()) {
        return originalFunc.call(this);
    }
    return this.legends
        .find(function (legend) {
        // Only one bubble legend per chart is supported for now -
        // return its first occurence in options.
        return legend.bubbleLegend;
    });
});
// COLOR AXIS INTERGRATION:
// Provide the color axis with information about its target legend.
H.extend(H.ColorAxis.prototype, H.LegendItemMixin);
addEvent(H.ColorAxis, 'beforeBuildOptions', function () {
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
