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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {

        interface AdvancedLegendItem extends LegendItemObject{
            parentLegendOptions: AdvancedLegendItemOptions;
            options: any;
            legendId?: string;
            chart: Chart;
        }

        interface AdvancedLegendItemOptions {
            legend?: string;
            id?: string;
        }

        class AdvancedLegend extends Legend implements AdvancedLegendItem {
            public coll: string;
            public chart: AdvancedLegendChart;
            public id?: string;
            public itemWidth: number;
            public marginTop: number;
            public legend: AdvancedLegend;
            public legendGroup: SVGElement;
            public legendItem: SVGElement;
            public parentLegendOptions: AdvancedLegendOptions;
            public options: AdvancedLegendOptions;
            public sublegends?: Array<AdvancedLegend>;
            public constructor(
                chart: AdvancedLegendChart,
                options: LegendOptions,
                parentLegend?: Legend);
            public drawLineMarker(): void; // Not used but has
            // to be implemented by the interface.
            public drawRectangle(): void; // as above
            public renderAsLegendItem(): void;
            public renderSublegends(): Array<AdvancedLegend>;
            public setState: Function;
        }

        interface Series extends AdvancedLegendItem {
        }

        interface Point extends AdvancedLegendItem {
        }

        interface ColorAxis extends AdvancedLegendItem {
        }

        interface BubbleLegend extends AdvancedLegendItem {
        }

        interface AdvancedLegendOptions extends LegendOptions {
            index?: number;
            id: string;
            sublegends?: Array<AdvancedLegendItemOptions>;
        }

        interface Chart {
            isAdvancedLegendEnabled(): boolean;
            addLegend(options: AdvancedLegendOptions): void;
        }

        interface AdvancedLegendChart extends Chart {
            legend: LegendAdapter;
            legends: Array<AdvancedLegend>;
        }

        class LegendAdapter extends Legend {

            public chart: AdvancedLegendChart;
            public legends: Array<AdvancedLegend>;
            public options: LegendOptions;
            public constructor(chart: AdvancedLegendChart,
                commonLegendOptions?: LegendOptions);
        }

        interface AdvancedLegendChartOptions extends ChartOptions{
            legends: Array<AdvancedLegendOptions>;
        }

        class LegendItemMixin {
            public findTargetLegendOptions(item: AdvancedLegendItem):
            (AdvancedLegendOptions | undefined)
            public setTargetLegendOptions(item: AdvancedLegendItem): void;
        }
    }
}


/*
 * Highcharts module that introduces multiple legends and sublegends.
 *
 * TODO:
 * - allow to import advanced legend module without loading
 *   coloraxis and bubble legend modules beforehand
 * - allow referring the legend by index
 *
 */

import U from '../parts/Utilities.js';
const {
    defined,
    pick,
    extend
} = U;

import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Legend.js';

var marginNames = H.marginNames,
    addEvent = H.addEvent,
    wrap = H.wrap,
    fireEvent = H.fireEvent;


/* eslint-disable no-invalid-this, valid-jsdoc, no-undefined */

/**
 * Utility function for checking if the Advanced Module should kick in.
 *
 * @private
 * @function Highcharts.Chart#isAdvancedLegendEnabled
 * @return {boolean}
 */
