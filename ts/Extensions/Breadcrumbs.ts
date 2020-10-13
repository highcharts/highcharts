/* *
 *
 *  Highcharts Breadcrumbs module
 *
 *  Authors: Grzegorz Blachliński, Karol Kołodziej
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
import O from '../Core/Options.js';
const {
    defaultOptions
} = O;
import U from '../Core/Utilities.js';
const {
    addEvent,
    extend,
    format,
    pick
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface BreadcrumbsOptions {
            enabled?: boolean;
            events?: BreadcrumbsButtonsEventsOptions;
            floating?: boolean;
            format?: string;
            formatter?: BreadcrumbsButtonsFormatter;
            position?: BreadcrumbsAlignOptions;
            separator?: string;
            style?: CSSObject;
            useHTML?: boolean;
        }
        interface BreadcrumbsAlignOptions {
            align?: AlignValue;
            verticalAlign?: VerticalAlignValue;
            alignByTranslate?: boolean;
            x?: number;
            y?: number;
        }
        interface BreadcrumbsClickCallbackFunction {
            (e: Event, breadcrumbs: Breadcrumbs): (boolean|undefined);
        }
        interface BreadcrumbsButtonsEventsOptions {
            click?: BreadcrumbsClickCallbackFunction;
        }
        interface BreadcrumbsButtonsFormatter {
            (breadcrumbs: any): (string);
        }
        interface DrilldownOptions {
            breadcrumbs?: BreadcrumbsOptions;
        }
        interface ChartDrilldownObject {
            breadcrumbs?: Breadcrumbs;
        }
        interface LangOptions {
            mainBreadCrumb?: string;
        }
        class Breadcrumbs {
            public constructor(chart: Chart, userOptions: Highcharts.Options);

            public breadcrumbsGroup: SVGElement;
            public breadcrumbsList: Array<Array<unknown>>
            public chart: Chart;
            public options: BreadcrumbsOptions;

            public alignGroup(): void;
            public createList(): void;
            public destroy(numb: number): void;
            public draw(): void;
            public multipleDrillUp(numb: number): void;
            public init(chart: Chart, userOptions: Highcharts.Options): void;
            public redraw(): void;
            public renderButton(breadcrumb: any, posX: number, posY: number): SVGElement|void;
            public renderSeparator(breadcrumb: any, posX: number, posY: number): SVGElement|void;
            public update(userOptions: Highcharts.Options): void;
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
         * @requires modules/drilldown
         */
        mainBreadCrumb: 'Main'
    }
);

extend(
    defaultOptions.drilldown,
    {
        /**
         * Options for breadcrumbs
         *
         * @since   next
         * @product highcharts
         */
        breadcrumbs: {
            /**
            * Enable or disable the breadcrumbs.
            *
            * @type      {boolean}
            * @since     next
            */
            enabled: false,

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
            * Return false to stop default button's click action. // TO DO
            *
            * @type      {Highcharts.DrilldownBreadcrumbsClickCallbackFunction}
            * @since     next
            */

            /**
            * When the breadcrumbs is floating, the plot area will not move
            * to make space for it. By default, the chart will make space
            * for the buttons and will be aligned properly for the default
            * chart layout (title,  subtitle, legend, range selector)
            * for the custom chart layout set the position properties.
            * This property won't work when positioned in the middle.
            *
            * @type      {boolean}
            * @since     next
            */
            floating: false,

            /**
            * A format string for the breadcrumbs button.
            *
            * @type      {string}
            * @since     next
            */
            format: '{value}',

            /**
             * Callback function to format the breadcrumb text from scratch.
             *
             * @param {Highcharts.Breadcrumbs} breadcrumbs
             *        The breadcrumbs instance
             *
             * @return {string}
             *         Formatted text or false
             * @since    next
             */

            /**
            * Positioning for the button row. The breadcrumbs buttons
            * will be aligned properly for the default chart layout
            * (title,  subtitle, legend, range selector) for the custom chart
            * layout set the position properties.
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
            * A CSS styles for all breadcrumbs.
            *
            * @type      {string}
            * @since     next
            */
            style: {
                'color': '#666666',
                'position': 'absolute'
            },

            /**
            * A symbol of the seperator.
            *
            * @type      {string}
            * @since     next
            */
            separator: 'triangle',

            /**
            * A useHTML property.
            *
            * @type      {boolean}
            * @since     next
            */
            useHTML: false
        }
    }
);

