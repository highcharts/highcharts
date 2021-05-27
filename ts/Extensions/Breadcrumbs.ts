/* *
 *
 *  Highcharts Breadcrumbs module
 *
 *  Authors: Grzegorz Blachlinski, Karol Kolodziej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type {
    CSSObject
} from '../Core/Renderer/CSSObject';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import D from '../Core/DefaultOptions.js';
const { defaultOptions } = D;
import U from '../Core/Utilities.js';
import Point from '../Core/Series/Point';
import type TreemapSeries from '../Series/Treemap/TreemapSeries';
import SeriesType from '../Core/Series/SeriesType';
import F from '../Core/FormatUtilities.js';
import SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
const {
    format
} = F;
const {
    addEvent,
    defined,
    extend,
    merge
} = U;

/* *
 *
 * Declarations
 *
 * */

declare module '../Core/LangOptions' {
    interface LangOptions {
        mainBreadcrumb?: string;
    }
}
declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        breadcrumbs?: Breadcrumbs;
    }
}
declare module '../Series/Treemap/TreemapSeriesOptions' {
    interface TreemapSeriesOptions {
        breadcrumbs?: Highcharts.BreadcrumbsOptions;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface BreadcrumbsOptions {
            buttonPadding?: number;
            events?: BreadcrumbsButtonsEventsOptions;
            floating?: boolean;
            format?: string;
            formatter?: BreadcrumbsButtonsFormatter;
            position?: BreadcrumbsAlignOptions;
            separator?: SeparatorOptions;
            showFullPath?: boolean;
            style?: CSSObject;
            useHTML?: boolean;
            zIndex?: number;
        }
        interface BreadcrumbsAlignOptions {
            align?: AlignValue;
            verticalAlign?: VerticalAlignValue;
            alignByTranslate?: boolean;
            x: number;
            y: number;
        }
        interface BreadcrumbsClickCallbackFunction {
            (e: Event, breadcrumbs: Breadcrumbs): (boolean|undefined);
        }
        interface BreadcrumbsButtonsEventsOptions {
            click?: BreadcrumbsClickCallbackFunction;
        }
        interface BreadcrumbsButtonsFormatter {
            (
                breadcrumb: Array<number|null|Point|SeriesType|SVGAElement>,
                breadcrumbs: Breadcrumbs
            ): (string);
        }
        interface DrilldownOptions {
            breadcrumbs?: BreadcrumbsOptions;
        }
        interface SeparatorOptions {
            symbol?: string;
            size?: number;
        }
        interface TreemapSeriesOptions {
            breadcrumbs?: BreadcrumbsOptions;
        }
        interface ChartLike {
            breadcrumbs?: Breadcrumbs;
        }
        interface LangOptions {
            mainBreadcrumb?: string;
        }
        class Breadcrumbs {
            public constructor(chart: Chart, userOptions: Highcharts.BreadcrumbsOptions, isTreemap?: boolean);

            public breadcrumbsGroup: SVGElement;
            public breadcrumbsList: Array<Array<number|null|Point|SeriesType|SVGAElement>>
            public chart: Chart;
            public isDirty: boolean;
            public isTreemap?: boolean;
            public level: number;
            public options: BreadcrumbsOptions;

            public alignGroup(): void;
            public createList(e?: any): void;
            public destroyGroup(this: Breadcrumbs): void;
            public jumpBy(numb: number): void;
            public jumpTo(): void;
            public redraw(): void;
            public render(): void;
            public renderButton(breadcrumb: Array<number|Point|SVGAElement>, posX: number, posY: number):
            SVGElement|void;
            public renderSeparator(posX: number, posY: number): SVGElement|undefined;
            public resetList(this: Breadcrumbs): void
            public update(options: Highcharts.BreadcrumbsOptions, redraw: boolean): void;
            public updateSingleButton(this: Breadcrumbs): void;
            public setMargins(this: Breadcrumbs): void;
        }
    }
}

// Add language support.
extend(
    defaultOptions.lang,
    /**
     * @optionparent lang
     */
    {
        /**
         * @since    next
         * @product  highcharts
         */
        mainBreadcrumb: 'Main'
    }
);

/**
 * The Breadcrumbs class
 *
 * @class
 * @name Highcharts.Breadcrumbs
 *
 * @param {Highcharts.Chart} chart
 *        Chart object
 * @param {Highcharts.Options} userOptions
 *        User options
 */
