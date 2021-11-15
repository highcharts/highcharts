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
import type { ButtonRelativeToValue } from '../Maps/MapNavigationOptions';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import D from '../Core/DefaultOptions.js';
const { defaultOptions } = D;
import U from '../Core/Utilities.js';
import type TreemapSeries from '../Series/Treemap/TreemapSeries';
import F from '../Core/FormatUtilities.js';
import SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import SeriesOptions from '../Core/Series/SeriesOptions';
import type {
    PointOptions,
    PointShortOptions
} from '../Core/Series/PointOptions';
const {
    format
} = F;
const {
    addEvent,
    defined,
    extend,
    merge,
    pick
} = U;

/* *
 *
 * Declarations
 *
 * */


declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        breadcrumbsBottomMargin?: boolean;
        breadcrumbsTopMargin?: boolean;
        breadcrumbs?: Breadcrumbs;
    }
}
declare module '../Core/LangOptions' {
    interface LangOptions {
        breadcrumbsToLabel?: string;
        mainBreadcrumb?: string;
    }
}
declare module '../Series/Treemap/TreemapSeriesOptions' {
    interface TreemapSeriesOptions {
        breadcrumbs?: Breadcrumbs.BreadcrumbsOptions;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DrilldownOptions {
            breadcrumbs?: Breadcrumbs.BreadcrumbsOptions;
        }
        class Breadcrumbs {
            public constructor(
                chart: Chart,
                userOptions?: DeepPartial<Breadcrumbs.BreadcrumbsOptions>
            );
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
        breadcrumbsToLabel: '&#8592',

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
         * Them for button.
         *
         * @type {Highcharts.SVGAttributes}
         */
        buttonTheme: {
            /** @ignore */
            height: 18,
            /** @ignore */
            padding: 2,
            /** @ignore */
            zIndex: 7
        },

        /**
         * The default padding for each button and separator in each direction.
         *
         * @type      {number}
         * @since     next
         */
        buttonSpacing: 5,

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
        floating: false,

        /**
         * A format string for the breadcrumbs button.
         * Variables are enclosed by curly brackets.
         * Available values are passed in the declared point options.
         *
         * @type      {string|undefined}
         * @since     next
         * @default   undefined
         * @sample {highcharts} highcharts/breadcrumbs/format
         *          Display custom values in breadcrumb button.
         */
        format: void 0 as any,

        /**
         * Callback function to format the breadcrumb text from scratch.
         *
         * @type      {Highcharts.BreadcrumbsFormatterCallbackFunction}
         * @since     next
         * @apioption breadcrumbs.formatter
         */

        /**
         * What box to align the button to. Can be either `plotBox` or
         * `spacingBox`.
         *
         * @type       {Highcharts.ButtonRelativeToValue}
         * @default    plotBox
         * @since      3.0.8
         * @product    highcharts highmaps
         * @apioption  drilldown.breadcrumbs.relativeTo
         */
        relativeTo: 'plotBox',

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

    public group: SVGElement = void 0 as any;
    public list: Array<Breadcrumbs.BreadcrumbOptions> = [];
    public chart: Chart;
    public isDirty: boolean = true;
    public level: number = 0;
    public options: Breadcrumbs.BreadcrumbsOptions = void 0 as any;
    public series?: TreemapSeries = void 0 as any;