class Breadcrumbs {
    public chart: Chart = void 0 as any;
    public breadcrumbsGroup: Highcharts.SVGElement = void 0 as any;
    public breadcrumbsList: Array<Array<any>> = [];
    public options: Highcharts.BreadcrumbsOptions = void 0 as any;

    public constructor(chart: Chart, userOptions: Highcharts.Options) {
        this.init(chart, userOptions);
    }

    public init(chart: Chart, userOptions: Highcharts.Options): void {
        const chartOptions = H.merge(userOptions, this.options),
            breadcrumbsOptions = chartOptions.drilldown?.breadcrumbs as Highcharts.BreadcrumbsOptions;

        this.chart = chart;
        this.options = breadcrumbsOptions;
    }

    /**
     * Align the breadcrumbs group.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public alignGroup(this: Breadcrumbs): void {
        const chart = this.chart,
            breadcrumbsOptions = chart.options.drilldown?.breadcrumbs as Highcharts.BreadcrumbsOptions,
            calcPosition = (Object as any).assign({}, (breadcrumbsOptions as any).position);

        // Change the initial position based on other elements on the chart.
        if (breadcrumbsOptions.position && breadcrumbsOptions.position.verticalAlign === 'top') {
            if (chart.title && chart.title.textStr) {
                const titleY = chart.title.alignOptions.y,
                    titleHeight = chart.title.alignOptions.height;

                calcPosition.y += titleY + titleHeight;
            }
            if (chart.subtitle) {
                const subtitletitleHeight = chart.subtitle.alignOptions.height;

                calcPosition.y += subtitletitleHeight;
            }
            if (chart.rangeSelector && chart.rangeSelector.group) {
                const rangeSelectorY = chart.rangeSelector.group.getBBox().y,
                    rangeSelectorHight = chart.rangeSelector.group.getBBox().height;

                calcPosition.y += (rangeSelectorY && rangeSelectorHight) ? rangeSelectorY + rangeSelectorHight : 0;
            }
        } else if (breadcrumbsOptions.position &&
                    breadcrumbsOptions.position.verticalAlign === 'bottom' &&
                    chart.marginBottom) {
            if (chart.legend && chart.legend.group && chart.legend.options.verticalAlign === 'bottom') {
                calcPosition.y -= chart.marginBottom -
                        this.breadcrumbsGroup.getBBox().height -
                        chart.legend.legendHeight;
            } else {
                calcPosition.y -= this.breadcrumbsGroup.getBBox().height;
            }
        }

        if (breadcrumbsOptions.position && breadcrumbsOptions.position.align === 'right') {
            calcPosition.x -= this.breadcrumbsGroup.getBBox().width;
        } else if (breadcrumbsOptions.position && breadcrumbsOptions.position.align === 'center') {
            calcPosition.x -= this.breadcrumbsGroup.getBBox().width / 2;
        }
        this.breadcrumbsGroup
            .align(
                calcPosition,
                true,
                chart.spacingBox
            );
    }

    /**
     * This method creates an array of arrays containing a level number
     * with the corresponding series/point.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#createList
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public createList(this: Breadcrumbs): void {
        const chart = this.chart,
            drilldownLevels = chart.drilldownLevels,
            initialSeriesLevel = -1;

        let breadcrumbsList: Array<any> = this.breadcrumbsList || [],
            // If the list doesn't exist treat the initial series
            // as the current level- first iteration.
            currentLevelNumber: number = breadcrumbsList.length ?
                breadcrumbsList[breadcrumbsList.length - 1][0] : initialSeriesLevel;

        if (drilldownLevels && drilldownLevels.length) {
            // Add the initial series as the first element.
            breadcrumbsList = !breadcrumbsList.length ?
                [[initialSeriesLevel, drilldownLevels[0].seriesOptions]] : breadcrumbsList;

            drilldownLevels.forEach(function (level): void {
                // If level is already added to breadcrumbs list,
                // don't add it again- drilling categories
                if (level.levelNumber > currentLevelNumber) {
                    currentLevelNumber = level.levelNumber;
                    breadcrumbsList.push([currentLevelNumber, level.pointOptions]);
                }
            });
        }
        this.breadcrumbsList = breadcrumbsList;
    }

    /**
     * Destroy the chosen buttons and separators.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#destroy
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} lastVisibleLevel
     *        Number of levels to destoy.
     */
    public destroy(this: Breadcrumbs, lastVisibleLevel: number): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            initialSeriesLevel = -1,
            breadcrumbsOptions = chart.options.drilldown?.breadcrumbs as Highcharts.BreadcrumbsOptions;