class Breadcrumbs {
    /**
     * Options for breadcrumbs
     *
     * @since   next
     * @product highcharts
     */
    public static defaultBreadcrumbsOptions = {
        /**
         * The default padding for each button and separator in each direction.
         *
         * @type      {number}
         * @since     next
         */
        buttonPadding: 5,

        /**
         * Fires when clicking on the breadcrumbs button.
         * Two arguments are passed to the function. First breadcrumb button
         * as an SVG element. Second is the breadcrumbs class,
         * containing reference to the chart, series etc.
         *
         * ```js
         * click: function(button, breadcrumbs) {
         *   console.log(button);
         * }
         * ```
         *
         * Return false to stop default buttons click action.
         *
         * @type      {Highcharts.BreadcrumbsClickCallbackFunction}
         * @since     next
         * @apioption breadcrumbs.events.click
         */

        /**
         * When the breadcrumbs are floating, the plot area will not move
         * to make space for it. By default, the chart will not make space
         * for the buttons. This property won't work when positioned in the
         * middle.
         *
         * @sample {highcharts} highcharts/breadcrumbs/floating-false
         *          Non-floating breadcrumbs
         *
         * @type      {boolean}
         * @since     next
         */
        floating: true,

        /**
         * A format string for the breadcrumbs button.
         * Variables are enclosed by curly brackets.
         * Available values are passed in the declared point options.
         *
         * @type      {string}
         * @since     next
         * @default   '{point.name}'
         * @sample {highcharts} highcharts/breadcrumbs/format
         *          Display custom values in breadcrumb button.
         */
        format: '{point.name}',

        /**
         * Callback function to format the breadcrumb text from scratch.
         *
         * @type      {Highcharts.BreadcrumbsFormatterCallbackFunction}
         * @since     next
         * @apioption breadcrumbs.formatter
         */

        /**
         * Positioning for the button row. The breadcrumbs buttons
         * will be aligned properly for the default chart layout
         * (title,  subtitle, legend, range selector) for the custom chart
         * layout set the position properties.
         * @sample {highcharts} highcharts/breadcrumbs/position
         *          Custom button positioning.
         */
        position: {
            /**
             * Horizontal alignment of the breadcrumbs buttons.
             *
             * @type {Highcharts.AlignValue}
             */
            align: 'left',

            /**
             * Vertical alignment of the breadcrumbs buttons.
             *
             * @type {Highcharts.VerticalAlignValue}
             */
            verticalAlign: 'top',

            /**
             * The X offset of the breadcrumbs button group.
             */
            x: 0,

            /**
             * The Y offset of the breadcrumbs button group.
             */
            y: 0
        },

        /**
         * Options object for Breadcrumbs separator.
         *
         * @since     next
         */
        separator: {
            /**
             * A predefined shape or symbol for the separator. Other possible
             *  values are `'circle'`, `'square'`,`'diamond'`.
             * Custom callbacks for symbol path generation can also be added to
             * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
             * used by its method name.
             *
             * Additionally, the URL to a graphic can be given on this form:
             * `'url(graphic.png)'`. Note that for the image to be applied to
             * exported charts, its URL needs to be accessible by the export
             * server. Recommended size of image is 10x10px.
             *
             * @type      {string}
             * @since     next
             */
            symbol: 'triangle-right',
            /**
             * The size of the separator
             *
             * @type      {number}
             * @since     next
             */
            size: 10
        },

        /**
         * Show full path or only a single button.
         *
         * @type      {boolean}
         * @since     next
         * @sample {highcharts} highcharts/breadcrumbs/show-full-path
         *          Show full path.
         */
        showFullPath: false,

        /**
         * CSS styles for all breadcrumbs.
         *
         * In styled mode, the breadcrumbs buttons are styled by the
         * `.highcharts-range-selector-buttons .highcharts-button` rule with its
         * different states.
         *  @type {Highcharts.SVGAttributes}
         *  @since     next
         */
        style: {
            'fill': '#ffffff',
            'position': 'absolute'
        },

        /**
         * Whether to use HTML to render the breadcrumbs items texts.
         *
         * @type      {boolean}
         * @since     next
         */
        useHTML: false,

        /**
         * The zIndex of the group.
         *
         * @type      {boolean}
         * @since     next
         */
        zIndex: 7
    };