H.Chart.prototype.isAdvancedLegendEnabled =
    function (this: Highcharts.Chart): boolean {
        return (
            !!(this.options as any).legends
        );
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
H.AdvancedLegend = function (
    this: Highcharts.AdvancedLegend,
    chart: Highcharts.AdvancedLegendChart,
    options: Highcharts.LegendOptions,
    parentLegend: Highcharts.AdvancedLegend
): Highcharts.AdvancedLegend {
    this.id = options.id;
    this.coll = 'legends';
    this.legend = parentLegend; // TODO: refactor to this.parentLegend
    // chart.legend servers as default options for all legends and sublegends.
    this.init(chart, H.merge(chart.options.legend, options));
    return this;
} as any;

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
     * @since        8.0.0
     * @requires     highcharts-more
     * @requires     modules/heatmap
     * @requires     modules/advanced-legend
     * @extends      legend
     * @product      highcharts highstock highmaps
     * @type         {Array<*>}
     * @optionparent   legends
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

    getAllItems: function (
        this: Highcharts.AdvancedLegend
    ): Array<Highcharts.AdvancedLegendItem> {
        var allItems: Array<Highcharts.AdvancedLegendItem> = [];

        this.chart.series.forEach(function (
            series: Highcharts.Series
        ): void {
            var legendOptions = series.parentLegendOptions;

            if (legendOptions && this.options.id === legendOptions.id) {
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
    renderSublegends: function (this: Highcharts.AdvancedLegend):
    Array<Highcharts.AdvancedLegend> {
        var options: Highcharts.AdvancedLegendOptions = this.options;

        this.sublegends = [];
        (options.sublegends as
            Array<Highcharts.AdvancedLegendOptions>)
            .filter(function (sublegendOptions): boolean {
                // Don't create sublegends without ids.
                return defined(sublegendOptions.id);
            }).forEach(function (sublegendOptions): void {

                var item: Highcharts.AdvancedLegend;

                item = new H.AdvancedLegend(
                    this.chart as Highcharts.AdvancedLegendChart,
                    sublegendOptions, this); // render a sublegend

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
    renderAsLegendItem: function (this: Highcharts.AdvancedLegend): void {
        var itemDistance = (this.legend as Highcharts.AdvancedLegend)
            .options.layout === 'horizontal' ?
            pick(this.legend.options.itemDistance, 20) : 0;

        this.legendItem = this as any;

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
    renderLegendGroup: function (this: Highcharts.AdvancedLegend): void {
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
    getBBox: function (this: Highcharts.AdvancedLegend): {
        width: number;
        height: number;
        x: number;
        y: number;
    } {
        return this.group.getBBox();
    },

    /**
     * Remove the legend from chart.
     *
     * @private
     * @function Highcharts.AdvancedLegend#remove
     * @return {void}
     */
    remove: function (this: Highcharts.AdvancedLegend): void {
        this.destroy();
        H.erase(this.chart.legends, this);
        this.chart.isDirtyLegend = this.chart.isDirtyBox = true;
        this.chart.redraw();
    }
}) as any;

// Sublegends shouldn't be aligned to chart box.
wrap(H.AdvancedLegend.prototype, 'align', function (
    this: Highcharts.AdvancedLegend,
    originalFunc): void {
    if (!this.legend) {
        originalFunc.call(this);
    }
});

// Sublegend's allowed with is based on its parent allowed with.
wrap(H.AdvancedLegend.prototype, 'getAllowedWidth', function (
    this: Highcharts.AdvancedLegend,
    originalFunc): number {
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

H.LegendAdapter = function (
    this: Highcharts.LegendAdapter,
    chart: Highcharts.AdvancedLegendChart,
    commonLegendOptions: Highcharts.LegendOptions
): Highcharts.LegendAdapter {
    this.chart = chart;
    this.options = commonLegendOptions;
    this.legends = chart.legends;
    this.display = true;

    return this;
} as any;


extend(H.LegendAdapter.prototype, {
    adjustMargins: function (this: Highcharts.LegendAdapter,
        margin: Array<number>,
        spacing: Array<number>): void {

        var chart = this.chart,
            titleMarginOption,
            titleMargin: number,
            titleMarginBottom: number;

        if (chart.options.title) {
            titleMarginOption = chart.options.title.margin;
        }

        titleMargin = titleMarginOption !== undefined ?
            chart.titleOffset[0] + titleMarginOption :
            0;
        titleMarginBottom = titleMarginOption !== undefined ?
            chart.titleOffset[2] + titleMarginOption :
            0;

        this.legends.forEach(function (legend): void {

            var options = legend.options,
                alignment = legend.getAlignment(),
                marginValue: number;

            if (alignment && options.enabled) { //  move options.enabled higher
                ([
                    /(lth|ct|rth)/,
                    /(rtv|rm|rbv)/,
                    /(rbh|cb|lbh)/,
                    /(lbv|lm|ltv)/
                ]).forEach(function (alignments: RegExp, side: number): void {
                    if (alignments.test(alignment) && !defined(margin[side])) {

                        // Now we have detected on which side of the
                        // chart we should reserve space for the legend
                        marginValue = Math.max(
                            (chart as any)[marginNames[side]],
                            (
                                legend[
                                    (side + 1) % 2 ?
                                        'legendHeight' : 'legendWidth'
                                ] +
                                [1, -1, -1, 1][side] * (legend[
                                    (side % 2) ? 'xOption' : 'yOption'
                                ] as any) +
                                pick(options.margin as any, 12) +
                                spacing[side] +
                                (side === 0 &&
                                    (chart.titleOffset[0] === 0 ?
                                        0 : titleMargin)) + // #7428, #7894
                                  (side === 2 &&
                                    (chart.titleOffset[2] === 0 ?
                                        0 : titleMarginBottom))
                            )
                        );
                        (chart as any)[marginNames[side]] = marginValue;
                    }
                });
            }
        }, this);
    },

    colorizeItem: function (this: Highcharts.LegendAdapter,
        item: (Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series),
        visible: boolean): void {
        this.legends.forEach(function (legend): void {
            legend.colorizeItem(item, visible);
        });
    },

    destroyItem: function (this: Highcharts.LegendAdapter,
        item: (
            Highcharts.BubbleLegend|
            Highcharts.ColorAxis|
            Highcharts.Point|
            Highcharts.Series
        )
    ): void {
        this.legends.forEach(function (legend: Highcharts.Legend): void {
            legend.destroyItem(item);
        });
    },

    // TODO: it doesn't work for now.
    // A workaround utilizes `labelFormat` option:
    // http://jsfiddle.net/BlackLabel/scmxq0tz/
    positionCheckboxes: function (this: Highcharts.LegendAdapter): void {
        this.legends.forEach(function (legend): void {
            legend.positionCheckboxes();
        });
    },

    positionItems: function (this: Highcharts.LegendAdapter): void {
        this.legends.forEach(function (legend): void {
            if (legend.proximate) {
                legend.positionItems();
            }
        });
    },

    proximatePositions: function (this: Highcharts.LegendAdapter): void {
        this.legends.forEach(function (legend): void {
            if (legend.proximate) {
                legend.proximatePositions();
            }
        });
    },

    render: function (this: Highcharts.LegendAdapter): void {
        this.legends.forEach(function (legend): void {
            if (legend.options.enabled) {
                legend.render();
            }
        });
    },

    update: function (
        this: Highcharts.LegendAdapter,
        options: Highcharts.LegendOptions,
        redraw?: boolean
    ): void {
        this.legends.forEach(function (legend): void {
            legend.update(H.merge(true, options, legend.options), redraw);
        });
    }

});

wrap(H.Chart.prototype, 'renderLegend', function (
    this: Highcharts.AdvancedLegendChart,
    originalFunc
): void {

    if (!this.isAdvancedLegendEnabled()) {
        originalFunc.call(this);
        return;
    }
    // Create multiple legends.
    this.legends = [];
    (this.options as Highcharts.AdvancedLegendChartOptions)
        .legends.forEach(function (legendOptions, index): void {
            legendOptions.index = index;
            // options.legend provides base options for all legends
            this.legends.push(new H.AdvancedLegend(this, legendOptions));
        }, this);

    this.legend = new H.LegendAdapter(this, this.options.legend);

    // Add legends array to updatable collections.
    H.Chart.prototype.collectionsWithUpdate.push('legends');
});

/**
 * Add a new legend to chart.
 *
 * @private
 * @function Highcharts.Chart.addLegend
 * @param {Highcharts.AdvancedLegendOptions} options
 * @return {void}
 */
H.Chart.prototype.addLegend = function (
    this: Highcharts.AdvancedLegendChart,
    options: Highcharts.AdvancedLegendOptions
): void {
    this.legends.push(
        new H.AdvancedLegend(this, H.merge(this.options.legend, options))
    );
    this.isDirtyLegend = this.isDirtyBox = true;
    this.redraw();
};

/**
 * @private
 * @mixin Highcharts.LegendItemMixin
 */

H.LegendItemMixin =
    function (this: Highcharts.LegendItemMixin): Highcharts.LegendItemMixin {
        return this;
    } as any;


/**
 * Get the options of the legend where the item should be rendered.
 *
 * @private
 * @function Highcharts.LegendItemMixin.findTargetLegendOptions
 *
 * @return {Highcharts.AdvancedLegendOptions}
 */
H.LegendItemMixin.prototype.findTargetLegendOptions =
    function (item: Highcharts.AdvancedLegendItem): any {
        var id = item.legendId =
            // Get legend id from user options.
            (item as any).userOptions ?
                (item as any).userOptions.legend :
                // Use options if user options don't specify
                // the legend id.
                ((item as any).options ? (item as any)
                    .options.legend : undefined),

            allLegendsOptions =
                (item.chart.options as
                    Highcharts.AdvancedLegendChartOptions).legends,
            legendOptions,
            sublegends,
            targetLegendOptions;

        if (allLegendsOptions) {
            for (var i = 0; i < allLegendsOptions.length; i++) {
                legendOptions = allLegendsOptions[i];
                sublegends = legendOptions.sublegends;

                if (legendOptions.id === id) {
                    targetLegendOptions = legendOptions;
                    break;
                } else if (sublegends && sublegends.length > 0) {

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
        return targetLegendOptions as Highcharts.AdvancedLegendOptions;
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
    function (item: Highcharts.AdvancedLegendItem): void {

        if (item.chart && item.chart.isAdvancedLegendEnabled()) {
            var options =
                H.LegendItemMixin.prototype.findTargetLegendOptions(item);
            if (!options && defined(item.legendId)) {
                // Options for legend not found although they're expected
                H.error(32, false, item.chart);

            } else {
                item.parentLegendOptions =
                    options as Highcharts.AdvancedLegendItemOptions;
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
addEvent(H.Series, 'afterSetOptions', function (): void {
    H.LegendItemMixin.prototype.setTargetLegendOptions(this);
});


addEvent(H.AdvancedLegend.prototype, 'beforeRender',
    function (this: Highcharts.AdvancedLegend): void {
    // Always render sublegends from scratch.
        if (this.sublegends) {
            this.sublegends.forEach(function (sublegend): void {
                sublegend.destroy();
            });
        }
        this.sublegends = [];
    });

addEvent(H.AdvancedLegend.prototype, 'afterSetOptions', function (): void {
    var parentLegend = this.legend,
        options = this.options;
    // Alter bBox options for sublegend using
    // parent legend (not the whole chart box)
    // as a baseline.
    if (parentLegend) {
        if (parentLegend.widthOption) {
            this.widthOption = H.relativeLength(options.width as any,
                parentLegend.widthOption) - parentLegend.padding * 2;
        }
        if (parentLegend.heightOption) {
            this.heightOption = H.relativeLength(options.width as any,
                parentLegend.heightOption) - parentLegend.padding * 2;
        }
    }
});

addEvent(H.AdvancedLegend.prototype, 'afterGetAllItems', function (
    this: Highcharts.Legend,
    e: {
        allItems: Array<(
            Highcharts.Point|Highcharts.Series|Highcharts.AdvancedLegend
        )>;
    }): void {
    var legend = this as Highcharts.AdvancedLegend;
    if (legend.options.sublegends) {
        legend.renderSublegends().forEach(function (sublegend): void {
            e.allItems.push(sublegend);
        });
    }
});

// BUBBLE LEGEND INTERGRATION:

// Provide the bubble legend with information about its target legend.
H.extend(H.BubbleLegend.prototype, H.LegendItemMixin);

addEvent(H.BubbleLegend, 'afterSetOptions',
    function (this: Highcharts.AdvancedLegendItem): void {
        H.LegendItemMixin.prototype.setTargetLegendOptions(this);
    });


// Overwrite the method defined in Bubble Legend module.
wrap(H.Chart.prototype, 'getLegendForBubbleLegend', function (
    this: Highcharts.AdvancedLegendChart,
    originalFunc): any {

    if (!this.isAdvancedLegendEnabled()) {
        return originalFunc.call(this);
    }

    return (this.legends as any)
        .find(function (legend: Highcharts.AdvancedLegend): any {
        // Only one bubble legend per chart is supported for now -
        // return its first occurence in options.
            return legend.bubbleLegend;
        });
});

// COLOR AXIS INTERGRATION:

/**
 * The id of a legend where the color axis should be rendred.
 * The default legend is the first one that appears in chart's options.
 *
 * @type      {string}
 * @apioption colorAxis.legendId
 */

// Provide the color axis with information about its target legend.
H.extend(H.ColorAxis.prototype, H.LegendItemMixin);

addEvent(H.ColorAxis, 'beforeBuildOptions',
    function (this: Highcharts.AdvancedLegendItem): void {
        H.LegendItemMixin.prototype.setTargetLegendOptions(this);
    });

// Find out if there's a targed legend for color axis.
wrap(H.ColorAxis.prototype, 'shouldBeRendered', function (
    this: Highcharts.AdvancedLegendItem,
    originalFunc,
    legend: Highcharts.Legend): boolean {
    if (this.chart && !this.chart.isAdvancedLegendEnabled()) {
        return originalFunc.call(this, legend);
    }

    var options = this.options as any;
    return (options && options.showInLegend &&
        this.parentLegendOptions &&
        legend && legend.options &&
        (this.parentLegendOptions.id === legend.options.id)) as boolean;
});
