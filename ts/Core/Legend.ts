/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AnimationOptions from './Animation/AnimationOptions';
import type BBoxObject from './Renderer/BBoxObject';
import type Chart from './Chart/Chart';
import type ColorAxis from './Axis/ColorAxis';
import type CSSObject from './Renderer/CSSObject';
import type { HTMLDOMElement } from './Renderer/DOMElementType';
import type Series from './Series/Series';
import type SVGAttributes from './Renderer/SVG/SVGAttributes';
import type SVGElement from './Renderer/SVG/SVGElement';
import A from './Animation/AnimationUtilities.js';
const {
    animObject,
    setAnimation
} = A;
import H from './Globals.js';
const {
    isFirefox,
    marginNames,
    win
} = H;
import Point from './Series/Point.js';
import U from './Utilities.js';
const {
    addEvent,
    createElement,
    css,
    defined,
    discardElement,
    find,
    fireEvent,
    format,
    isNumber,
    merge,
    pick,
    relativeLength,
    stableSort,
    syncTimeout,
    wrap
} = U;

declare module './Series/SeriesOptions' {
    interface SeriesOptions {
        legendIndex?: number;
        legendType?: ('point'|'series');
        showCheckbox?: boolean;
        showInLegend?: boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface LegendCheckBoxElement extends HTMLDOMElement {
            checked?: boolean;
            x: number;
            y: number;
        }
        class Legend {
            public constructor(chart: Chart, options: LegendOptions);
            public allItems: Array<(BubbleLegend|Series|Point)>;
            public baseline?: number;
            public box: SVGElement;
            public chart: Chart;
            public clipHeight?: number;
            public clipRect?: SVGElement
            public contentGroup: SVGElement;
            public currentPage?: number;
            public display: boolean;
            public down?: SVGElement;
            public downTracker?: SVGElement;
            public fontMetrics?: FontMetricsObject;
            public fullHeight?: number;
            public group: SVGElement;
            public initialItemY: number;
            public itemHeight: number;
            public itemHiddenStyle?: CSSObject;
            public itemMarginBottom: number;
            public itemMarginTop: number;
            public itemStyle?: CSSObject;
            public itemX: number;
            public itemY: number;
            public lastItemY: number;
            public lastLineHeight: number;
            public legendHeight: number;
            public legendWidth: number;
            public maxItemWidth: number;
            public maxLegendWidth: number;
            public nav?: SVGElement;
            public offsetWidth: number;
            public options: LegendOptions;
            public padding: number;
            public pager?: SVGElement;
            public pages: Array<number>;
            public proximate: boolean;
            public scrollGroup: SVGElement;
            public scrollOffset?: number;
            public symbolHeight: number;
            public symbolWidth: number;
            public title?: SVGElement;
            public titleHeight: number;
            public totalItemWidth: number;
            public unchartrender?: Function;
            public up?: SVGElement;
            public upTracker?: SVGElement;
            public widthOption: number;
            public adjustMargins(
                margin: Array<number>,
                spacing: Array<number>
            ): void;
            public align(alignTo?: BBoxObject): void;
            public colorizeItem(
                item: (BubbleLegend|Series|Point),
                visible?: boolean
            ): void;
            public createCheckboxForItem(
                item: (BubbleLegend|Series|Point)
            ): void;
            public destroy(): void;
            public destroyItem(
                item: (BubbleLegend|ColorAxis|ColorAxis.LegendItemObject|Series|Point)
            ): void;
            public getAlignment(): string;
            public getAllItems(): Array<(BubbleLegend|Series|Point)>;
            public handleOverflow(legendHeight: number): number;
            public init(chart: Chart, options: LegendOptions): void;
            public layoutItem(item: (BubbleLegend|Series|Point)): void;
            public render(): void;
            public positionCheckboxes(): void;
            public positionItem(item: (BubbleLegend|Series|Point)): void;
            public positionItems(): void;
            public proximatePositions(): void;
            public renderItem(item: (BubbleLegend|Series|Point)): void;
            public renderTitle(): void;
            public scroll(
                scrollBy: number,
                animation?: (boolean|Partial<AnimationOptions>)
            ): void;
            public setOptions(options: LegendOptions): void;
            public setText(item: (BubbleLegend|Series|Point)): void;
            public update(options: LegendOptions, redraw?: boolean): void;
        }
    }
}

/**
 * Gets fired when the legend item belonging to a point is clicked. The default
 * action is to toggle the visibility of the point. This can be prevented by
 * returning `false` or calling `event.preventDefault()`.
 *
 * @callback Highcharts.PointLegendItemClickCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        The point on which the event occured.
 *
 * @param {Highcharts.PointLegendItemClickEventObject} event
 *        The event that occured.
 */

/**
 * Information about the legend click event.
 *
 * @interface Highcharts.PointLegendItemClickEventObject
 *//**
 * Related browser event.
 * @name Highcharts.PointLegendItemClickEventObject#browserEvent
 * @type {Highcharts.PointerEvent}
 *//**
 * Prevent the default action of toggle the visibility of the point.
 * @name Highcharts.PointLegendItemClickEventObject#preventDefault
 * @type {Function}
 *//**
 * Related point.
 * @name Highcharts.PointLegendItemClickEventObject#target
 * @type {Highcharts.Point}
 *//**
 * Event type.
 * @name Highcharts.PointLegendItemClickEventObject#type
 * @type {"legendItemClick"}
 */

/**
 * Gets fired when the legend item belonging to a series is clicked. The default
 * action is to toggle the visibility of the series. This can be prevented by
 * returning `false` or calling `event.preventDefault()`.
 *
 * @callback Highcharts.SeriesLegendItemClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesLegendItemClickEventObject} event
 *        The event that occured.
 */