    /* *
     *
     * Properties
     *
     * */
    public chart: Chart = void 0 as any;
    public breadcrumbsGroup: SVGElement = void 0 as any;
    public breadcrumbsList: Array<Array<any>> = [];
    public isDirty: boolean = true;
    public isTreemap?: boolean = void 0 as any;
    public level: number = -1;
    public options: Highcharts.BreadcrumbsOptions = void 0 as any;

    public constructor(chart: Chart, userOptions?: Highcharts.BreadcrumbsOptions, isTreemap?: boolean) {
        const chartOptions = merge(Breadcrumbs.defaultBreadcrumbsOptions, userOptions);

        this.chart = chart;
        this.options = chartOptions || {};
        this.isTreemap = isTreemap;
    }

    /**
     * Align the breadcrumbs group depending on the alignment.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public alignGroup(this: Breadcrumbs): void {
        const chart = this.chart,
            breadcrumbsOptions = this.options,
            bBox = this.breadcrumbsGroup && this.breadcrumbsGroup.getBBox(),
            rangeSelector = chart.rangeSelector,
            positionOptions = breadcrumbsOptions.position;

        if (positionOptions) {
            // Create a deep copy.
            const calcPosition = merge(positionOptions);

            // Change the initial position based on other elements on the chart.
            if (positionOptions.verticalAlign === 'top') {
                calcPosition.y += chart.titleOffset && chart.titleOffset[0] || 0;

                if (rangeSelector && rangeSelector.group) {
                    const rangeSelectorBBox = rangeSelector.group.getBBox(),
                        rangeSelectorY = rangeSelectorBBox.y,
                        rangeSelectorHight = rangeSelectorBBox.height;

                    calcPosition.y += (rangeSelectorY + rangeSelectorHight) || 0;
                }
            }

            if (positionOptions.verticalAlign === 'bottom' && chart.marginBottom) {
                if (chart.legend && chart.legend.group && chart.legend.options.verticalAlign === 'bottom') {
                    (calcPosition.y as number) -= chart.marginBottom -
                            bBox.height -
                            chart.legend.legendHeight;
                } else {
                    (calcPosition.y as number) -= bBox.height;
                }
            }

            if (positionOptions.align === 'right') {
                (calcPosition.x as number) -= bBox.width;
            } else if (positionOptions.align === 'center') {
                (calcPosition.x as number) -= bBox.width / 2;
            }
            this.breadcrumbsGroup
                .align(
                    calcPosition,
                    true,
                    chart.spacingBox
                );
        }
    }

    /**
     * Calcule level on which chart currently is.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#calculateLevel
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public calculateLevel(this: Breadcrumbs): void {
        const chart = this.chart,
            drilldownLevels = chart.drilldownLevels;

        // Calculate on which level we are now.
        if (this.isTreemap && (chart.series[0] as Highcharts.TreeSeries).tree) {
            this.level = Math.abs(((chart.series[0] as Highcharts.TreeSeries).tree as any).levelDynamic) - 1;
        } else {
            this.level = drilldownLevels && drilldownLevels[drilldownLevels.length - 1] &&
            drilldownLevels[drilldownLevels.length - 1].levelNumber || 0;
        }
    }

    /**
     * This method creates an array of arrays containing a level number
     * with the corresponding series/point.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#createList
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} e
     *        Event in case of the treemap series.
     */
    public createList(this: Breadcrumbs, e?: any): void {
        const breadcrumbsList: Array<Array<number|null|Point|SeriesType|SVGAElement>> = this.breadcrumbsList || [],
            chart = this.chart,
            drilldownLevels = chart.drilldownLevels;
            // If the list doesn't exist treat the initial series
            // as the current level- first iteration.
        let currentLevelNumber: number|null = breadcrumbsList.length ?
            (breadcrumbsList[breadcrumbsList.length - 1][0] as number) : null;

        if (this.isTreemap && e) {
            if (!breadcrumbsList[0]) {
                // As a first element add the series.
                breadcrumbsList.push([null, chart.series[0]]);
            }
            if (e.trigger === 'click') {
                // When a user clicks add element one by one.
                if (currentLevelNumber === null) {
                    breadcrumbsList.push([0, (chart.get(e.newRootId) as SeriesType)]);
                    currentLevelNumber = 0;
                } else {
                    breadcrumbsList.push([currentLevelNumber + 1, (chart.get(e.newRootId) as SeriesType)]);
                }
            } else {
                let node = e.target.nodeMap[e.newRootId];
                const extraNodes = [];

                // When the root node is set and has parent,
                // recreate the path from the node tree.
                while (node.parent || node.parent === '') {
                    extraNodes.push(node);
                    node = e.target.nodeMap[node.parent];
                }
                extraNodes.reverse().forEach(function (node): void {
                    if (currentLevelNumber === null) {
                        breadcrumbsList.push([0, node]);
                        currentLevelNumber = 0;
                    } else {
                        breadcrumbsList.push([++currentLevelNumber, node]);
                    }
                });
            }
        }
        if (!this.isTreemap && drilldownLevels && drilldownLevels.length) {
            // Add the initial series as the first element.
            if (!breadcrumbsList[0]) {
                breadcrumbsList.push([null, (drilldownLevels[0].seriesOptions as any)]);
                currentLevelNumber = -1;
            }

            drilldownLevels.forEach(function (level): void {
                // If level is already added to breadcrumbs list,
                // don't add it again- drilling categories
                if (level.levelNumber > (currentLevelNumber as number)) {
                    breadcrumbsList.push([level.levelNumber, (level.pointOptions as Point)]);
                }
            });
        }
        this.breadcrumbsList = breadcrumbsList;
    }