        // Click the main breadcrumb
        if (lastVisibleLevel === initialSeriesLevel) {
            breadcrumbsList.forEach(function (el): void {
                const button = el[2],
                    conector = el[3];

                // Remove SVG elements fromt the DOM.
                button ? button.destroy() : void 0;
                conector ? conector.destroy() : void 0;
            });
            // Clear the breadcrums list array.
            breadcrumbsList.length = 0;
        } else {
            const prevConector = breadcrumbsList[lastVisibleLevel + 1][3];

            // Remove connector from the previous button.
            prevConector ? prevConector.destroy() : void 0;
            breadcrumbsList[lastVisibleLevel + 1].length = 3;

            for (let i = lastVisibleLevel + 2; i < breadcrumbsList.length; i++) {
                const el = breadcrumbsList[i],
                    button = el[2],
                    conector = el[3];

                // Remove SVG elements fromt the DOM.
                button ? button.destroy() : void 0;
                conector ? conector.destroy() : void 0;
            }
            // Clear the breadcrums list array.
            breadcrumbsList.length = lastVisibleLevel + 2;
        }

        if (breadcrumbsOptions.position && breadcrumbsOptions.position.align !== 'left') {
            breadcrumbs.alignGroup();
        }
    }

    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#draw
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public draw(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = chart.options.drilldown?.breadcrumbs,
            lastBreadcrumbs = breadcrumbsList[breadcrumbsList.length - 2][2],
            buttonPadding = 5;

        // A main group for the breadcrumbs.
        if (!this.breadcrumbsGroup) {
            this.breadcrumbsGroup = chart.renderer
                .g('breadcrumbs-group')
                .attr({
                    zIndex: 7
                })
                .addClass('highcharts-drilldown-breadcrumbs')
                .add();
        }

        // Inital position for calculating the breadcrumbsGroup.
        let posX: number = lastBreadcrumbs ? lastBreadcrumbs.x +
                lastBreadcrumbs.element.getBBox().width + buttonPadding : 0;
        const posY: number = buttonPadding;

        // Draw breadcrumbs.
        if (breadcrumbsList && breadcrumbsOptions) {
            breadcrumbsList.forEach(function (breadcrumb, index): void {
                const breadcrumbButton: SVGElement = breadcrumb[2];

                // Render a button.
                if (!breadcrumbButton) {
                    const button = breadcrumbs.renderButton(breadcrumb, posX, posY);
                    breadcrumb.push(button);
                    posX += button ? button.getBBox().width + buttonPadding : 0;
                    breadcrumbs.breadcrumbsGroup.lastXPos = posX;
                }

                // Render a separator.
                if (index === breadcrumbsList.length - 2) {
                    const separator = breadcrumbs.renderSeparator(breadcrumb, posX, posY);

                    breadcrumb.push(separator);
                    posX += separator ? separator.getBBox().width + buttonPadding : 0;
                }
            });
        }
        breadcrumbs.alignGroup();
    }

    /**
     * Performs multiple drillups based on the provided number.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#multipleDrillUp
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} drillAmount
     *        A number of drillups that needs to be performed.
     */
    public multipleDrillUp(this: Breadcrumbs, drillAmount: number): void {
        const chart = this.chart,
            breadcrumbsList = this.breadcrumbsList;

        if (breadcrumbsList && breadcrumbsList.length) {
            for (let i = 0; i < breadcrumbsList[breadcrumbsList.length - 1][0] - drillAmount; i++) {
                chart.drillUp();
            }
        }

        this.destroy(drillAmount);
    }
    /**
    * Redraw.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Chart#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    public redraw(this: Breadcrumbs): void {
        const breadcrumbsGroup = this.breadcrumbsGroup;

        if (breadcrumbsGroup) {
            this.alignGroup();
        }
    }

    /**
    * Render the button.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Chart#renderButton
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
    public renderButton(this: Breadcrumbs, breadcrumb: Array<any>, posX: number, posY: number): SVGElement|void {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = chart.options.drilldown?.breadcrumbs,
            lang = chart.options.lang;

        if (breadcrumbsOptions) {
            const button = chart.renderer.button(
                breadcrumbsOptions.formatter ? breadcrumbsOptions.formatter(breadcrumbs) : void 0 ||
                    format(breadcrumbsOptions.format as any,
                        { value: breadcrumb[1].name || lang?.mainBreadCrumb }, chart),
                posX,
                posY,
                function (): void {
                    if (breadcrumbsOptions.events && breadcrumbsOptions.events.click) {
                        breadcrumbsOptions.events.click(button as any, breadcrumbs as any);
                        // Prevent from click on the current level
                    } else if (breadcrumbsList[breadcrumbsList.length - 1][1].name !== button.textStr) {
                        breadcrumbs.multipleDrillUp(breadcrumb[0]);
                    }
                })
                .attr({
                    padding: 3
                })
                .css(breadcrumbsOptions.style as any)
                .addClass('highcharts-drilldown-breadcrumbs-button')
                .add(breadcrumbs.breadcrumbsGroup);
            return button;
        }
    }

    /**
    * Render the separator.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Chart#renderSeparator
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
    public renderSeparator(this: Breadcrumbs, breadcrumb: Array<any>, posX: number, posY: number): SVGElement|void {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = chart.options.drilldown?.breadcrumbs;

        if (breadcrumbsOptions) {
            return chart.renderer.symbol(
                breadcrumbsOptions.separator as string,
                posX + 5,
                posY - 10,
                10,
                10
            )
                .attr({
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 1,
                    rotation: 90,
                    rotationOriginX: posX,
                    rotationOriginY: posY
                })
                .add(breadcrumbs.breadcrumbsGroup)
                .addClass('highcharts-drilldown-breadcrumbs-separator');
        }
    }

    /**
    * Update.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Chart#update
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.Options} userOptions
    *        Breadcrumbs class.
    */
    public update(this: Breadcrumbs, userOptions: Highcharts.Options): void {
        const chartOptions = H.merge(userOptions, this.options);
    }
}

