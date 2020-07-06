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
import type Point from '../parts/Point';
import U from '../parts/Utilities.js';
const {
    defined,
    pick,
    extend
} = U;

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
            // TODO: fix TS
            chart: any; // Chart;
        }

        interface AdvancedLegendItemOptions {
            legend?: string;
            id?: string;
        }

        class AdvancedLegend extends Legend implements AdvancedLegendItem {
            public coll: string;
            // TODO: fix TS
            public chart: any; // AdvancedLegendChart
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

        // interface Series extends AdvancedLegendItem {
        // }

        // interface Point extends AdvancedLegendItem {
        // }

        // // TODO: fix TS
        // // interface ColorAxis extends AdvancedLegendItem {
        // // }

        // interface BubbleLegend extends AdvancedLegendItem {
        // }

        interface AdvancedLegendOptions extends LegendOptions {
            index?: number;
            id: string;
            sublegends?: Array<AdvancedLegendItemOptions>;
        }

        // interface Chart {
        //     isAdvancedLegendEnabled(): boolean;
        //     addLegend(options: AdvancedLegendOptions): void;
        // }

        // TODO: fix TS
        interface AdvancedLegendChart { // extends Chart {
            legendAdapter: LegendAdapter;
            legend: any;
        }

        class LegendAdapter extends Legend {
            // TODO: fix TS
            public chart: any // AdvancedLegendChart;
            public legends: Array<AdvancedLegend>;
            public options: LegendOptions;
            public constructor(chart: AdvancedLegendChart,
                commonLegendOptions?: LegendOptions);
        }

        interface AdvancedLegendChartOptions extends ChartOptions{
            legend: Array<AdvancedLegendOptions>;
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
 * - allow referring the legend by index
 *
 */


var marginNames = H.marginNames,
    addEvent = H.addEvent,
    wrap = H.wrap,
    fireEvent = H.fireEvent,
    merge = H.merge;

/* eslint-disable no-invalid-this, valid-jsdoc, no-undefined */

/**
 * Utility function for checking if the Advanced Module should kick in.
 *
 * @private
 * @function Highcharts.Chart#isAdvancedLegendEnabled
 * @return {boolean}
 */
// TODO: fix TS
(H.Chart.prototype as any).isAdvancedLegendEnabled =
    function (): boolean {
        return H.isArray((this as any).options.legend);
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
H.AdvancedLegend = function (
    this: Highcharts.AdvancedLegend,
    chart: Highcharts.AdvancedLegendChart,
    options: Highcharts.LegendOptions,
    parentLegend: Highcharts.AdvancedLegend
): Highcharts.AdvancedLegend {
    this.id = options.id;
    this.coll = 'legend';
    this.legend = parentLegend;
    // TODO: fix TS
    this.init(chart as any, merge(H.defaultOptions.legend, options));
    return this;
} as any;

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

    getAllItems: function ( // TODO: fix TS
    // this: any //Highcharts.AdvancedLegend
    ): Array<Highcharts.AdvancedLegendItem> {
        var allItems: Array<Highcharts.AdvancedLegendItem> = [],
            legend = this as any;

        (this as any).chart.series.forEach(function (
            series: Highcharts.AdvancedLegendItem
        ): void {
            if (legend.options.id === series.legendId) {
                allItems = allItems.concat(legend.getSeriesItems(series));
            }
        }, this as any);

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
        var renderer = (this.chart as any).renderer; // TODO: fix TS
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
        H.erase(this.chart.legend, this);
        // TODO: fix TS
        (this.chart as any).isDirtyLegend = (this as any).chart.isDirtyBox = true;
        (this.chart as any).redraw();
    },

    /**
     * Override the method from Highcharts.Legend prototype.
     * Add support for scrolling items higher than legend.
     *
     * @private
     * @function Highcharts.AdvancedLegend#createPages
     * @return {void}
     */
    createPages: function (
        this: Highcharts.AdvancedLegend,
        clipHeight: number
    ): void {
        var pageH: number,
            allItems = this.allItems,
            pages = this.pages;

        if (clipHeight < 1) {
            return;
        }

        allItems.forEach(function (
            item: any, // Highcharts.AdvancedLegendItem
            i: number
        ): void {
            var y = (item._legendItemPos as any)[1],
                h = item.legendItem ?
                    Math.round((item.legendItem as any).getBBox().height) :
                    0,
                hRemained = h,
                lastPageY;

            // At least one page is required.
            if (!pages.length) {
                pages.push(y);
            }

            if (pageH + h < clipHeight) {
                // Item placed within page without overflowing.
                pageH += h;
                return; // Finish this iteration.
            }

            while (hRemained > 0) {
                // Should the item (or its part - in case of items higher than
                // clipHeight) start a new page?
                if (hRemained > clipHeight) {
                    pageH = clipHeight;
                    lastPageY = pages[pages.length - 1];
                    if (y + h - pageH > lastPageY) {
                        pages.push(lastPageY + pageH);
                    }
                    hRemained -= clipHeight; // hRemained is being constantly
                    // decreased in order to to determine the amount of
                    // pages needed for a single item.
                } else {
                    // last page for the item
                    if (y > pages[pages.length - 1]) {
                        pages.push(y);
                    }
                    hRemained = 0;
                    pageH = Math.min(h, clipHeight);
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
    align: function (this: Highcharts.AdvancedLegend): void {
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
    getAllowedWidth: function (this: Highcharts.AdvancedLegend): number {
        var parentLegend = this.legend;
        if (!this.legend) {
            return Highcharts.Legend.prototype.getAllowedWidth.call(this);
        }

        return parentLegend.maxLegendWidth - parentLegend.padding * 2;
    }

}) as any;


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
    this.legends = chart.legend;
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

        if ((chart as any).options.title) { // TODO: fix TS
            titleMarginOption = (chart as any).options.title.margin;
        }

        titleMargin = titleMarginOption !== undefined ?
            (chart as any).titleOffset[0] + titleMarginOption :
            0;
        titleMarginBottom = titleMarginOption !== undefined ?
            (chart as any).titleOffset[2] + titleMarginOption :
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
                                    ((chart as any).titleOffset[0] === 0 ?
                                        0 : titleMargin)) + // #7428, #7894
                                  (side === 2 &&
                                    ((chart as any).titleOffset[2] === 0 ?
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
        item: (Highcharts.BubbleLegend|Point|Highcharts.Series),
        visible: boolean): void {
        this.legends.forEach(function (legend): void {
            legend.colorizeItem(item, visible);
        });
    },

    destroyItem: function (this: Highcharts.LegendAdapter,
        item: (
            Highcharts.BubbleLegend|
            Highcharts.ColorAxis|
            Point|
            Highcharts.Series
        )
    ): void {
        this.legends.forEach(function (legend: Highcharts.Legend): void {
            legend.destroyItem(item as any); // TODO: fix TS
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
    }
});

wrap(H.Chart.prototype, 'renderLegend', function (
    this: Highcharts.AdvancedLegendChart,
    originalFunc
): void {
    var index = (this as any).collectionsWithUpdate.indexOf('legend'); // TODO: fix TS

    if (!(this as any).isAdvancedLegendEnabled()) { // TODO: fix TS

        // legend could be marked as an updatable collection while
        // creating a previous chart. This paricular chart instance
        // doesn't need advanced legend logic - make sure that it
        // won't be used.
        if (index > -1) {
            (this as any).collectionsWithUpdate.splice(index, 1);
        }

        originalFunc.call(this);
        return;
    }
    // Create multiple legends.
    this.legend = [];

    ((this as any).options as Highcharts.AdvancedLegendChartOptions)
        .legend.forEach(function (legendOptions, index): void {
            legendOptions.index = index;
            this.legend.push(new H.AdvancedLegend(this, legendOptions));
        }, this);

    this.legendAdapter =
        new H.LegendAdapter(this, merge(H.defaultOptions.legend));

    // Legend array works as a legend adapter
    extend(this.legend, this.legendAdapter);

    if (index === -1) {
        // Add legends array to updatable collections.
        (this as any).collectionsWithUpdate.push('legend');
    }
});

/**
 * Add a new legend to chart.
 *
 * @private
 * @function Highcharts.Chart.addLegend
 * @param {Highcharts.AdvancedLegendOptions} options
 * @return {void}
 */
(H.Chart.prototype as any).addLegend = function (
    this: Highcharts.AdvancedLegendChart,
    options: Highcharts.AdvancedLegendOptions
): void {
    this.legend.push(
        new H.AdvancedLegend(this, merge(H.defaultOptions.legend, options))
    );
    (this as any).isDirtyLegend = (this as any).isDirtyBox = true;
    (this as any).redraw();
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
                ((item.chart as any).options as // TODO: fix TS
                    Highcharts.AdvancedLegendChartOptions).legend,
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
    H.LegendItemMixin.prototype.setTargetLegendOptions(this as any); // TODO: fix TS
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
            Point|Highcharts.Series|Highcharts.AdvancedLegend
        )>;
    }): void {
    var legend = this as Highcharts.AdvancedLegend;
    if (legend.options.sublegends) {
        legend.renderSublegends().forEach(function (sublegend): void {
            e.allItems.push(sublegend);
        });
    }
});


wrap(H.Chart.prototype, 'get', function (
    this: Highcharts.AdvancedLegendChart,
    originalFunc,
    id
): any { // TODO: fix TS
    var legend;
    if (H.isArray(this.legend)) {
        legend = (this.legend as any)
            .find((legend: any): boolean => legend.id === id);
    }
    return legend || originalFunc.call(this, id);
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

    addEvent(H.ColorAxis.prototype as any, 'beforeBuildOptions', // TODO: fix TS
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
}

// BUBBLE LEGEND INTERGRATION:
if (H.BubbleLegend) {

    // Provide the bubble legend with information about its target legend.
    H.extend(H.BubbleLegend.prototype, H.LegendItemMixin);

    addEvent(H.BubbleLegend as any, 'afterSetOptions', // TODO: fix TS
        function (this: Highcharts.AdvancedLegendItem): void {
            H.LegendItemMixin.prototype.setTargetLegendOptions(this);
        });

    wrap(H.Chart.prototype, 'getLegendForBubbleLegend', function (
        this: Highcharts.AdvancedLegendChart,
        originalFunc): any {

        if (!(this as any).isAdvancedLegendEnabled()) { // TODO: fix TS
            return originalFunc.call(this);
        }

        return H.find(this.legend,
            function (legend: Highcharts.AdvancedLegend): boolean {
            // Only one bubble legend per chart is supported for now -
            // return its first occurence in options.
                return !!legend.bubbleLegend;
            });
    });

    wrap(H.Chart.prototype, 'redrawLegend', function (
        this: Highcharts.AdvancedLegendChart,
        originalFunc): any {

        if (!(this as any).isAdvancedLegendEnabled()) { // TODO: fix TS
            return originalFunc.call(this);
        }

        this.legendAdapter.render();
        (this as any).isDirtyLegend = false; // TODO: fix TS
    });
}