    /**
     * Default button text formatter.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#defaultFormatter
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} breadcrumb
     *        Breadcrumb.
     * @return {string}
     *         Formatted text.
     */
    public defaultFormatter(this: Breadcrumbs, breadcrumb: Array<number|null|Point|SeriesType|SVGAElement>): string {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsOptions = breadcrumbs.options,
            arrow = breadcrumbsOptions.showFullPath ? '' : '◁ ',
            lang = chart.options.lang;

        return breadcrumbsOptions.formatter && breadcrumbsOptions.formatter(breadcrumb, breadcrumbs) ||
            arrow + (
                format(breadcrumbsOptions.format as string, { point: (breadcrumb[1] as Point) }, chart) ||
                (lang as Highcharts.LangOptions).mainBreadcrumb
            );
    }

    /**
     * Destroy the chosen buttons and separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#destroyGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public destroyGroup(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = breadcrumbs.options;

        // The full path of buttons is visible.
        if (breadcrumbsOptions && breadcrumbsOptions.showFullPath && this.breadcrumbsGroup) {
            breadcrumbsList.forEach(function (el): void {
                const button = el[2],
                    separator = el[3];

                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                separator && separator.destroy();
            });
            // Clear the breadcrums list array.
            breadcrumbsList.length = 0;
            this.breadcrumbsGroup.destroy();
            this.breadcrumbsGroup = void 0 as any;
        } else {
            const drilldownLevels = chart.drilldownLevels;
            // When the chart is on the main series, destroy the button.
            // Subtract 1 because destroy is fired before drillUp and we
            // want to see the previous state.
            if ((drilldownLevels && (!(drilldownLevels.length - 1) || this.level === -1) && chart.drillUpButton) ||
                (this.isTreemap && this.level === 0 && chart.drillUpButton)) {
                breadcrumbsList.length = 0;
                chart.drillUpButton.destroy();
                chart.drillUpButton = void 0;
            }
        }
    }

    /**
     * Perform the drillUp action.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#jumpTo
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public jumpTo(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart;

        if (this.isTreemap) {
            (chart.series[0] as TreemapSeries).drillUp();
        } else {
            chart.drillUp();
        }
    }

    /**
     * Performs multiple drillups based on the provided number.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#jumpBy
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} drillAmount
     *        A number of drillups that needs to be performed.
     */
    public jumpBy(this: Breadcrumbs, drillAmount: number): void {
        const breadcrumbsList = this.breadcrumbsList,
            drillNumber = defined(drillAmount) ?
                breadcrumbsList[breadcrumbsList.length - 1][0] - drillAmount :
                breadcrumbsList[breadcrumbsList.length - 1][0] + 1;

        if (this.options.showFullPath) {
            if (breadcrumbsList && breadcrumbsList.length) {
                for (let i = 0; i < drillNumber; i++) {
                    this.jumpTo();
                }
            }
        } else {
            this.destroyGroup();
            this.jumpTo();
        }
    }