/* eslint-disable no-invalid-this */

if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs as any;

    addEvent(Chart, 'getMargins', function (e: Chart): void {
        const chart = this,
            breadcrumbsOptions = chart.options.drilldown?.breadcrumbs,
            extraMargin = chart.rangeSelector ? 40 : 30;

        if (breadcrumbsOptions && breadcrumbsOptions.enabled && !breadcrumbsOptions.floating) {
            if (breadcrumbsOptions.position?.verticalAlign === 'top' && extraMargin) {
                chart.plotTop += extraMargin;
            }
            if (breadcrumbsOptions.position?.verticalAlign === 'bottom' && extraMargin) {
                (chart.marginBottom as any) += extraMargin;
            }
        }
    });

    addEvent(Chart, 'redraw', function (e: Chart): void {
        this.drilldown?.breadcrumbs?.redraw();
    });

    addEvent(Chart, 'afterDrilldown', function (e: Chart): void {
        const chart = this;

        if (!chart.drilldown?.breadcrumbs && chart.drilldown) {
            chart.drilldown.breadcrumbs = new Breadcrumbs(chart as Chart, chart.options as Highcharts.Options);
        }

        if (chart.drilldown && chart.options.drilldown?.breadcrumbs?.enabled && chart.drilldown?.breadcrumbs) {
            (chart.drilldown.breadcrumbs as any).createList();
            (chart.drilldown.breadcrumbs as any).draw();
        }
    });
}

export default H.Breadcrumbs;
