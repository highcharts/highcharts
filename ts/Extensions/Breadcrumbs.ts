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
import type ButtonThemeObject from '../Core/Renderer/SVG/ButtonThemeObject';
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
    pick,
    defined,
    isString
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
declare module '../Extensions/Exporting/NavigationOptions' {
    interface NavigationOptions {
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
            yOffset?: number;
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
         * @since 10.0.0
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
     * Options for breadcrumbs. Breadcrumbs general options are defined in
     * `navigation.breadcrumbs`. Specific options for drilldown are set in
     * `drilldown.breadcrumbs` and for tree-like series traversing, in
     * `plotOptions[series].breadcrumbs`.
     *
     * @since 10.0.0
     * @product highcharts
     * @optionparent navigation.breadcrumbs
     */
    public static defaultBreadcrumbsOptions = {
        /**
         * A collection of attributes for the buttons. The object takes SVG
         * attributes like `fill`, `stroke`, `stroke-width`, as well as `style`,
         * a collection of CSS properties for the text.
         *
         * The object can also be extended with states, so you can set
         * presentational options for `hover`, `select` or `disabled` button
         * states.
         *
         * @sample {highcharts} highcharts/breadcrumbs/single-button
         *         Themed, single button
         *
         * @type       {Highcharts.SVGAttributes}
         * @since 10.0.0
         * @product    highcharts
         */
        buttonTheme: {
            /** @ignore */
            fill: 'none',
            /** @ignore */
            height: 18,
            /** @ignore */
            padding: 2,
            /** @ignore */
            'stroke-width': 0,
            /** @ignore */
            zIndex: 7,
            /** @ignore */
            states: {
                select: {
                    fill: 'none'
                }
            },
            style: {
                color: Palette.highlightColor80
            }
        },

        /**
         * The default padding for each button and separator in each direction.
         *
         * @type      {number}
         * @since 10.0.0
         */
        buttonSpacing: 5,

        /**
         * Fires when clicking on the breadcrumbs button. Two arguments are
         * passed to the function. First breadcrumb button as an SVG element.
         * Second is the breadcrumbs class, containing reference to the chart,
         * series etc.
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
         * @since 10.0.0
         * @apioption navigation.breadcrumbs.events.click
         */

        /**
         * When the breadcrumbs are floating, the plot area will not move to
         * make space for it. By default, the chart will not make space for the
         * buttons. This property won't work when positioned in the middle.
         *
         * @sample highcharts/breadcrumbs/single-button
         *         Floating button
         * @type      {boolean}
         * @since 10.0.0
         */
        floating: false,

        /**
         * A format string for the breadcrumbs button. Variables are enclosed by
         * curly brackets. Available values are passed in the declared point
         * options.
         *
         * @type      {string|undefined}
         * @since 10.0.0
         * @default   undefined
         * @sample {highcharts} highcharts/breadcrumbs/format Display custom
         *          values in breadcrumb button.
         */
        format: void 0,

        /**
         * Callback function to format the breadcrumb text from scratch.
         *
         * @type      {Highcharts.BreadcrumbsFormatterCallbackFunction}
         * @since 10.0.0
         * @default   undefined
         * @apioption navigation.breadcrumbs.formatter
         */

        /**
         * What box to align the button to. Can be either `plotBox` or
         * `spacingBox`.
         *
         * @type       {Highcharts.ButtonRelativeToValue}
         * @default    plotBox
         * @since 10.0.0
         * @product    highcharts highmaps
         */
        relativeTo: 'plotBox',

        /**
         * Positioning for the button row. The breadcrumbs buttons will be
         * aligned properly for the default chart layout (title,  subtitle,
         * legend, range selector) for the custom chart layout set the position
         * properties.
         * @type       {Highcharts.BreadcrumbsAlignOptions}
         * @since 10.0.0
         * @product    highcharts highmaps
         * @sample     {highcharts} highcharts/breadcrumbs/single-button
         *             Single, right aligned button
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
             * The Y offset of the breadcrumbs button group. When `undefined`,
             * and `floating` is `false`, the `y` position is adapted so that
             * the breadcrumbs are rendered outside the target area.
             *
             * @type {number|undefined}
             */
            y: void 0
        },

        /**
         * Options object for Breadcrumbs separator.
         *
         * @since 10.0.0
         */
        separator: {
            /**
             * @type {string}
             * @since 10.0.0
             * @product highcharts
             */
            text: '/',
            /**
             * CSS styles for the breadcrumbs separator.
             *
             * In styled mode, the breadcrumbs separators are styled by the
             * `.highcharts-separator` rule with its different states.
             *  @type {Highcharts.CSSObject}
             *  @since 10.0.0
             */
            style: {
                color: Palette.neutralColor60
            }
        },