    /**
    * Redraw.
    *
    * @requires  modules/breadcrums
    *
    * @function Highcharts.Breadcrumbs#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    public redraw(this: Breadcrumbs): void {
        const breadcrumbsGroup = this.breadcrumbsGroup;

        this.calculateLevel();

        if (this.isDirty) {
            this.createList();
            this.render();
        }

        if (breadcrumbsGroup && this.breadcrumbsList.length) {
            this.alignGroup();
        }

        this.isDirty = false;
    }

    /**
    * Reset list after the drillUp.
    *
    * @requires  modules/breadcrums
    *
    * @function Highcharts.Breadcrumbs#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    public resetList(this: Breadcrumbs): void {
        const breadcrumbsList = this.breadcrumbsList;

        if (this.level === 0) {
            this.destroyGroup();
        } else {
            if (this.options.showFullPath) {
                const el = breadcrumbsList[breadcrumbsList.length - 1],
                    button = el && el[2],
                    conector = el && el[3],
                    prevConector = breadcrumbsList[breadcrumbsList.length - 2] &&
                        breadcrumbsList[breadcrumbsList.length - 2][3];

                // Remove connector from the previous button.
                prevConector && prevConector.destroy();
                breadcrumbsList[breadcrumbsList.length - 2].length = 3;

                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                conector && conector.destroy();
            } else {
                this.updateSingleButton();
            }
            breadcrumbsList.pop();
        }
    }

    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#draw
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public render(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = breadcrumbs.options,
            lastBreadcrumbs = breadcrumbsList[breadcrumbsList.length - 2] &&
                breadcrumbsList[breadcrumbsList.length - 2][2],
            buttonPadding = breadcrumbsOptions && breadcrumbsOptions.buttonPadding;

        // A main group for the breadcrumbs.
        if (!this.breadcrumbsGroup && breadcrumbsOptions) {
            this.breadcrumbsGroup = chart.renderer
                .g('breadcrumbs-group')
                .attr({
                    zIndex: breadcrumbsOptions.zIndex
                })
                .addClass('highcharts-breadcrumbs')
                .add();
        }

        // Draw breadcrumbs.
        if (breadcrumbsList && breadcrumbsOptions && buttonPadding) {
            // Inital position for calculating the breadcrumbsGroup.
            let posX: number = lastBreadcrumbs ? lastBreadcrumbs.x +
                    lastBreadcrumbs.element.getBBox().width + buttonPadding : 0;
            const posY: number = buttonPadding;

            if (breadcrumbsOptions.showFullPath) {
                // Make sure that only one type of button is visible.
                if (chart.drillUpButton) {
                    chart.drillUpButton.destroy();
                    chart.drillUpButton = void 0;
                }

                breadcrumbsList.forEach(function (breadcrumb, index): void {
                    const breadcrumbButton: SVGElement = breadcrumb[2],
                        separatorElement: SVGElement = breadcrumb[3];

                    // Render a button.
                    if (!breadcrumbButton) {
                        const button = breadcrumbs.renderButton(breadcrumb, posX, posY);
                        breadcrumb.push(button);
                        posX += button ? button.getBBox().width + buttonPadding : 0;
                        breadcrumbs.breadcrumbsGroup.lastXPos = posX;
                    }

                    // Render a separator.
                    if (!separatorElement && index !== breadcrumbsList.length - 1) {
                        const separator = breadcrumbs.renderSeparator(posX, posY);

                        breadcrumb.push(separator);
                        posX += separator ? separator.getBBox().width + buttonPadding : 0;
                    }
                });
            } else {
                const previousBreadcrumb = breadcrumbsList[breadcrumbsList.length - 2],
                    drilldownLevels = chart.drilldownLevels;

                if (!chart.drillUpButton &&
                    (
                        (drilldownLevels && drilldownLevels.length) ||
                        (this.isTreemap && this.level >= 0)
                    )
                ) {
                    chart.drillUpButton = breadcrumbs.renderButton(previousBreadcrumb, posX, posY);
                } else if (chart.drillUpButton) {
                    // Update button.
                    this.updateSingleButton();
                }
            }
        }

        breadcrumbs.alignGroup();
    }

    /**
    * Render a button.
    *
    * @requires  modules/breadcrums
    *
    * @function Highcharts.Breadcrumbs#renderButton
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.Breadcrumbs} breadcrumb
    *        Current breadcrumb
    * @param {Highcharts.Breadcrumbs} posX
    *        Initial horizontal position
    * @param {Highcharts.Breadcrumbs} posY
    *        Initial vertical position
    * @return {SVGElement|void}
    *        Returns the SVG button
    */
    public renderButton(this: Breadcrumbs,
        breadcrumb: Array<number|null|Point|SeriesType|SVGAElement>,
        posX: number, posY: number): SVGElement|undefined {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = breadcrumbs.options,
            lang = chart.options.lang;

        if (breadcrumbsOptions && breadcrumb && breadcrumb[1]) {
            const button = chart.renderer.button(
                breadcrumbs.defaultFormatter(breadcrumb),
                posX,
                posY,
                function (e: (Event|any)): void {
                    // Extract events from button object and call
                    const buttonEvents = breadcrumbsOptions.events && breadcrumbsOptions.events.click;
                    let callDefaultEvent;

                    if (buttonEvents) {
                        callDefaultEvent = buttonEvents.call(breadcrumbsOptions, e as any, breadcrumbs);
                    }

                    // Prevent from click on the current level
                    if (callDefaultEvent !== false &&
                        breadcrumbsList[breadcrumbsList.length - 1][1].name !== button.textStr &&
                        breadcrumbsOptions.showFullPath
                    ) {
                        breadcrumbs.jumpBy(breadcrumb[0] as number);
                    }

                    if (callDefaultEvent !== false && !breadcrumbsOptions.showFullPath) {
                        breadcrumbs.jumpBy(null as any);
                    }
                })
                .attr({
                    padding: 3
                })
                .addClass('highcharts-breadcrumbs-button')
                .add(breadcrumbs.breadcrumbsGroup);

            if (!chart.styledMode) {
                button.attr(breadcrumbsOptions.style as SVGAttributes);
            }
            return button;
        }
    }