    public constructor(chart: Chart, userOptions?: Partial<Breadcrumbs.BreadcrumbsOptions>) {
        const chartOptions = merge(
            chart.options.drilldown &&
                chart.options.drilldown.drillUpButton,
            Breadcrumbs.defaultBreadcrumbsOptions,
            chart.userOptions.drilldown &&
            chart.userOptions.drilldown.drillUpButton,
            userOptions
        );

        this.chart = chart;
        this.options = chartOptions || {};
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
        this.level = drilldownLevels && drilldownLevels[drilldownLevels.length - 1] &&
        drilldownLevels[drilldownLevels.length - 1].levelNumber + 1 || 0;
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
     * @return {any}
     *        Formatted text.
     */
    public createList(this: Breadcrumbs): any {
        const list: Array<Breadcrumbs.BreadcrumbOptions> = this.list || [],
            chart = this.chart,
            drilldownLevels = chart.drilldownLevels;

        // The list is based on drilldown levels from the chart object
        if (drilldownLevels && drilldownLevels.length) {
            // Add the initial series as the first element.
            if (!list[0]) {
                list.push({
                    level: 0,
                    levelOptions: drilldownLevels[0].seriesOptions
                });
            }

            const lastBreadcrumb = list[list.length - 1];

            drilldownLevels.forEach(function (level): void {
                // If level is already added to breadcrumbs list,
                // don't add it again- drilling categories
                // + 1 because of the wrong levels numeration
                // in drilldownLevels array.
                if (level.levelNumber + 1 > lastBreadcrumb.level) {
                    list.push({
                        level: level.levelNumber + 1,
                        levelOptions: level.pointOptions
                    });
                }
            });
        }
        return list;
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
    public destroyGroup(this: Breadcrumbs, redraw?: boolean): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options;

        // The full path of buttons is visible.
        if (breadcrumbsOptions.showFullPath && breadcrumbs.group) {
            // Clear the breadcrums list array.
            this.group.destroy();
            this.group = void 0 as any;
        } else if (
            chart.drillUpButton
        ) {
            chart.drillUpButton.destroy();
            chart.drillUpButton = void 0;
        }

        list.length = 0;

        if (redraw) {
            chart.redraw();
        }
    }

    /**
     * Default button text formatter.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#getButtonText
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} breadcrumb
     *        Breadcrumb.
     * @return {string}
     *         Formatted text.
     */
    public getButtonText(this: Breadcrumbs, breadcrumb: Breadcrumbs.BreadcrumbOptions): string {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsOptions = breadcrumbs.options,
            lang = chart.options.lang,
            textFormat = pick(breadcrumbsOptions.format,
                breadcrumbsOptions.showFullPath ? '{level.name}' : '← {level.name}'
            );
        let returnText = breadcrumbsOptions.formatter &&
            breadcrumbsOptions.formatter(breadcrumb) ||
                format(textFormat, { level: breadcrumb.levelOptions }, chart) || '';

        if (returnText === '← ' && lang && lang.mainBreadcrumb) {
            returnText = !breadcrumbsOptions.showFullPath ? '← ' + lang.mainBreadcrumb : lang.mainBreadcrumb;
        }
        return returnText;
    }

    /**
     * Perform the drillUp action.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#jumpUp
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public jumpUp(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart;

        if (this.series && this.series.drillUp) {
            this.series.drillUp();
        } else {
            chart.drillUp();
            breadcrumbs.calculateLevel();
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
     * @param {Highcharts.Breadcrumbs} level
     *        The level to which we want to jump to
     */
    public jumpTo(this: Breadcrumbs, level: number): void {

        // If defined, new level is a current level - jumps amount
        // If not defined, new level is usually 0 - the first level in list.
        const jumpsNumber = defined(level) ?
            this.level - level :
            this.level;

        if (this.options.showFullPath) {
            for (let i = 0; i < jumpsNumber; i++) {
                this.jumpUp();
            }
        } else {
            this.jumpUp();
        }

        if (!this.level) {
            this.destroyGroup(true);
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
        if (this.isDirty) {
            this.render();
        }

        if (this.group && this.level) {
            this.group.align();
        }

        this.isDirty = false;
    }

    /**
     * Update list after the drillUp.
     *
     * @requires  modules/breadcrums
     *
     * @function Highcharts.Breadcrumbs#updateBreadcrumbsList
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public updateBreadcrumbsList(this: Breadcrumbs): void {
        const list = this.list;
        if (this.options.showFullPath) {
            // last breadcrumb
            const lastB = list[this.level];
            if (lastB) {
                const button = lastB.button,
                    separator = lastB.separator,
                    prevSeparator = list[this.level - 1] &&
                    list[this.level - 1].separator;

                // Remove separator from the previous button.
                if (prevSeparator) {
                    prevSeparator.destroy();
                    delete list[this.level - 1].separator;
                }

                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                delete lastB.button;

                separator && separator.destroy();
                delete lastB.separator;

            }

        } else {
            this.level -= 1;
            this.updateSingleButton();
        }
        list.pop();
        // if after removing the item list is empty, destroy the group
        if (!this.level) {
            this.destroyGroup(true);
        }
    }

    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#render
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public render(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options;

        // A main group for the breadcrumbs.
        if (!breadcrumbs.group && breadcrumbsOptions) {
            breadcrumbs.group = chart.renderer
                .g('breadcrumbs-group')
                .addClass('highcharts-no-tooltip highcharts-breadcrumbs')
                .attr({
                    zIndex: breadcrumbsOptions.zIndex
                })
                .add();
        }

        // Draw breadcrumbs.
        if (list) {
            if (breadcrumbsOptions.showFullPath) {
                this.renderFullPathButtons();
            } else {
                this.renderSingleButton();
            }
        }

        this.alignBreadcrumbsGroup();
    }

    /**
     * Draw breadcrumbs together with the separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#renderFullPathButtons
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public renderFullPathButtons(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options,
            // last breadcrumb that was rendered.
            lastBreadcrumb = list[this.level - 1] &&
            list[this.level - 1].button,
            buttonSpacing = breadcrumbsOptions.buttonSpacing;

        // Draw breadcrumbs.
        if (breadcrumbs.group && list) {

            // Make sure that only one type of button is visible.
            if (chart.drillUpButton) {
                chart.drillUpButton.destroy();
                chart.drillUpButton = void 0;
            }

            // Inital position for calculating the breadcrumbs group.
            let posX: number = lastBreadcrumb ? (lastBreadcrumb.x || 0) +
                    lastBreadcrumb.getBBox().width + buttonSpacing : 0;

            const posY: number = buttonSpacing;
            list.forEach(function (breadcrumb, index): void {
                const breadcrumbButton = breadcrumb.button,
                    separatorElement = breadcrumb.separator;

                // Render a button.
                if (!breadcrumbButton) {
                    const button = breadcrumbs.renderButton(breadcrumb, posX, posY);
                    breadcrumb.button = button;
                    posX += button ? button.getBBox().width + buttonSpacing : 0;
                }

                // Render a separator.
                if (!separatorElement && index !== list.length - 1) {
                    const separator = breadcrumbs.renderSeparator(posX, posY);

                    breadcrumb.separator = separator;
                    posX += separator ? separator.getBBox().width + buttonSpacing : 0;
                }
            });
        }
    }

    /**
     * Render Single button - when showFullPath is not used
     * The button is similar to the old drillUpButton
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#renderSingleButton
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public renderSingleButton(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options,
            lastBreadcrumb = list[list.length - 2] &&
            list[list.length - 2].button,
            buttonSpacing = breadcrumbsOptions.buttonSpacing;

        // Draw breadcrumbs.
        if (list) {
            // Inital position for calculating the breadcrumbs group.
            const posX: number = lastBreadcrumb ? (lastBreadcrumb.x || 0) +
                lastBreadcrumb.getBBox().width + buttonSpacing : 0,
                posY: number = buttonSpacing;


            const previousBreadcrumb = list[list.length - 2],
                drilldownLevels = chart.drilldownLevels;

            if (!chart.drillUpButton &&
                (
                    (drilldownLevels && drilldownLevels.length) ||
                    this.level > 0
                )
            ) {
                chart.drillUpButton = breadcrumbs.renderButton(previousBreadcrumb, posX, posY);
            } else if (chart.drillUpButton) {
                // Update button.
                this.updateSingleButton();
            }
        }
    }

    /**
     * Update group position based on align and it's width.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#renderSingleButton
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public alignBreadcrumbsGroup(this: Breadcrumbs): void {
        const breadcrumbs = this,
            breadcrumbsOptions = breadcrumbs.options,
            buttonTheme = breadcrumbsOptions.buttonTheme,
            positionOptions = breadcrumbsOptions.position,
            alignTo = (
                breadcrumbsOptions.relativeTo === 'chart' ||
                breadcrumbsOptions.relativeTo === 'spacingBox' ?
                    null :
                    'scrollablePlotBox'
            ),
            bBox = breadcrumbs.group.getBBox(),
            additionalSpace = 2 * (buttonTheme.padding || 0) +
            breadcrumbsOptions.buttonSpacing,
            width = bBox.width + additionalSpace,
            height = bBox.height + additionalSpace;

        breadcrumbs.group.align(
            merge(
                positionOptions,
                {
                    width: width,
                    height: height
                }
            ),
            true,
            alignTo as string
        );
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
        breadcrumb: Breadcrumbs.BreadcrumbOptions,
        posX: number, posY: number): SVGElement|undefined {
        const breadcrumbs = this,
            chart = this.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options;

        if (breadcrumbsOptions && breadcrumb && breadcrumb.levelOptions) {
            const button: SVGElement = chart.renderer.button(
                breadcrumbs.getButtonText(breadcrumb),
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
                        (
                            (list[list.length - 1].levelOptions as PointOptions).name &&
                            (list[list.length - 1].levelOptions as PointOptions).name !== button.textStr
                        ) &&
                        breadcrumbsOptions.showFullPath
                    ) {
                        breadcrumbs.jumpTo(breadcrumb.level);
                    }

                    if (callDefaultEvent !== false && !breadcrumbsOptions.showFullPath) {
                        breadcrumbs.jumpTo(1);
                    }
                })
                .attr(
                    breadcrumbsOptions.buttonTheme
                )
                .addClass('highcharts-breadcrumbs-button')
                .add(breadcrumbs.group);

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
            lang = chart.options.lang,
            separatorOptions = breadcrumbsOptions.separator;

        let separator;

        if (separatorOptions && lang && lang.breadcrumbsToLabel) {
            separator = chart.renderer.label(
                lang.breadcrumbsToLabel,
                posX,
                posY,
                void 0 as any,
                void 0 as any,
                void 0 as any,
                true
            ).addClass('highcharts-breadcrumbs-separator')
                .add(breadcrumbs.group);

            if (!chart.styledMode) {
                separator.css({
                    align: 'middle',
                    fill: 'white',
                    lineWidth: 1,
                    stroke: 'black'
                });
            }
        }

        return separator;
    }

    /**
     * Set breadcrumbs list.
     * @function Highcharts.Breadcrumbs#setList
     *
     * @requires  modules/breadcrumbs
     *
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.BreadcrumbsOptions} list
     *        Breadcrumbs class.
     */
    public setList(
        this: Breadcrumbs,
        list: Array<Breadcrumbs.BreadcrumbOptions>
    ): void {

        this.list = list;
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
    public update(
        this: Breadcrumbs,
        options: DeepPartial<Breadcrumbs.BreadcrumbsOptions>,
        redraw: boolean = true
    ): void {
        merge(true, this.options, options);

        if (redraw) {
            this.destroyGroup(true);
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
            breadcrumbsList = this.list,
            currentBreadcrumb = breadcrumbsList[this.level - 1],
            lang = chart.options.lang;
        if (chart.drillUpButton && breadcrumbsOptions && lang && currentBreadcrumb) {
            chart.drillUpButton.attr({
                text: this.getButtonText(currentBreadcrumb)
            });
        }
    }

}

/* eslint-disable no-invalid-this */

if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs as typeof Breadcrumbs;

    addEvent(Chart, 'getMargins', function (): void {
        const breadcrumbs = this.breadcrumbs;

        if (
            breadcrumbs &&
            !breadcrumbs.options.floating &&
            breadcrumbs.level
        ) {
            const breadcrumbsOptions = breadcrumbs.options,
                buttonTheme = breadcrumbsOptions.buttonTheme,
                breadcrumbsHeight = (buttonTheme.height || 0) +
                    2 * (buttonTheme.padding || 0) + breadcrumbsOptions.buttonSpacing,
                verticalAlign = breadcrumbsOptions.position.verticalAlign;

            if (verticalAlign === 'bottom') {
                this.marginBottom = (this.marginBottom || 0) + breadcrumbsHeight;
            } else if (verticalAlign !== 'middle') {
                this.plotTop += breadcrumbsHeight;
            }
        }
    });

    addEvent(Chart, 'update', function (e: any): void {
        const breadcrumbs = this.breadcrumbs,
            breadcrumbOptions = e.options.drilldown && e.options.drilldown.breadcrumbs;

        if (breadcrumbs && breadcrumbOptions) {

            breadcrumbs.isDirty = true;
            breadcrumbs.update(e.options.drilldown.breadcrumbs, false);
            breadcrumbs.redraw();
        }
    });

    addEvent(Chart, 'redraw', function (): void {
        this.breadcrumbs && this.breadcrumbs.redraw();
    });

    addEvent(Chart, 'beforeDrillUp', function (): void {
        if (this.breadcrumbs) {
            this.breadcrumbs.isDirty = true;
            this.breadcrumbs.updateBreadcrumbsList();
        }
    });

    addEvent(Chart, 'applyDrilldown', function (): void {
        const chart = this,
            breadcrumbs = chart.breadcrumbs,
            drilldownOptions = chart.options.drilldown,
            breadcrumbsOptions = drilldownOptions && drilldownOptions.breadcrumbs;

        if (!breadcrumbs) {
            chart.breadcrumbs = new Breadcrumbs(chart, breadcrumbsOptions);
            chart.breadcrumbs.calculateLevel();
            chart.breadcrumbs.setList(chart.breadcrumbs.createList());
        } else {
            breadcrumbs.calculateLevel();
            breadcrumbs.isDirty = true;
            breadcrumbs.setList(breadcrumbs.createList());
            breadcrumbs.redraw();
        }

    });

    let treemapEventsAdded: boolean = false;

    // Causes some troubles in karma tests.
    addEvent(Chart, 'init', function (): void {
        if (H.seriesTypes.treemap && !treemapEventsAdded) {

            addEvent(H.seriesTypes.treemap, 'setRootNode',
                function (this: TreemapSeries, e: TreemapSeries.SetRootNodeObject): void {
                    const chart = this.chart,
                        breadcrumbsOptions = merge(this.options.drillUpButton, this.options.breadcrumbs);

                    if (!chart.breadcrumbs) {
                        chart.breadcrumbs = new Breadcrumbs(chart as Chart, breadcrumbsOptions);
                        chart.breadcrumbs.series = this;
                        this.level = 0;
                    }
                    chart.breadcrumbs.isDirty = true;
                    // Create a list using the event after drilldown.
                    if ((e as any).trigger === 'click' || !(e as any).trigger) {
                        this.level = (this.level || 0) + 1;
                        chart.breadcrumbs.setList(this.createLevelList(e));
                        this.calculateLevel();
                    }

                    if ((e as any).trigger === 'traverseUpButton') {
                        this.level = (this.level || 0) - 1;
                        this.calculateLevel();
                        chart.breadcrumbs.redraw();
                        this.updateBreadcrumbsList();
                        chart.breadcrumbs.isDirty = true;
                    }
                });
            addEvent(H.seriesTypes.treemap, 'update', function (e: any): void {
                const breadcrumbs = this.chart.breadcrumbs;

                if (breadcrumbs && e.options.breadcrumbs) {
                    breadcrumbs.isDirty = true;
                    breadcrumbs.update(e.options.breadcrumbs, false);
                    breadcrumbs.redraw();
                }
            });
            treemapEventsAdded = true;
        }
    });

    // Remove resize/afterSetExtremes at chart destroy
    addEvent(Chart, 'destroy', function destroyEvents(): void {
        if (this.breadcrumbs) {
            this.breadcrumbs.destroyGroup(true);
            this.breadcrumbs = void 0 as Breadcrumbs|undefined;
        }
    });
}

/* *
 *
 *  Prototype Properties
 *
 * */

namespace Breadcrumbs {
    export interface BreadcrumbsOptions {
        buttonTheme: SVGAttributes;
        buttonSpacing: number;
        events?: BreadcrumbsButtonsEventsOptions;
        floating: boolean;
        format?: string;
        formatter?: BreadcrumbsButtonsFormatter;
        relativeTo?: ButtonRelativeToValue;
        position: BreadcrumbsAlignOptions;
        separator: SeparatorOptions;
        showFullPath: boolean;
        style: CSSObject;
        useHTML: boolean;
        zIndex: number;
    }

    export type BreadcrumbOptions = {
        level: number,
        levelOptions: SeriesOptions|PointOptions|PointShortOptions,
        button?: SVGElement,
        separator?: SVGElement
    };
    export interface BreadcrumbsAlignOptions {
        align: AlignValue;
        verticalAlign: VerticalAlignValue;
        x: number;
        y: number;
    }
    export interface BreadcrumbsClickCallbackFunction {
        (e: Event, breadcrumbs: Breadcrumbs): (boolean|undefined);
    }
    export interface BreadcrumbsButtonsEventsOptions {
        click?: BreadcrumbsClickCallbackFunction;
    }
    export interface BreadcrumbsButtonsFormatter {
        (
            breadcrumb: BreadcrumbOptions
        ): (string);
    }
    export interface SeparatorOptions {
        symbol?: string;
        size?: number;
    }
}


/* *
 *
 *  Default Export
 *
 * */

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