/**
 * Information about the legend click event.
 *
 * @interface Highcharts.SeriesLegendItemClickEventObject
 *//**
 * Related browser event.
 * @name Highcharts.SeriesLegendItemClickEventObject#browserEvent
 * @type {Highcharts.PointerEvent}
 *//**
 * Prevent the default action of toggle the visibility of the series.
 * @name Highcharts.SeriesLegendItemClickEventObject#preventDefault
 * @type {Function}
 *//**
 * Related series.
 * @name Highcharts.SeriesLegendItemClickEventObject#target
 * @type {Highcharts.Series}
 *//**
 * Event type.
 * @name Highcharts.SeriesLegendItemClickEventObject#type
 * @type {"legendItemClick"}
 */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The overview of the chart's series. The legend object is instanciated
 * internally in the chart constructor, and is available from the `chart.legend`
 * property. Each chart has only one legend.
 *
 * @class
 * @name Highcharts.Legend
 *
 * @param {Highcharts.Chart} chart
 * The chart instance.
 *
 * @param {Highcharts.LegendOptions} options
 * Legend options.
 */
class Legend {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(chart: Chart, options: Highcharts.LegendOptions) {
        this.chart = chart;
        this.init(chart, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public allItems: Array<(Highcharts.BubbleLegend|Series|Point)> = [];

    public baseline?: number;

    public box: SVGElement = void 0 as any;

    public chart: Chart;

    public clipHeight?: number;

    public clipRect?: SVGElement

    public contentGroup: SVGElement = void 0 as any;

    public currentPage?: number;

    public display: boolean = false;

    public down?: SVGElement;

    public downTracker?: SVGElement;

    public fontMetrics?: Highcharts.FontMetricsObject;

    public fullHeight?: number;

    public group: SVGElement = void 0 as any;

    public initialItemY: number = 0;

    public itemHeight: number = 0;

    public itemHiddenStyle?: CSSObject;

    public itemMarginBottom: number = 0;

    public itemMarginTop: number = 0;

    public itemStyle?: CSSObject;

    public itemX: number = 0;

    public itemY: number = 0;

    public lastItemY: number = 0;

    public lastLineHeight: number = 0;

    public legendHeight: number = 0;

    public legendWidth: number = 0;

    public maxItemWidth: number = 0;

    public maxLegendWidth: number = 0;

    public nav?: SVGElement;

    public offsetWidth: number = 0;

    public options: Highcharts.LegendOptions = {};

    public padding: number = 0;

    public pager?: SVGElement;

    public pages: Array<number> = [];

    public proximate: boolean = false;

    public scrollGroup: SVGElement = void 0 as any;

    public scrollOffset?: number;

    public symbolHeight: number = 0;

    public symbolWidth: number = 0;

    public title?: SVGElement;

    public titleHeight: number = 0;

    public totalItemWidth: number = 0;

    public unchartrender?: Function;

    public up?: SVGElement;

    public upTracker?: SVGElement;

    public widthOption: number = 0;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initialize the legend.
     *
     * @private
     * @function Highcharts.Legend#init
     *
     * @param {Highcharts.Chart} chart
     * The chart instance.
     *
     * @param {Highcharts.LegendOptions} options
     * Legend options.
     */
    public init(chart: Chart, options: Highcharts.LegendOptions): void {

        /**
         * Chart of this legend.
         *
         * @readonly
         * @name Highcharts.Legend#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;

        this.setOptions(options);

        if (options.enabled) {

            // Render it
            this.render();

            // move checkboxes
            addEvent(this.chart, 'endResize', function (): void {
                this.legend.positionCheckboxes();
            });

            if (this.proximate) {
                this.unchartrender = addEvent(
                    this.chart,
                    'render',
                    function (): void {
                        this.legend.proximatePositions();
                        this.legend.positionItems();
                    }
                );
            } else if (this.unchartrender) {
                this.unchartrender();
            }
        }
    }

    /**
     * @private
     * @function Highcharts.Legend#setOptions
     * @param {Highcharts.LegendOptions} options
     */
    public setOptions(options: Highcharts.LegendOptions): void {

        var padding = pick(options.padding, 8) as number;

        /**
         * Legend options.
         *
         * @readonly
         * @name Highcharts.Legend#options
         * @type {Highcharts.LegendOptions}
         */
        this.options = options;

        if (!this.chart.styledMode) {
            this.itemStyle = options.itemStyle;
            this.itemHiddenStyle = merge(
                this.itemStyle,
                options.itemHiddenStyle
            );
        }

        this.itemMarginTop = options.itemMarginTop || 0;
        this.itemMarginBottom = options.itemMarginBottom || 0;
        this.padding = padding;
        this.initialItemY = padding - 5; // 5 is pixels above the text
        this.symbolWidth = pick(options.symbolWidth, 16);
        this.pages = [];
        this.proximate = options.layout === 'proximate' && !this.chart.inverted;
        this.baseline = void 0; // #12705: baseline has to be reset on every update
    }

    /**
     * Update the legend with new options. Equivalent to running `chart.update`
     * with a legend configuration option.
     *
     * @sample highcharts/legend/legend-update/
     *         Legend update
     *
     * @function Highcharts.Legend#update
     *
     * @param {Highcharts.LegendOptions} options
     * Legend options.
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw the chart after the axis is altered. If doing more
     * operations on the chart, it is a good idea to set redraw to false and
     * call {@link Chart#redraw} after. Whether to redraw the chart.
     *
     * @fires Highcharts.Legends#event:afterUpdate
     */
    public update(options: Highcharts.LegendOptions, redraw?: boolean): void {
        var chart = this.chart;

        this.setOptions(merge(true, this.options, options));
        this.destroy();
        chart.isDirtyLegend = chart.isDirtyBox = true;
        if (pick(redraw, true)) {
            chart.redraw();
        }

        fireEvent(this, 'afterUpdate');
    }

    /**
     * Set the colors for the legend item.
     *
     * @private
     * @function Highcharts.Legend#colorizeItem
     * @param {Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series} item
     *        A Series or Point instance
     * @param {boolean} [visible=false]
     *        Dimmed or colored
     *
     * @todo
     * Make events official: Fires the event `afterColorizeItem`.
     */
    public colorizeItem(
        item: (Highcharts.BubbleLegend|Series|Point),
        visible?: boolean
    ): void {
        (item.legendGroup as any)[visible ? 'removeClass' : 'addClass'](
            'highcharts-legend-item-hidden'
        );

        if (!this.chart.styledMode) {
            var legend = this,
                options = legend.options,
                legendItem = item.legendItem,
                legendLine = item.legendLine,
                legendSymbol = item.legendSymbol,
                hiddenColor = (legend.itemHiddenStyle as any).color,
                textColor = visible ?
                    (options.itemStyle as any).color :
                    hiddenColor,
                symbolColor = visible ?
                    ((item as any).color || hiddenColor) :
                    hiddenColor,
                markerOptions = item.options && (item.options as any).marker,
                symbolAttr: SVGAttributes = { fill: symbolColor };

            if (legendItem) {
                legendItem.css({
                    fill: textColor,
                    color: textColor // #1553, oldIE
                });
            }
            if (legendLine) {
                legendLine.attr({ stroke: symbolColor });
            }

            if (legendSymbol) {

                // Apply marker options
                if (markerOptions && legendSymbol.isMarker) { // #585
                    symbolAttr = (item as any).pointAttribs();
                    if (!visible) {
                        // #6769
                        symbolAttr.stroke = symbolAttr.fill = hiddenColor;
                    }
                }

                legendSymbol.attr(symbolAttr);
            }
        }

        fireEvent(this, 'afterColorizeItem', { item: item, visible: visible });
    }

    /**
     * @private
     * @function Highcharts.Legend#positionItems
     */
    public positionItems(): void {

        // Now that the legend width and height are established, put the items
        // in the final position
        this.allItems.forEach(this.positionItem, this);

        if (!this.chart.isResizing) {
            this.positionCheckboxes();
        }
    }

    /**
     * Position the legend item.
     *
     * @private
     * @function Highcharts.Legend#positionItem
     * @param {Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series} item
     * The item to position
     */
    public positionItem(item: (Highcharts.BubbleLegend|Series|Point)): void {
        var legend = this,
            options = legend.options,
            symbolPadding = options.symbolPadding,
            ltr = !options.rtl,
            legendItemPos = item._legendItemPos,
            itemX = (legendItemPos as any)[0],
            itemY = (legendItemPos as any)[1],
            checkbox = item.checkbox,
            legendGroup = item.legendGroup;

        if (legendGroup && legendGroup.element) {
            const attribs = {
                translateX: ltr ?
                    itemX :
                    legend.legendWidth - itemX - 2 * (symbolPadding as any) - 4,
                translateY: itemY
            };
            const complete = (): void => {
                fireEvent(this, 'afterPositionItem', { item });
            };

            if (defined(legendGroup.translateY)) {
                legendGroup.animate(attribs, void 0, complete);
            } else {
                legendGroup.attr(attribs);
                complete();
            }
        }

        if (checkbox) {
            checkbox.x = itemX;
            checkbox.y = itemY;
        }
    }

    /**
     * Destroy a single legend item, used internally on removing series items.
     *
     * @private
     * @function Highcharts.Legend#destroyItem
     * @param {Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series} item
     * The item to remove
     */
    public destroyItem(
        item: (
            Highcharts.BubbleLegend|ColorAxis|ColorAxis.LegendItemObject|
            Series|Point
        )
    ): void {
        var checkbox = item.checkbox;

        // destroy SVG elements
        ['legendItem', 'legendLine', 'legendSymbol', 'legendGroup'].forEach(
            function (key: string): void {
                if ((item as any)[key]) {
                    (item as any)[key] = (item as any)[key].destroy();
                }
            }
        );

        if (checkbox) {
            discardElement((item as any).checkbox);
        }
    }

    /**
     * Destroy the legend. Used internally. To reflow objects, `chart.redraw`
     * must be called after destruction.
     *
     * @private
     * @function Highcharts.Legend#destroy
     */
    public destroy(): void {
        /**
         * @private
         * @param {string} key
         * @return {void}
         */
        function destroyItems(this: Highcharts.Legend, key: string): void {
            if ((this as any)[key]) {
                (this as any)[key] = (this as any)[key].destroy();
            }
        }

        // Destroy items
        this.getAllItems().forEach(function (item): void {
            ['legendItem', 'legendGroup'].forEach(destroyItems, item);
        });

        // Destroy legend elements
        [
            'clipRect',
            'up',
            'down',
            'pager',
            'nav',
            'box',
            'title',
            'group'
        ].forEach(destroyItems, this);
        this.display = null as any; // Reset in .render on update.
    }

    /**
     * Position the checkboxes after the width is determined.
     *
     * @private
     * @function Highcharts.Legend#positionCheckboxes
     */
    public positionCheckboxes(): void {
        var alignAttr = this.group && this.group.alignAttr,
            translateY: number,
            clipHeight = this.clipHeight || this.legendHeight,
            titleHeight = this.titleHeight;

        if (alignAttr) {
            translateY = alignAttr.translateY;
            this.allItems.forEach(function (item): void {
                var checkbox = item.checkbox,
                    top;

                if (checkbox) {
                    top = translateY + titleHeight + checkbox.y +
                        (this.scrollOffset || 0) + 3;
                    css(checkbox, {
                        left: (alignAttr.translateX + item.checkboxOffset +
                            checkbox.x - 20) + 'px',
                        top: top + 'px',
                        display: this.proximate || (
                            top > translateY - 6 &&
                            top < translateY + clipHeight - 6
                        ) ?
                            '' :
                            'none'
                    });
                }
            }, this);
        }
    }

    /**
     * Render the legend title on top of the legend.
     *
     * @private
     * @function Highcharts.Legend#renderTitle
     */
    public renderTitle(): void {
        var options = this.options,
            padding = this.padding,
            titleOptions = options.title,
            titleHeight = 0,
            bBox;

        if ((titleOptions as any).text) {
            if (!this.title) {
                /**
                 * SVG element of the legend title.
                 *
                 * @readonly
                 * @name Highcharts.Legend#title
                 * @type {Highcharts.SVGElement}
                 */
                this.title = this.chart.renderer.label(
                    (titleOptions as any).text,
                    padding - 3,
                    padding - 4,
                    null as any,
                    null as any,
                    null as any,
                    options.useHTML,
                    null as any,
                    'legend-title'
                )
                    .attr({ zIndex: 1 });

                if (!this.chart.styledMode) {
                    this.title.css((titleOptions as any).style);
                }

                this.title.add(this.group);
            }

            // Set the max title width (#7253)
            if (!(titleOptions as any).width) {
                this.title.css({
                    width: this.maxLegendWidth + 'px'
                });
            }

            bBox = this.title.getBBox();
            titleHeight = bBox.height;
            this.offsetWidth = bBox.width; // #1717
            this.contentGroup.attr({ translateY: titleHeight });
        }
        this.titleHeight = titleHeight;
    }

    /**
     * Set the legend item text.
     *
     * @function Highcharts.Legend#setText
     * @param {Highcharts.Point|Highcharts.Series} item
     *        The item for which to update the text in the legend.
     */
    public setText(item: (Highcharts.BubbleLegend|Series|Point)): void {
        var options = this.options;

        (item.legendItem as any).attr({
            text: options.labelFormat ?
                format(options.labelFormat, item, this.chart) :
                (options.labelFormatter as any).call(item)
        });
    }

    /**
     * Render a single specific legend item. Called internally from the `render`
     * function.
     *
     * @private
     * @function Highcharts.Legend#renderItem
     * @param {Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series} item
     * The item to render.
     */
    public renderItem(item: (Highcharts.BubbleLegend|Series|Point)): void {
        var legend = this,
            chart = legend.chart,
            renderer = chart.renderer,
            options = legend.options,
            horizontal = options.layout === 'horizontal',
            symbolWidth = legend.symbolWidth,
            symbolPadding = options.symbolPadding,
            itemStyle = legend.itemStyle,
            itemHiddenStyle = legend.itemHiddenStyle,
            itemDistance = horizontal ? pick(options.itemDistance, 20) : 0,
            ltr = !options.rtl,
            bBox,
            li = item.legendItem,
            isSeries = !(item as any).series,
            series = !isSeries && (item as any).series.drawLegendSymbol ?
                (item as any).series :
                item,
            seriesOptions = series.options,
            showCheckbox = legend.createCheckboxForItem &&
                seriesOptions &&
                seriesOptions.showCheckbox,
            // full width minus text width
            itemExtraWidth = symbolWidth + (symbolPadding as any) +
                itemDistance + (showCheckbox ? 20 : 0),
            useHTML = options.useHTML,
            itemClassName = item.options.className;

        if (!li) { // generate it once, later move it

            // Generate the group box, a group to hold the symbol and text. Text
            // is to be appended in Legend class.
            item.legendGroup = renderer
                .g('legend-item')
                .addClass(
                    'highcharts-' + series.type + '-series ' +
                    'highcharts-color-' + (item as any).colorIndex +
                    (itemClassName ? ' ' + itemClassName : '') +
                    (
                        isSeries ?
                            ' highcharts-series-' + (item as any).index :
                            ''
                    )
                )
                .attr({ zIndex: 1 })
                .add(legend.scrollGroup);

            // Generate the list item text and add it to the group
            item.legendItem = li = renderer.text(
                '',
                ltr ?
                    symbolWidth + (symbolPadding as any) :
                    -(symbolPadding as any),
                legend.baseline || 0,
                useHTML
            );

            if (!chart.styledMode) {
                // merge to prevent modifying original (#1021)
                li.css(merge(
                    (item as any).visible ?
                        (itemStyle as any) :
                        (itemHiddenStyle as any)
                ));
            }

            li
                .attr({
                    align: ltr ? 'left' : 'right',
                    zIndex: 2
                })
                .add(item.legendGroup);

            // Get the baseline for the first item - the font size is equal for
            // all
            if (!legend.baseline) {
                legend.fontMetrics = renderer.fontMetrics(
                    chart.styledMode ? 12 : (itemStyle as any).fontSize as any,
                    li
                );
                legend.baseline =
                    legend.fontMetrics.f + 3 + legend.itemMarginTop;
                li.attr('y', (legend.baseline as any));
            }

            // Draw the legend symbol inside the group box
            legend.symbolHeight =
                options.symbolHeight || (legend.fontMetrics as any).f;
            series.drawLegendSymbol(legend, item);

            if (legend.setItemEvents) {
                legend.setItemEvents(item, li, useHTML);
            }

        }

        // Add the HTML checkbox on top
        if (showCheckbox && !item.checkbox && legend.createCheckboxForItem) {
            legend.createCheckboxForItem(item);
        }

        // Colorize the items
        legend.colorizeItem(item, item.visible);

        // Take care of max width and text overflow (#6659)
        if (chart.styledMode || !(itemStyle as any).width) {
            li.css({
                width: ((
                    options.itemWidth ||
                    legend.widthOption ||
                    (chart.spacingBox as any).width
                ) - itemExtraWidth) + 'px'
            });
        }

        // Always update the text
        legend.setText(item);

        // calculate the positions for the next line
        bBox = li.getBBox();

        item.itemWidth = item.checkboxOffset =
            options.itemWidth ||
            item.legendItemWidth ||
            bBox.width + itemExtraWidth;
        legend.maxItemWidth = Math.max(
            legend.maxItemWidth, (item.itemWidth as any)
        );
        legend.totalItemWidth += item.itemWidth as any;
        legend.itemHeight = item.itemHeight = Math.round(
            item.legendItemHeight || bBox.height || legend.symbolHeight
        );
    }

    /**
     * Get the position of the item in the layout. We now know the
     * maxItemWidth from the previous loop.
     *
     * @private
     * @function Highcharts.Legend#layoutItem
     * @param {Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series} item
     */
    public layoutItem(item: (Highcharts.BubbleLegend|Series|Point)): void {

        var options = this.options,
            padding = this.padding,
            horizontal = options.layout === 'horizontal',
            itemHeight = item.itemHeight,
            itemMarginBottom = this.itemMarginBottom,
            itemMarginTop = this.itemMarginTop,
            itemDistance = horizontal ? pick(options.itemDistance, 20) : 0,
            maxLegendWidth = this.maxLegendWidth,
            itemWidth = (
                options.alignColumns &&
                    this.totalItemWidth > maxLegendWidth
            ) ?
                this.maxItemWidth :
                item.itemWidth;

        // If the item exceeds the width, start a new line
        if (
            horizontal &&
            this.itemX - padding + (itemWidth as any) > maxLegendWidth
        ) {
            this.itemX = padding;
            if (this.lastLineHeight) { // Not for the first line (#10167)
                this.itemY += (
                    itemMarginTop +
                    this.lastLineHeight +
                    itemMarginBottom
                );
            }
            this.lastLineHeight = 0; // reset for next line (#915, #3976)
        }

        // Set the edge positions
        this.lastItemY = itemMarginTop + this.itemY + itemMarginBottom;
        this.lastLineHeight = Math.max( // #915
            itemHeight as any,
            this.lastLineHeight
        );

        // cache the position of the newly generated or reordered items
        item._legendItemPos = [this.itemX, this.itemY];

        // advance
        if (horizontal) {
            this.itemX += (itemWidth as any);

        } else {
            this.itemY +=
                itemMarginTop + (itemHeight as any) + itemMarginBottom;
            this.lastLineHeight = itemHeight as any;
        }

        // the width of the widest item
        this.offsetWidth = this.widthOption || Math.max(
            (
                horizontal ? this.itemX - padding - (item.checkbox ?
                    // decrease by itemDistance only when no checkbox #4853
                    0 :
                    itemDistance
                ) : itemWidth as any
            ) + padding,
            this.offsetWidth
        );
    }

    /**
     * Get all items, which is one item per series for most series and one
     * item per point for pie series and its derivatives. Fires the event
     * `afterGetAllItems`.
     *
     * @private
     * @function Highcharts.Legend#getAllItems
     * @return {Array<(Highcharts.BubbleLegend|Highcharts.Point|Highcharts.Series)>}
     * The current items in the legend.
     * @fires Highcharts.Legend#event:afterGetAllItems
     */
    public getAllItems(): Array<(Highcharts.BubbleLegend|Series|Point)> {
        var allItems = [] as Array<(Highcharts.BubbleLegend|Series|Point)>;

        this.chart.series.forEach(function (series): void {
            var seriesOptions = series && series.options;

            // Handle showInLegend. If the series is linked to another series,
            // defaults to false.
            if (series && pick(
                seriesOptions.showInLegend,
                !defined(seriesOptions.linkedTo) ? void 0 : false, true
            )) {

                // Use points or series for the legend item depending on
                // legendType
                allItems = allItems.concat(
                    series.legendItems as any ||
                    (
                        seriesOptions.legendType === 'point' ?
                            series.data :
                            series
                    )
                );
            }
        });

        fireEvent(this, 'afterGetAllItems', { allItems });

        return allItems;
    }

    /**
     * Get a short, three letter string reflecting the alignment and layout.
     *
     * @private
     * @function Highcharts.Legend#getAlignment
     * @return {string}
     * The alignment, empty string if floating
     */
    public getAlignment(): string {
        var options = this.options;

        // Use the first letter of each alignment option in order to detect
        // the side. (#4189 - use charAt(x) notation instead of [x] for IE7)
        if (this.proximate) {
            return (options.align as any).charAt(0) + 'tv';
        }
        return options.floating ? '' : (
            (options.align as any).charAt(0) +
            (options.verticalAlign as any).charAt(0) +
            (options.layout as any).charAt(0)
        );
    }

    /**
     * Adjust the chart margins by reserving space for the legend on only one
     * side of the chart. If the position is set to a corner, top or bottom is
     * reserved for horizontal legends and left or right for vertical ones.
     *
     * @private
     * @function Highcharts.Legend#adjustMargins
     * @param {Array<number>} margin
     * @param {Array<number>} spacing
     */
    public adjustMargins(margin: Array<number>, spacing: Array<number>): void {
        var chart = this.chart,
            options = this.options,
            alignment = this.getAlignment();

        if (alignment) {

            ([
                /(lth|ct|rth)/,
                /(rtv|rm|rbv)/,
                /(rbh|cb|lbh)/,
                /(lbv|lm|ltv)/
            ]).forEach(function (alignments: RegExp, side: number): void {
                if (alignments.test(alignment) && !defined(margin[side])) {

                    // Now we have detected on which side of the chart we should
                    // reserve space for the legend
                    (chart as any)[marginNames[side]] = Math.max(
                        (chart as any)[marginNames[side]],
                        (
                            chart.legend[
                                (side + 1) % 2 ? 'legendHeight' : 'legendWidth'
                            ] +
                            [1, -1, -1, 1][side] * (options[
                                (side % 2) ? 'x' : 'y'
                            ] as any) +
                            pick(options.margin as any, 12) +
                            spacing[side] +
                            (chart.titleOffset[side] || 0)
                        )
                    );
                }
            });
        }
    }

    /**
     * @private
     * @function Highcharts.Legend#proximatePositions
     */
    public proximatePositions(): void {
        var chart = this.chart,
            boxes = [] as Array<Record<string, any>>,
            alignLeft = this.options.align === 'left';

        this.allItems.forEach(function (item): void {
            var lastPoint: (Point|undefined),
                height: number,
                useFirstPoint = alignLeft,
                target,
                top;

            if ((item as any).yAxis) {

                if ((item as any).xAxis.options.reversed) {
                    useFirstPoint = !useFirstPoint;
                }
                if ((item as any).points) {
                    lastPoint = find(
                        useFirstPoint ?
                            (item as any).points :
                            (item as any).points.slice(0).reverse(),
                        function (item: Point): boolean {
                            return isNumber(item.plotY);
                        }
                    );
                }

                height = this.itemMarginTop +
                    (item.legendItem as any).getBBox().height +
                    this.itemMarginBottom;

                top = (item as any).yAxis.top - chart.plotTop;
                if (item.visible) {
                    target = lastPoint ?
                        lastPoint.plotY :
                        (item as any).yAxis.height;
                    target += top - 0.3 * height;
                } else {
                    target = top + (item as any).yAxis.height;
                }

                boxes.push({
                    target: target,
                    size: height,
                    item: item
                });
            }
        }, this);
        (H.distribute as any)(boxes, chart.plotHeight);
        boxes.forEach(function (box): void {
            box.item._legendItemPos[1] =
                chart.plotTop - chart.spacing[0] + box.pos;
        });

    }

    /**
     * Render the legend. This method can be called both before and after
     * `chart.render`. If called after, it will only rearrange items instead
     * of creating new ones. Called internally on initial render and after
     * redraws.
     *
     * @private
     * @function Highcharts.Legend#render
     */
    public render(): void {
        var legend = this,
            chart = legend.chart,
            renderer = chart.renderer,
            legendGroup = legend.group,
            allItems: Array<(Highcharts.BubbleLegend|Series|Point)>,
            display,
            legendWidth,
            legendHeight,
            box = legend.box,
            options = legend.options,
            padding = legend.padding,
            allowedWidth: number;

        legend.itemX = padding;
        legend.itemY = legend.initialItemY;
        legend.offsetWidth = 0;
        legend.lastItemY = 0;
        legend.widthOption = relativeLength(
            options.width as any,
            (chart.spacingBox as any).width - padding
        );

        // Compute how wide the legend is allowed to be
        allowedWidth =
            (chart.spacingBox as any).width - 2 * padding - (options.x as any);
        if (['rm', 'lm'].indexOf(legend.getAlignment().substring(0, 2)) > -1) {
            allowedWidth /= 2;
        }
        legend.maxLegendWidth = legend.widthOption || allowedWidth;

        if (!legendGroup) {
            /**
             * SVG group of the legend.
             *
             * @readonly
             * @name Highcharts.Legend#group
             * @type {Highcharts.SVGElement}
             */
            legend.group = legendGroup = renderer.g('legend')
                .attr({ zIndex: 7 })
                .add();
            legend.contentGroup = renderer.g()
                .attr({ zIndex: 1 }) // above background
                .add(legendGroup);
            legend.scrollGroup = renderer.g()
                .add(legend.contentGroup);
        }

        legend.renderTitle();

        // add each series or point
        allItems = legend.getAllItems();

        // sort by legendIndex
        stableSort(allItems, function (
            a: (Series|Point),
            b: (Series|Point)
        ): number {
            return ((a.options && a.options.legendIndex) || 0) -
                ((b.options && b.options.legendIndex) || 0);
        });

        // reversed legend
        if (options.reversed) {
            allItems.reverse();
        }

        /**
         * All items for the legend, which is an array of series for most series
         * and an array of points for pie series and its derivatives.
         *
         * @readonly
         * @name Highcharts.Legend#allItems
         * @type {Array<(Highcharts.Point|Highcharts.Series)>}
         */
        legend.allItems = allItems;
        legend.display = display = !!allItems.length;

        // Render the items. First we run a loop to set the text and properties
        // and read all the bounding boxes. The next loop computes the item
        // positions based on the bounding boxes.
        legend.lastLineHeight = 0;
        legend.maxItemWidth = 0;
        legend.totalItemWidth = 0;
        legend.itemHeight = 0;
        allItems.forEach(legend.renderItem, legend);
        allItems.forEach(legend.layoutItem, legend);

        // Get the box
        legendWidth = (legend.widthOption || legend.offsetWidth) + padding;
        legendHeight = legend.lastItemY + legend.lastLineHeight +
            legend.titleHeight;
        legendHeight = legend.handleOverflow(legendHeight);
        legendHeight += padding;

        // Draw the border and/or background
        if (!box) {
            /**
             * SVG element of the legend box.
             *
             * @readonly
             * @name Highcharts.Legend#box
             * @type {Highcharts.SVGElement}
             */
            legend.box = box = renderer.rect()
                .addClass('highcharts-legend-box')
                .attr({
                    r: options.borderRadius
                })
                .add(legendGroup);
            box.isNew = true;
        }

        // Presentational
        if (!chart.styledMode) {
            box
                .attr({
                    stroke: options.borderColor,
                    'stroke-width': options.borderWidth || 0,
                    fill: options.backgroundColor || 'none'
                })
                .shadow(options.shadow);
        }

        if (legendWidth > 0 && legendHeight > 0) {
            box[box.isNew ? 'attr' : 'animate'](
                box.crisp.call({}, { // #7260
                    x: 0,
                    y: 0,
                    width: legendWidth,
                    height: legendHeight
                }, box.strokeWidth())
            );
            box.isNew = false;
        }

        // hide the border if no items
        box[display ? 'show' : 'hide']();

        // Open for responsiveness
        if (chart.styledMode && legendGroup.getStyle('display') === 'none') {
            legendWidth = legendHeight = 0;
        }

        legend.legendWidth = legendWidth;
        legend.legendHeight = legendHeight;

        if (display) {
            legend.align();
        }

        if (!this.proximate) {
            this.positionItems();
        }

        fireEvent(this, 'afterRender');
    }

    /**
     * Align the legend to chart's box.
     *
     * @private
     * @function Highcharts.align
     * @param {Highcharts.BBoxObject} alignTo
     * @return {void}
     */
    public align(alignTo: BBoxObject = this.chart.spacingBox): void {
        var chart = this.chart,
            options = this.options;
        // If aligning to the top and the layout is horizontal, adjust for
        // the title (#7428)
        let y = alignTo.y;

        if (
            /(lth|ct|rth)/.test(this.getAlignment()) &&
            chart.titleOffset[0] > 0
        ) {
            y += chart.titleOffset[0];

        } else if (
            /(lbh|cb|rbh)/.test(this.getAlignment()) &&
            chart.titleOffset[2] > 0
        ) {
            y -= chart.titleOffset[2];
        }

        if (y !== alignTo.y) {
            alignTo = merge(alignTo, { y });
        }

        this.group.align(merge(options, {
            width: this.legendWidth,
            height: this.legendHeight,
            verticalAlign: this.proximate ? 'top' : options.verticalAlign
        }), true, alignTo);
    }

    /**
     * Set up the overflow handling by adding navigation with up and down arrows
     * below the legend.
     *
     * @private
     * @function Highcharts.Legend#handleOverflow
     * @param {number} legendHeight
     * @return {number}
     */
    public handleOverflow(legendHeight: number): number {
        var legend = this,
            chart = this.chart,
            renderer = chart.renderer,
            options = this.options,
            optionsY = options.y,
            alignTop = options.verticalAlign === 'top',
            padding = this.padding,
            spaceHeight = (
                (chart.spacingBox as any).height +
                (alignTop ? -(optionsY as any) : optionsY) - padding
            ),
            maxHeight = options.maxHeight,
            clipHeight: number,
            clipRect = this.clipRect,
            navOptions = options.navigation,
            animation = pick((navOptions as any).animation, true),
            arrowSize = (navOptions as any).arrowSize || 12,
            nav = this.nav,
            pages = this.pages,
            lastY: number,
            allItems = this.allItems,
            clipToHeight = function (height?: number): void {
                if (typeof height === 'number') {
                    (clipRect as any).attr({
                        height: height
                    });
                } else if (clipRect) { // Reset (#5912)
                    legend.clipRect = clipRect.destroy();
                    legend.contentGroup.clip();
                }

                // useHTML
                if (legend.contentGroup.div) {
                    legend.contentGroup.div.style.clip = height ?
                        'rect(' + padding + 'px,9999px,' +
                            (padding + height) + 'px,0)' :
                        'auto';
                }
            },
            addTracker = function (key: string): SVGElement {
                (legend as any)[key] = renderer
                    .circle(0, 0, arrowSize * 1.3)
                    .translate(arrowSize / 2, arrowSize / 2)
                    .add(nav);
                if (!chart.styledMode) {
                    (legend as any)[key].attr('fill', 'rgba(0,0,0,0.0001)');
                }
                return (legend as any)[key];
            };


        // Adjust the height
        if (
            options.layout === 'horizontal' &&
            options.verticalAlign !== 'middle' &&
            !options.floating
        ) {
            spaceHeight /= 2;
        }
        if (maxHeight) {
            spaceHeight = Math.min(spaceHeight, maxHeight);
        }

        // Reset the legend height and adjust the clipping rectangle
        pages.length = 0;
        if (legendHeight > spaceHeight &&
            (navOptions as any).enabled !== false
        ) {

            this.clipHeight = clipHeight =
                Math.max(spaceHeight - 20 - this.titleHeight - padding, 0);
            this.currentPage = pick(this.currentPage, 1);
            this.fullHeight = legendHeight;

            // Fill pages with Y positions so that the top of each a legend item
            // defines the scroll top for each page (#2098)
            allItems.forEach(function (item, i): void {
                var y = (item._legendItemPos as any)[1],
                    h = Math.round((item.legendItem as any).getBBox().height),
                    len = pages.length;

                if (!len || (y - pages[len - 1] > clipHeight &&
                        (lastY || y) !== pages[len - 1])) {
                    pages.push(lastY || y);
                    len++;
                }

                // Keep track of which page each item is on
                item.pageIx = len - 1;
                if (lastY) {
                    allItems[i - 1].pageIx = len - 1;
                }

                if (
                    i === allItems.length - 1 &&
                    y + h - pages[len - 1] > clipHeight &&
                    y !== lastY // #2617
                ) {
                    pages.push(y);
                    item.pageIx = len;
                }

                if (y !== lastY) {
                    lastY = y;
                }
            });

            // Only apply clipping if needed. Clipping causes blurred legend in
            // PDF export (#1787)
            if (!clipRect) {
                clipRect = legend.clipRect =
                    renderer.clipRect(0, padding, 9999, 0);
                legend.contentGroup.clip(clipRect);
            }

            clipToHeight(clipHeight);

            // Add navigation elements
            if (!nav) {
                this.nav = nav = renderer.g()
                    .attr({ zIndex: 1 })
                    .add(this.group);

                this.up = renderer
                    .symbol(
                        'triangle',
                        0,
                        0,
                        arrowSize,
                        arrowSize
                    )
                    .add(nav);
                addTracker('upTracker')
                    .on('click', function (): void {
                        legend.scroll(-1, animation);
                    });

                this.pager = renderer.text('', 15, 10)
                    .addClass('highcharts-legend-navigation');

                if (!chart.styledMode) {
                    this.pager.css((navOptions as any).style);
                }
                this.pager.add(nav);

                this.down = renderer
                    .symbol(
                        'triangle-down',
                        0,
                        0,
                        arrowSize,
                        arrowSize
                    )
                    .add(nav);
                addTracker('downTracker')
                    .on('click', function (): void {
                        legend.scroll(1, animation);
                    });

            }

            // Set initial position
            legend.scroll(0);

            legendHeight = spaceHeight;

        // Reset
        } else if (nav) {
            clipToHeight();
            this.nav = nav.destroy(); // #6322
            this.scrollGroup.attr({
                translateY: 1
            });
            this.clipHeight = 0; // #1379
        }

        return legendHeight;
    }

    /**
     * Scroll the legend by a number of pages.
     *
     * @private
     * @function Highcharts.Legend#scroll
     *
     * @param {number} scrollBy
     *        The number of pages to scroll.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether and how to apply animation.
     *
     * @return {void}
     */
    public scroll(scrollBy: number, animation?: (boolean|Partial<AnimationOptions>)): void {
        var chart = this.chart,
            pages = this.pages,
            pageCount = pages.length,
            currentPage = (this.currentPage as any) + scrollBy,
            clipHeight = this.clipHeight,
            navOptions = this.options.navigation,
            pager = this.pager,
            padding = this.padding;

        // When resizing while looking at the last page
        if (currentPage > pageCount) {
            currentPage = pageCount;
        }

        if (currentPage > 0) {

            if (typeof animation !== 'undefined') {
                setAnimation(animation, chart);
            }

            (this.nav as any).attr({
                translateX: padding,
                translateY:
                    (clipHeight as any) + this.padding + 7 + this.titleHeight,
                visibility: 'visible'
            });
            [this.up, this.upTracker].forEach(function (elem): void {
                (elem as any).attr({
                    'class': currentPage === 1 ?
                        'highcharts-legend-nav-inactive' :
                        'highcharts-legend-nav-active'
                });
            });
            (pager as any).attr({
                text: currentPage + '/' + pageCount
            });
            [this.down, this.downTracker].forEach(function (
                elem: (SVGElement|undefined)
            ): void {
                (elem as any).attr({
                    // adjust to text width
                    x: 18 + (this.pager as any).getBBox().width,
                    'class': currentPage === pageCount ?
                        'highcharts-legend-nav-inactive' :
                        'highcharts-legend-nav-active'
                });
            }, this);

            if (!chart.styledMode) {
                (this.up as any)
                    .attr({
                        fill: currentPage === 1 ?
                            (navOptions as any).inactiveColor :
                            (navOptions as any).activeColor
                    });
                (this.upTracker as any)
                    .css({
                        cursor: currentPage === 1 ? 'default' : 'pointer'
                    });
                (this.down as any)
                    .attr({
                        fill: currentPage === pageCount ?
                            (navOptions as any).inactiveColor :
                            (navOptions as any).activeColor
                    });
                (this.downTracker as any)
                    .css({
                        cursor: currentPage === pageCount ?
                            'default' :
                            'pointer'
                    });
            }

            this.scrollOffset = -pages[currentPage - 1] + this.initialItemY;

            this.scrollGroup.animate({
                translateY: this.scrollOffset
            });

            this.currentPage = currentPage;
            this.positionCheckboxes();

            // Fire event after scroll animation is complete
            const animOptions = animObject(
                pick(animation, chart.renderer.globalAnimation, true)
            );
            syncTimeout((): void => {
                fireEvent(this, 'afterScroll', { currentPage });
            }, animOptions.duration);
        }
    }


    /**
     * @private
     * @function Highcharts.Legend#setItemEvents
     * @param {Highcharts.BubbleLegend|Point|Highcharts.Series} item
     * @param {Highcharts.SVGElement} legendItem
     * @param {boolean} [useHTML=false]
     * @fires Highcharts.Point#event:legendItemClick
     * @fires Highcharts.Series#event:legendItemClick
     */
    public setItemEvents(
        item: (Highcharts.BubbleLegend|Series|Point),
        legendItem: SVGElement,
        useHTML?: boolean
    ): void {
        var legend = this,
            boxWrapper = legend.chart.renderer.boxWrapper,
            isPoint = item instanceof Point,
            activeClass = 'highcharts-legend-' +
                (isPoint ? 'point' : 'series') + '-active',
            styledMode = legend.chart.styledMode,
            // When `useHTML`, the symbol is rendered in other group, so
            // we need to apply events listeners to both places
            legendItems = useHTML ?
                [legendItem, item.legendSymbol] :
                [item.legendGroup];

        // Set the events on the item group, or in case of useHTML, the item
        // itself (#1249)
        legendItems.forEach(function (element): void {
            if (element) {
                element
                    .on('mouseover', function (): void {
                        if (item.visible) {
                            legend.allItems.forEach(function (inactiveItem): void {
                                if (item !== inactiveItem) {
                                    inactiveItem.setState('inactive', !isPoint);
                                }
                            });
                        }

                        item.setState('hover');

                        // A CSS class to dim or hide other than the hovered
                        // series.
                        // Works only if hovered series is visible (#10071).
                        if (item.visible) {
                            boxWrapper.addClass(activeClass);
                        }

                        if (!styledMode) {
                            legendItem.css(
                                legend.options.itemHoverStyle as any
                            );
                        }
                    })
                    .on('mouseout', function (): void {
                        if (!legend.chart.styledMode) {
                            legendItem.css(
                                merge(
                                    item.visible ?
                                        legend.itemStyle as any :
                                        legend.itemHiddenStyle as any
                                )
                            );
                        }

                        legend.allItems.forEach(function (inactiveItem): void {
                            if (item !== inactiveItem) {
                                inactiveItem.setState('', !isPoint);
                            }
                        });

                        // A CSS class to dim or hide other than the hovered
                        // series.
                        boxWrapper.removeClass(activeClass);

                        item.setState();
                    })
                    .on('click', function (event: PointerEvent): void {
                        var strLegendItemClick = 'legendItemClick',
                            fnLegendItemClick = function (): void {
                                if ((item as any).setVisible) {
                                    (item as any).setVisible();
                                }
                                // Reset inactive state
                                legend.allItems.forEach(function (inactiveItem): void {
                                    if (item !== inactiveItem) {
                                        inactiveItem.setState(
                                            item.visible ? 'inactive' : '',
                                            !isPoint
                                        );
                                    }
                                });
                            };

                        // A CSS class to dim or hide other than the hovered
                        // series. Event handling in iOS causes the activeClass
                        // to be added prior to click in some cases (#7418).
                        boxWrapper.removeClass(activeClass);

                        // Pass over the click/touch event. #4.
                        event = {
                            browserEvent: event
                        } as any;

                        // click the name or symbol
                        if ((item as any).firePointEvent) { // point
                            (item as any).firePointEvent(
                                strLegendItemClick,
                                event,
                                fnLegendItemClick
                            );
                        } else {
                            fireEvent(
                                item, strLegendItemClick, event, fnLegendItemClick
                            );
                        }
                    });
            }
        });
    }

    /**
     * @private
     * @function Highcharts.Legend#createCheckboxForItem
     * @param {Highcharts.BubbleLegend|Point|Highcharts.Series} item
     * @fires Highcharts.Series#event:checkboxClick
     */
    public createCheckboxForItem(
        item: (Highcharts.BubbleLegend|Series|Point)
    ): void {
        var legend = this;

        item.checkbox = createElement('input', {
            type: 'checkbox',
            className: 'highcharts-legend-checkbox',
            checked: item.selected,
            defaultChecked: item.selected // required by IE7
        }, legend.options.itemCheckboxStyle, legend.chart.container) as any;

        addEvent(item.checkbox, 'click', function (event: PointerEvent): void {
            var target = event.target as Highcharts.LegendCheckBoxElement;

            fireEvent(
                (item as any).series || item,
                'checkboxClick',
                { // #3712
                    checked: target.checked,
                    item: item
                },
                function (): void {
                    (item as any).select();
                }
            );
        });
    }

}

// Workaround for #2030, horizontal legend items not displaying in IE11 Preview,
// and for #2580, a similar drawing flaw in Firefox 26.
// Explore if there's a general cause for this. The problem may be related
// to nested group elements, as the legend item texts are within 4 group
// elements.
if (
    /Trident\/7\.0/.test(win.navigator && win.navigator.userAgent) ||
    isFirefox
) {
    wrap(Legend.prototype, 'positionItem', function (
        this: Highcharts.Legend,
        proceed: Function,
        item: (Series|Point)
    ): void {
        var legend = this,
            // If chart destroyed in sync, this is undefined (#2030)
            runPositionItem = function (): void {
                if (item._legendItemPos) {
                    proceed.call(legend, item);
                }
            };

        // Do it now, for export and to get checkbox placement
        runPositionItem();

        // Do it after to work around the core issue
        if (!legend.bubbleLegend) {
            setTimeout(runPositionItem);
        }
    });
}

H.Legend = Legend as any;

export default H.Legend;