    /**
    * Render a separator.
    *
    * @requires  modules/breadcrums
    *
    * @function Highcharts.Breadcrumbs#renderSeparator
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.Breadcrumbs} posX
    *        Initial horizontal position
    * @param {Highcharts.Breadcrumbs} posY
    *        Initial vertical position
    * @return {Highcharts.SVGElement}
    *        Returns the SVG button
    */
    public renderSeparator(this: Breadcrumbs, posX: number, posY: number): SVGElement|undefined {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = breadcrumbs.options,
            size = 10,
            separatorOptions = breadcrumbsOptions.separator;

        let separator, separatorBBox;

        if (separatorOptions) {
            separator = chart.renderer.symbol(
                separatorOptions.symbol as string,
                posX,
                posY,
                separatorOptions.size,
                separatorOptions.size
            ).add(breadcrumbs.breadcrumbsGroup)
                .addClass('highcharts-breadcrumbs-separator');
            separatorBBox = separator.getBBox();

            if (!chart.styledMode) {
                separator.css({
                    fill: 'white',
                    stroke: 'black',
                    lineWidth: 1
                });
            }

            separator.translate(0, separatorBBox.height / 2);
        }

        return separator;
    }

    /**
    * Update.
    * @function Highcharts.Breadcrumbs#update
    *
    * @requires  modules/breadcrumbs
    *
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.BreadcrumbsOptions} options
    *        Breadcrumbs class.
    * @param {boolean} redraw
    *        Redraw flag
    */
    public update(this: Breadcrumbs, options: Highcharts.BreadcrumbsOptions, redraw: boolean = true): void {
        merge(true, this.options, options);

        if (redraw) {
            this.destroyGroup();
            this.redraw();
        }
    }

    /**
    * Update button text when the showFullPath set to false.
    * @function Highcharts.Breadcrumbs#updateSingleButton
    *
    * @requires  modules/breadcrumbs
    *
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    public updateSingleButton(this: Breadcrumbs): void {
        const chart = this.chart,
            breadcrumbsOptions = this.options,
            breadcrumbsList = this.breadcrumbsList,
            currentBreadcrumb = breadcrumbsList[this.level],
            lang = chart.options.lang;

        if (chart.drillUpButton && breadcrumbsOptions && lang) {
            chart.drillUpButton.attr({
                text: this.defaultFormatter(currentBreadcrumb)
            });
        }
    }

    /**
    * Set margins if the floating: false.
    * @function Highcharts.Breadcrumbs#update
    *
    * @requires  modules/breadcrumbs
    *
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    public setMargins(this: Breadcrumbs): void {
        const chart = this.chart,
            breadcrumbsOptions = this.options,
            defaultBreadcrumheight = 35, // TO DO: calculate that height
            extraMargin = chart.rangeSelector ? chart.rangeSelector.getHeight() : defaultBreadcrumheight;

        if (
            breadcrumbsOptions &&
            !breadcrumbsOptions.floating &&
            chart.breadcrumbs &&
            chart.breadcrumbs.breadcrumbsList &&
            chart.breadcrumbs.breadcrumbsList.length
        ) {
            chart.yAxis[0].options.offsets = [extraMargin, 0, 0, 0];
        } else {
            chart.yAxis[0].options.offsets = [0, 0, 0, 0];
        }
    }
}

/* eslint-disable no-invalid-this */

if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs as typeof Breadcrumbs;