        /**
         * Show full path or only a single button.
         *
         * @type      {boolean}
         * @since 10.0.0
         * @sample {highcharts} highcharts/breadcrumbs/single-button
         *          Single, styled button
         */
        showFullPath: true,

        /**
         * CSS styles for all breadcrumbs.
         *
         * In styled mode, the breadcrumbs buttons are styled by the
         * `.highcharts-breadcrumbs-buttons .highcharts-button` rule with its
         * different states.
         *  @type {Highcharts.SVGAttributes}
         *  @since 10.0.0
         */
        style: {},

        /**
         * Whether to use HTML to render the breadcrumbs items texts.
         *
         * @type      {boolean}
         * @since 10.0.0
         */
        useHTML: false,

        /**
         * The z index of the breadcrumbs group.
         *
         * @type      {number}
         * @since 10.0.0
         */
        zIndex: 7
    };

    /* *
     *
     * Properties
     *
     * */

    public group?: SVGElement = void 0;
    public list: Array<Breadcrumbs.BreadcrumbOptions> = [];
    public elementList: { [x: string]: Breadcrumbs.BreadcrumbElement } = {};
    public chart: Chart;
    public isDirty: boolean = true;
    public level: number = 0;
    public options: Breadcrumbs.BreadcrumbsOptions = void 0 as any;
    public yOffset?: number;

