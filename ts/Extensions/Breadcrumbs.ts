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
import { Palette } from '../Core/Color/Palettes.js';
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
    objectEach,
    extend,
    fireEvent,
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
            chart: Chart;
            level: number;
            isDirty: boolean;
            getLevel(
                this: Breadcrumbs
            ): number;
            setList(
                this: Breadcrumbs,
                list: Array<Breadcrumbs.BreadcrumbOptions>
            ): void;
            setLevel(
                this: Breadcrumbs,
            ): void;
            updateProperties(
                this: Breadcrumbs,
                list: Array<Breadcrumbs.BreadcrumbOptions>
            ): void;
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
 * @private
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
         * Theme for button.
         * @type       {Highcharts.SVGAttributes}
         * @since      next
         * @product    highcharts
         * @apioption  drilldown.breadcrumbs.theme
         */
        theme: {
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
        format: void 0,

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
         * @since      next
         * @product    highcharts highmaps
         * @apioption  drilldown.breadcrumbs.relativeTo
         */
        relativeTo: 'plotBox',

        /**
         * Positioning for the button row. The breadcrumbs buttons
         * will be aligned properly for the default chart layout
         * (title,  subtitle, legend, range selector) for the custom chart
         * layout set the position properties.
         * @type       {Highcharts.BreadcrumbsAlignOptions}
         * @since      next
         * @product    highcharts highmaps
         * @sample {highcharts} highcharts/breadcrumbs/position
         *         Custom button positioning.
         * @apioption  drilldown.breadcrumbs.position
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
             *
             * @type {number}
             */
            x: 0,

            /**
             * The Y offset of the breadcrumbs button group.
             *
             * @type {number}
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
             * @type      {string}
             * @since    next
             * @product  highcharts
             */
            text: '&#8594',
            /**
             * CSS styles for separator.
             *
             * In styled mode, the breadcrumbs separators are styled by the
             * `.highcharts-separator` rule with its
             * different states.
             *  @type {Highcharts.CSSObject}
             *  @since     next
             */
            style: {
                align: 'middle',
                fill: Palette.backgroundColor,
                lineWidth: 1,
                stroke: Palette.neutralColor100
            }
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
            'fill': Palette.backgroundColor
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
    public elementList: { [x: string]: Breadcrumbs.BreadcrumbElement } = {};
    public chart: Chart;
    public isDirty: boolean = true;
    public level: number = 0;
    public options: Breadcrumbs.BreadcrumbsOptions = void 0 as any;
    public series?: TreemapSeries = void 0 as any;
    public plotX: number = 0;
    public plotY: number = 0;

    // TO DO move merge with drillupbutton upper in chain
    public constructor(chart: Chart, userOptions?: Partial<Breadcrumbs.BreadcrumbsOptions>) {
        const chartOptions = merge(
            chart.options.drilldown &&
                chart.options.drilldown.drillUpButton,
            Breadcrumbs.defaultBreadcrumbsOptions,
            userOptions
        );

        this.chart = chart;
        this.options = chartOptions || {};
    }

    /**
     * Update Breadcrumbs properties, like level and list.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#updateProperties
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public updateProperties(this: Breadcrumbs, list: Array<Breadcrumbs.BreadcrumbOptions>): void {
        this.setList(list);
        this.setLevel();
        this.isDirty = true;
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
     *        Breadcrumbs list.
     */
    public setList(
        this: Breadcrumbs,
        list: Array<Breadcrumbs.BreadcrumbOptions>
    ): void {
        this.list = list;
    }

    /**
     * Calcule level on which chart currently is.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#setLevel
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public setLevel(this: Breadcrumbs): void {
        this.level = this.list.length && this.list.length - 1;
    }

    /**
     * Get Breadcrumbs level
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#getLevel
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public getLevel(this: Breadcrumbs): number {
        return this.level;
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
    public getButtonText(
        this: Breadcrumbs,
        breadcrumb: Breadcrumbs.BreadcrumbOptions
    ): string {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsOptions = breadcrumbs.options,
            lang = chart.options.lang,
            textFormat = pick(breadcrumbsOptions.format,
                breadcrumbsOptions.showFullPath ?
                    '{level.name}' : '← {level.name}'
            );
        let returnText = breadcrumbsOptions.formatter &&
            breadcrumbsOptions.formatter(breadcrumb) ||
                format(
                    textFormat,
                    { level: breadcrumb.levelOptions },
                    chart
                ) || '';

        if (returnText === '← ' && lang && lang.mainBreadcrumb) {
            returnText = !breadcrumbsOptions.showFullPath ?
                '← ' + lang.mainBreadcrumb :
                lang.mainBreadcrumb;
        }
        return returnText;
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

        if (this.group) {
            this.group.align();
        }

        this.isDirty = false;
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
        if (breadcrumbsOptions.showFullPath) {
            this.renderFullPathButtons();
        } else {
            this.renderSingleButton();
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
        // Make sure that only one type of button is visible.
        this.destroySingleButton();

        this.resetElementListState();

        this.updateListElements();

        this.destroyListElements();
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
            buttonSpacing = breadcrumbsOptions.buttonSpacing;

        // Make sure that only one type of button is visible.
        this.destroyListElements();

        // Draw breadcrumbs.
        // Inital position for calculating the breadcrumbs group.
        const posX: number = breadcrumbs.group.getBBox().width || 0,
            posY: number = buttonSpacing;

        const previousBreadcrumb = list[list.length - 2];

        if (!chart.drillUpButton && (this.level > 0)) {
            chart.drillUpButton = breadcrumbs.renderButton(
                previousBreadcrumb,
                posX,
                posY
            );
        } else if (chart.drillUpButton) {
            if (this.level > 0) {
                // Update button.
                this.updateSingleButton();
            } else {
                this.destroySingleButton();
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
            theme = breadcrumbsOptions.theme,
            positionOptions = breadcrumbsOptions.position,
            alignTo = (
                breadcrumbsOptions.relativeTo === 'chart' ||
                breadcrumbsOptions.relativeTo === 'spacingBox' ?
                    void 0 :
                    'scrollablePlotBox'
            ),
            bBox = breadcrumbs.group.getBBox(),
            additionalSpace = 2 * (theme.padding || 0) +
            breadcrumbsOptions.buttonSpacing;

        // Store positionOptions
        positionOptions.width = bBox.width + additionalSpace;
        positionOptions.height = bBox.height + additionalSpace;

        breadcrumbs.group.align(
            positionOptions,
            true,
            alignTo
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
    public renderButton(
        this: Breadcrumbs,
        breadcrumb: Breadcrumbs.BreadcrumbOptions,
        posX: number,
        posY: number
    ): SVGElement {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = breadcrumbs.options;

        const button: SVGElement = chart.renderer.button(
            breadcrumbs.getButtonText(breadcrumb),
            posX,
            posY,
            function (e: (Event|any)): void {
                // Extract events from button object and call
                const buttonEvents = breadcrumbsOptions.events &&
                    breadcrumbsOptions.events.click;
                let callDefaultEvent;

                if (buttonEvents) {
                    callDefaultEvent = buttonEvents.call(
                        breadcrumbs,
                        e as any,
                        breadcrumb
                    );
                }

                // (difference in behaviour of showFullPath and drillUp)
                if (callDefaultEvent !== false) {
                    // For single button we are not going to the button level,
                    // but the one level up
                    if (!breadcrumbsOptions.showFullPath) {
                        e.newLevel = breadcrumbs.level - 1;
                    } else {
                        e.newLevel = breadcrumb.level;
                    }
                    fireEvent(breadcrumbs, 'up', e);
                }
            })
            .attr(
                breadcrumbsOptions.theme
            )
            .addClass('highcharts-breadcrumbs-button')
            .add(breadcrumbs.group);

        if (!chart.styledMode) {
            button.attr(breadcrumbsOptions.style as SVGAttributes);
        }
        return button;
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
    public renderSeparator(
        this: Breadcrumbs,
        posX: number,
        posY: number
    ): SVGElement {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = breadcrumbs.options,
            separatorOptions = breadcrumbsOptions.separator;

        const separator = chart.renderer
            .label(
                separatorOptions.text,
                posX,
                posY,
                void 0 as any,
                void 0 as any,
                void 0 as any,
                true
            )
            .addClass('highcharts-breadcrumbs-separator')
            .add(breadcrumbs.group);

        if (!chart.styledMode) {
            separator.css(separatorOptions.style);
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
    public update(
        this: Breadcrumbs,
        options: DeepPartial<Breadcrumbs.BreadcrumbsOptions>
    ): void {
        merge(true, this.options, options);
        this.destroy();
        this.isDirty = true;
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
            currentBreadcrumb = this.list[this.level - 1];

        if (chart.drillUpButton) {
            chart.drillUpButton.attr({
                text: this.getButtonText(currentBreadcrumb)
            });
        }
    }

    /**
     * Destroy the chosen breadcrumbs group
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#destroy
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public destroy(this: Breadcrumbs): void {

        this.destroySingleButton();

        // Destroy elements one by one. It's necessary beacause
        // g().destroy() does not remove added HTML
        this.destroyListElements(true);

        // Clear the breadcrums list array.
        if (this.group) {
            this.group.destroy();
        }
        this.group = void 0 as any;

    }
    /**
     * Destroy the elements' buttons and separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#destroyListElements
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public destroyListElements(
        this: Breadcrumbs,
        force?: boolean
    ): void {
        const elementList = this.elementList;

        objectEach(elementList, (element, level): void => {
            if (
                force ||
                !elementList[level].updated
            ) {
                element = elementList[level];
                element.button && element.button.destroy();
                element.separator && element.separator.destroy();
                delete element.button;
                delete element.separator;
                delete elementList[level];
            }
        });

        if (force) {
            this.elementList = {};
        }
    }

    /**
     * Destroy the single button if exists.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#destroySingleButton
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public destroySingleButton(): void {
        if (this.chart.drillUpButton) {
            this.chart.drillUpButton.destroy();
            this.chart.drillUpButton = void 0;
        }
    }
    /**
     * Reset state for all buttons in elementList.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#resetElementListState
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public resetElementListState(
        this: Breadcrumbs
    ): void {
        objectEach(
            this.elementList,
            (element): void => {
                element.updated = false;
            }
        );
    }

    /**
     * Reset state for all buttons in elementList.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#updateListElements
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public updateListElements(
        this: Breadcrumbs
    ): void {
        const updateXPosition = function (
                element: SVGElement,
                spacing: number
            ): number {
                return element.getBBox().width + spacing;
            },
            breadcrumbs = this,
            elementList = breadcrumbs.elementList,
            buttonSpacing = breadcrumbs.options.buttonSpacing,
            list = breadcrumbs.list;

        // Inital position for calculating the breadcrumbs group.
        let posX: number = updateXPosition(breadcrumbs.group, 0),
            posY: number = buttonSpacing,
            currentBreadcrumb;

        list.forEach(function (breadcrumb, index): void {
            const isLast: boolean = index === list.length - 1;

            let button: SVGElement,
                separator: SVGElement | undefined;

            if (elementList[breadcrumb.level]) {
                currentBreadcrumb = elementList[breadcrumb.level];
                // Render a separator if it was not created before.
                if (
                    !currentBreadcrumb.separator &&
                    !isLast
                ) {
                    // Add spacing for the next separator
                    posX += buttonSpacing;
                    currentBreadcrumb.separator =
                        breadcrumbs.renderSeparator(posX, posY);
                    posX += updateXPosition(
                        currentBreadcrumb.separator,
                        buttonSpacing
                    );
                } else if (
                    currentBreadcrumb.separator &&
                    isLast
                ) {
                    currentBreadcrumb.separator.destroy();
                    delete currentBreadcrumb.separator;
                }
                elementList[breadcrumb.level].updated = true;
            } else {
                // Render a button.
                button = breadcrumbs.renderButton(breadcrumb, posX, posY);
                posX += updateXPosition(button, buttonSpacing);

                // Render a separator.
                if (!isLast) {
                    separator = breadcrumbs.renderSeparator(posX, posY);
                    posX += updateXPosition(separator, buttonSpacing);
                }
                elementList[breadcrumb.level] = {
                    button,
                    separator,
                    updated: true
                };
            }
        });
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
                theme = breadcrumbsOptions.theme,
                breadcrumbsHeight = (theme.height || 0) +
                    2 * (theme.padding || 0) + breadcrumbsOptions.buttonSpacing,
                verticalAlign = breadcrumbsOptions.position.verticalAlign;

            if (verticalAlign === 'bottom') {
                this.marginBottom = (
                    this.marginBottom || 0
                ) + breadcrumbsHeight;
            } else if (verticalAlign !== 'middle') {
                this.plotTop += breadcrumbsHeight;
            }
        }
    });

    addEvent(Chart, 'redraw', function (): void {
        this.breadcrumbs && this.breadcrumbs.redraw();
    });

    // Remove resize/afterSetExtremes at chart destroy
    addEvent(Chart, 'destroy', function destroyEvents(): void {
        if (this.breadcrumbs) {
            this.breadcrumbs.destroy();
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
        theme: SVGAttributes;
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
        plotX?: number;
        plotY?: number;
    }

    export type BreadcrumbOptions = {
        level: number,
        levelOptions: SeriesOptions|PointOptions|PointShortOptions
    };
    export type BreadcrumbElement = {
        button?: SVGElement,
        separator?: SVGElement,
        updated?: boolean
    };
    export interface BreadcrumbsAlignOptions {
        align: AlignValue;
        verticalAlign: VerticalAlignValue;
        x: number;
        y: number;
        width?: number;
        height?: number;
    }
    export interface BreadcrumbsClickCallbackFunction {
        (e: Event, breadcrumb: BreadcrumbOptions): (boolean|undefined);
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
        text: string;
        style: CSSObject
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
 * @param {Highcharts.Event} event
 * Event.
 *
 * @param {Highcharts.BreadcrumbOptions} options
 * Breadcrumb options.
 *
 * @param {global.Event} e
 * Event arguments.
 */

/**
 * Callback function to format the breadcrumb text from scratch.
 *
 * @callback Highcharts.BreadcrumbsFormatterCallbackFunction
 *
 * @param {Highcharts.Event} event
 * Event.
 *
 * @param {Highcharts.BreadcrumbOptions} options
 * Breadcrumb options.
 *
 * @return {string}
 * Formatted text or false
 */

/**
 * Options for the one breadcrumb.
 *
 * @interface Highcharts.BreadcrumbOptions
 */

/**
 * Level connected to a specific breadcrumb.
 * @name Highcharts.BreadcrumbOptions#level
 * @type {number}
 */

/**
 * Options for series or point connected to a specific breadcrumb.
 * @name Highcharts.BreadcrumbOptions#levelOptions
 * @type {SeriesOptions|PointOptionsObject}
 */

/**
 * Options for aligning breadcrumbs group.
 *
 * @interface Highcharts.BreadcrumbsAlignOptions
 */

/**
 * Align of a Breadcrumb group.
 * @default right
 * @name Highcharts.BreadcrumbsAlignOptions#align
 * @type {AlignValue}
 */

/**
 * Vertical align of a Breadcrumb group.
 * @default top
 * @name Highcharts.BreadcrumbsAlignOptions#verticalAlign
 * @type {VerticalAlignValue}
 */

/**
 * X offset of a Breadcrumbs group.
 * @name Highcharts.BreadcrumbsAlignOptions#x
 * @type {number}
 */

/**
 * Y offset of a Breadcrumbs group.
 * @name Highcharts.BreadcrumbsAlignOptions#y
 * @type {number}
 */

/**
 * Options for all breadcrumbs.
 *
 * @interface Highcharts.BreadcrumbsOptions
 */

/**
 * Button theme.
 * @name Highcharts.BreadcrumbsOptions#theme
 * @type {SVGAttributes}
 */

(''); // Keeps doclets above in JS file