    addEvent(Chart, 'setOffsets', function (): void {
        this.breadcrumbs && this.breadcrumbs.setMargins();
    });

    addEvent(Chart, 'update', function (e: any): void {
        const breadcrumbs = this.breadcrumbs;

        if (breadcrumbs && e.options.drilldown && e.options.drilldown.breadcrumbs) {
            breadcrumbs.isDirty = true;
            breadcrumbs.update(e.options.drilldown.breadcrumbs as Highcharts.BreadcrumbsOptions, false);
            breadcrumbs.redraw();
        }
    });

    addEvent(Chart, 'redraw', function (): void {
        this.breadcrumbs && this.breadcrumbs.redraw();
    });

    addEvent(Chart, 'beforeDrillUp', function (): void {
        if (this.breadcrumbs) {
            this.breadcrumbs.isDirty = true;
            this.breadcrumbs.resetList();
        }
    });

    addEvent(Chart, 'applyDrilldown', function (): void {
        const chart = this,
            breadcrumbs = chart.breadcrumbs as Highcharts.Breadcrumbs,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;

        if (!breadcrumbs) {
            chart.breadcrumbs = new Breadcrumbs(chart as Chart, breadcrumbsOptions, false);
            chart.breadcrumbs.createList();

        } else {
            breadcrumbs.isDirty = true;
            breadcrumbs.redraw();
        }

    });

    let treemapEventsAdded: boolean = false;

    // Causes some troubles in karma tests.
    addEvent(Chart, 'init', function (): void {
        if (H.seriesTypes.treemap && !treemapEventsAdded) {

            addEvent(H.seriesTypes.treemap,
                'setRootNode',
                function (this: TreemapSeries, e: TreemapSeries.SetRootNodeObject): void {
                    const chart = this.chart,
                        breadcrumbsOptions = this.options.breadcrumbs;

                    if (!chart.breadcrumbs) {
                        chart.breadcrumbs = new Breadcrumbs(chart as Chart, breadcrumbsOptions, true);
                    }
                    if (chart.breadcrumbs) {
                        chart.breadcrumbs.isDirty = true;
                        // Create a list using the event after drilldown.
                        if ((e as any).trigger === 'click' || !(e as any).trigger) {
                            chart.breadcrumbs.createList(e);
                            chart.breadcrumbs.render();
                        }

                        if ((e as any).trigger === 'traverseUpButton') {
                            chart.breadcrumbs.resetList();
                        }
                    }
                });
            addEvent(H.seriesTypes.treemap, 'update', function (e: any): void {
                const breadcrumbs = this.chart.breadcrumbs;

                if (breadcrumbs && e.options.breadcrumbs) {
                    breadcrumbs.isDirty = true;
                    breadcrumbs.update(e.options.breadcrumbs as Highcharts.BreadcrumbsOptions, false);
                    breadcrumbs.redraw();
                }
            });
            treemapEventsAdded = true;
        }
    });

    // Remove resize/afterSetExtremes at chart destroy
    addEvent(Chart, 'destroy', function destroyEvents(): void {
        if (this.breadcrumbs) {
            this.breadcrumbs.destroyGroup();
            this.breadcrumbs = void 0 as any;
        }
    });
}

export default Breadcrumbs;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Callback function to react on button clicks.
 *
 * @callback Highcharts.BreadcrumbsClickCallbackFunction
 *
 * @param {Highcharts.Breadcrumbs} this
 * Breadcumps instance.
 *
 * @param {global.Event} e
 * Event arguments.
 */

/**
 * Callback function to format the breadcrumb text from scratch.
 *
 * @callback Highcharts.BreadcrumbsFormatterCallbackFunction
 *
 * @param {Highcharts.Breadcrumbs} breadcrumbs
 * The breadcrumbs instance
 *
 * @return {string}
 * Formatted text or false
 */

(''); // keeps doclets above in JS file