    public constructor(chart: Chart, userOptions?: Partial<Breadcrumbs.BreadcrumbsOptions>) {
        const chartOptions = merge(
            chart.options.drilldown &&
                chart.options.drilldown.drillUpButton,
            Breadcrumbs.defaultBreadcrumbsOptions,
            chart.options.navigation && chart.options.navigation.breadcrumbs,
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
    public updateProperties(
        list: Array<Breadcrumbs.BreadcrumbOptions>
    ): void {
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
    public setLevel(): void {
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
    public getLevel(): number {
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
        breadcrumb: Breadcrumbs.BreadcrumbOptions
    ): string {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsOptions = breadcrumbs.options,
            lang = chart.options.lang,
            textFormat = pick(breadcrumbsOptions.format,
                breadcrumbsOptions.showFullPath ?
                    '{level.name}' : '← {level.name}'
            ),
            defaultText = lang && pick(
                lang.drillUpText,
                lang.mainBreadcrumb
            );
        let returnText = breadcrumbsOptions.formatter &&
            breadcrumbsOptions.formatter(breadcrumb) ||
                format(
                    textFormat,
                    { level: breadcrumb.levelOptions },
                    chart
                ) || '';

        if (
            (
                (
                    isString(returnText) &&
                    !returnText.length
                ) ||
                returnText === '← '
            ) &&
            defined(defaultText)
        ) {
            returnText = !breadcrumbsOptions.showFullPath ?
                '← ' + defaultText :
                defaultText;
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
    public redraw(): void {
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
    public render(): void {

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
    public renderFullPathButtons(): void {
        // Make sure that only one type of button is visible.
        this.destroySingleButton();

        this.resetElementListState();

        this.updateListElements();

        this.destroyListElements();
    }

    /**
     * Render Single button - when showFullPath is not used. The button is
     * similar to the old drillUpButton
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#renderSingleButton
     * @param {Highcharts.Breadcrumbs} this Breadcrumbs class.
     */
    public renderSingleButton(): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            list = breadcrumbs.list,
            breadcrumbsOptions = breadcrumbs.options,
            buttonSpacing = breadcrumbsOptions.buttonSpacing;

        // Make sure that only one type of button is visible.
        this.destroyListElements();

        // Draw breadcrumbs. Inital position for calculating the breadcrumbs
        // group.
        const posX: number = breadcrumbs.group ?
                breadcrumbs.group.getBBox().width :
                buttonSpacing,
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
    public alignBreadcrumbsGroup(xOffset?: number): void {
        const breadcrumbs = this;
        if (breadcrumbs.group) {
            const breadcrumbsOptions = breadcrumbs.options,
                buttonTheme = breadcrumbsOptions.buttonTheme,
                positionOptions = breadcrumbsOptions.position,
                alignTo = (
                    breadcrumbsOptions.relativeTo === 'chart' ||
                    breadcrumbsOptions.relativeTo === 'spacingBox' ?
                        void 0 :
                        'scrollablePlotBox'
                ),
                bBox = breadcrumbs.group.getBBox(),
                additionalSpace = 2 * (buttonTheme.padding || 0) +
                breadcrumbsOptions.buttonSpacing;

            // Store positionOptions
            positionOptions.width = bBox.width + additionalSpace;
            positionOptions.height = bBox.height + additionalSpace;

            const newPositions = merge(positionOptions);

            // Add x offset if specified.
            if (xOffset) {
                newPositions.x += xOffset;
            }

            newPositions.y = pick(newPositions.y, this.yOffset, 0);

            breadcrumbs.group.align(
                newPositions,
                true,
                alignTo
            );
        }
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
        breadcrumb: Breadcrumbs.BreadcrumbOptions,
        posX: number,
        posY: number
    ): SVGElement {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = breadcrumbs.options,
            buttonTheme = merge(breadcrumbsOptions.buttonTheme);

        const button: SVGElement = chart.renderer
            .button(
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
                        // For single button we are not going to the button
                        // level, but the one level up
                        if (!breadcrumbsOptions.showFullPath) {
                            e.newLevel = breadcrumbs.level - 1;
                        } else {
                            e.newLevel = breadcrumb.level;
                        }
                        fireEvent(breadcrumbs, 'up', e);
                    }
                },
                buttonTheme
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
                void 0,
                void 0,
                void 0,
                false
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
    public updateSingleButton(): void {
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
    public destroy(): void {

        this.destroySingleButton();

        // Destroy elements one by one. It's necessary beacause
        // g().destroy() does not remove added HTML
        this.destroyListElements(true);

        // Then, destroy the group itself.
        if (this.group) {
            this.group.destroy();
        }
        this.group = void 0;

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
    public resetElementListState(): void {
        objectEach(
            this.elementList,
            (element): void => {
                element.updated = false;
            }
        );
    }

    /**
     * Update rendered elements inside the elementList.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#updateListElements
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public updateListElements(): void {
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
        let posX = breadcrumbs.group ?
                updateXPosition(breadcrumbs.group, buttonSpacing) :
                buttonSpacing,
            posY = buttonSpacing,
            currentBreadcrumb;

        list.forEach(function (breadcrumb, index): void {
            const isLast: boolean = index === list.length - 1;

            let button: SVGElement|undefined,
                separator: SVGElement | undefined;

            if (elementList[breadcrumb.level]) {
                currentBreadcrumb = elementList[breadcrumb.level];
                button = currentBreadcrumb.button;

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

            if (button) {
                button.setState(isLast ? 2 : 0);
            }
        });
    }
}

/* eslint-disable no-invalid-this */

if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs as typeof Breadcrumbs;

    // Logic for making space for the buttons above the plot area
    addEvent(Chart, 'getMargins', function (): void {
        const breadcrumbs = this.breadcrumbs;

        if (
            breadcrumbs &&
            !breadcrumbs.options.floating &&
            breadcrumbs.level
        ) {
            const breadcrumbsOptions = breadcrumbs.options,
                buttonTheme = breadcrumbsOptions.buttonTheme,
                breadcrumbsHeight = (
                    (buttonTheme.height || 0) +
                    2 * (buttonTheme.padding || 0) +
                    breadcrumbsOptions.buttonSpacing
                ),
                verticalAlign = breadcrumbsOptions.position.verticalAlign;

            if (verticalAlign === 'bottom') {
                this.marginBottom = (
                    this.marginBottom || 0
                ) + breadcrumbsHeight;
                breadcrumbs.yOffset = breadcrumbsHeight;
            } else if (verticalAlign !== 'middle') {
                this.plotTop += breadcrumbsHeight;
                breadcrumbs.yOffset = -breadcrumbsHeight;
            } else {
                breadcrumbs.yOffset = void 0;
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

    // Shift the drillUpButton to make the space for resetZoomButton, #8095.
    addEvent(Chart, 'afterShowResetZoom', function (): void {
        const chart = this;
        if (chart.breadcrumbs) {
            const bbox = chart.resetZoomButton &&
                chart.resetZoomButton.getBBox(),
                breadcrumbsOptions = chart.breadcrumbs.options;

            if (
                bbox &&
                breadcrumbsOptions.position.align === 'right' &&
                breadcrumbsOptions.relativeTo === 'plotBox'
            ) {
                chart.breadcrumbs.alignBreadcrumbsGroup(
                    -bbox.width - breadcrumbsOptions.buttonSpacing
                );
            }
        }
    });

    // After zooming out, shift the drillUpButton
    // to the previous position, #8095.
    addEvent(Chart, 'selection', function (event: any): void {
        if (
            event.resetSelection === true &&
            this.breadcrumbs
        ) {
            this.breadcrumbs.alignBreadcrumbsGroup();
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
        buttonTheme: ButtonThemeObject;
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
 * @name Highcharts.BreadcrumbsOptions#buttonTheme
 * @type { SVGAttributes | undefined }
 */

(''); // Keeps doclets above in JS file
