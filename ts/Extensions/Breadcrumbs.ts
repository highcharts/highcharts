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
    defined,
    extend,
    format
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface BreadcrumbsOptions {
            buttonPadding?: number;
            enabled?: boolean;
            events?: BreadcrumbsButtonsEventsOptions;
            floating?: boolean;
            format?: string;
            formatter?: BreadcrumbsButtonsFormatter;
            position?: BreadcrumbsAlignOptions;
            separator?: string;
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
                breadcrumb: Array<any>,
                breadcrumbs: Breadcrumbs
            ): (string);
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
            public createList(e?: any): void;
            public destroy(this: Breadcrumbs, lastVisibleLevel: number|undefined): void;
            public draw(): void;
            public multipleDrillUp(numb: number): void;
            public init(chart: Chart, userOptions: Highcharts.Options): void;
            public redraw(): void;
            public renderButton(breadcrumb: Array<any>, posX: number, posY: number): SVGElement|void;
            public renderSeparator(posX: number, posY: number): SVGElement|void;
            public update(userOptions: Highcharts.Options, redrawFlag: boolean): void;
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
            * The default padding for each button and separator.
            *
            * @type      {boolean}
            * @since     next
            */
            buttonPadding: 5,

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
            separator: 'triangle',

            /**
            * A useHTML property.
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
        }
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
    public chart: Chart = void 0 as any;
    public breadcrumbsGroup: Highcharts.SVGElement = void 0 as any;
    public breadcrumbsList: Array<Array<any>> = [];
    public options: Highcharts.BreadcrumbsOptions = void 0 as any;

    public constructor(chart: Chart, userOptions: Highcharts.Options) {
        this.init(chart, userOptions);
    }

    public init(chart: Chart, userOptions: Highcharts.Options): void {
        const chartOptions = H.merge(userOptions, this.options),
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;

        this.chart = chart;
        this.options = breadcrumbsOptions || {};
    }

    /**
     * Align the breadcrumbs group.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public alignGroup(this: Breadcrumbs): void {
        const chart = this.chart,
            breadcrumbsOptions = this.options,
            bBox = this.breadcrumbsGroup.getBBox(),
            rangeSelector = chart.rangeSelector,
            positionOptions = breadcrumbsOptions.position;

        if (positionOptions) {
            // Create a deep copy.
            const calcPosition: Highcharts.BreadcrumbsAlignOptions = {
                align: positionOptions.align,
                alignByTranslate: positionOptions.alignByTranslate,
                verticalAlign: positionOptions.verticalAlign,
                x: positionOptions.x,
                y: positionOptions.y
            };

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
     * This method creates an array of arrays containing a level number
     * with the corresponding series/point.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#createList
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} e
     *        Event in case of the treemap series.
     */
    public createList(this: Breadcrumbs, e?: any): void {
        const breadcrumbsList: Array<any> = this.breadcrumbsList || [],
            chart = this.chart,
            drilldownLevels = chart.drilldownLevels;
            // If the list doesn't exist treat the initial series
            // as the current level- first iteration.
        let currentLevelNumber: number = breadcrumbsList.length ?
            breadcrumbsList[breadcrumbsList.length - 1][0] : null;

        if (chart.series[0].is('treemap')) {
            if (e) {
                if (!breadcrumbsList[0]) {
                    // As a first element add the series.
                    breadcrumbsList.push([null, chart.series[0]]);
                }
                if (e.trigger === 'click') {
                    // When a user clicks add element one by one.
                    if (currentLevelNumber === null) {
                        breadcrumbsList.push([0, chart.get(e.newRootId)]);
                        currentLevelNumber = 0;
                    } else {
                        breadcrumbsList.push([currentLevelNumber + 1, chart.get(e.newRootId)]);
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
        } else if (drilldownLevels && drilldownLevels.length) {
            // Add the initial series as the first element.
            if (!breadcrumbsList[0]) {
                breadcrumbsList.push([null, drilldownLevels[0].seriesOptions]);
                currentLevelNumber = -1;
            }

            drilldownLevels.forEach(function (level): void {
                // If level is already added to breadcrumbs list,
                // don't add it again- drilling categories
                if (level.levelNumber > currentLevelNumber) {
                    breadcrumbsList.push([level.levelNumber, level.pointOptions]);
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
     * @function Highcharts.Breadcrumbs#destroy
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} lastVisibleLevel
     *        Number of levels to destoy.
     */
    public destroy(this: Breadcrumbs, lastVisibleLevel: number|undefined): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;

        // Click the main breadcrumb
        if (!lastVisibleLevel && lastVisibleLevel !== 0) {
            breadcrumbsList.forEach(function (el): void {
                const button = el[2],
                    separator = el[3];

                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                separator && separator.destroy();
            });
            // Clear the breadcrums list array.
            breadcrumbsList.length = 0;
        } else {
            const prevConector = breadcrumbsList[lastVisibleLevel + 1][3];

            // Remove connector from the previous button.
            prevConector && prevConector.destroy();
            breadcrumbsList[lastVisibleLevel + 1].length = 3;

            for (let i = lastVisibleLevel + 2; i < breadcrumbsList.length; i++) {
                const el = breadcrumbsList[i],
                    button = el[2],
                    conector = el[3];

                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                conector && conector.destroy();
            }
            // Clear the breadcrums list array.
            breadcrumbsList.length = lastVisibleLevel + 2;
        }

        if (breadcrumbsOptions && breadcrumbsOptions.position && breadcrumbsOptions.position.align !== 'left') {
            breadcrumbs.alignGroup();
        }
    }

    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#draw
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    public draw(this: Breadcrumbs): void {
        const breadcrumbs = this,
            chart = breadcrumbs.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs,
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
                .addClass('highcharts-drilldown-breadcrumbs')
                .add();
        }

        // Draw breadcrumbs.
        if (breadcrumbsList && breadcrumbsOptions && buttonPadding) {
            // Inital position for calculating the breadcrumbsGroup.
            let posX: number = lastBreadcrumbs ? lastBreadcrumbs.x +
                    lastBreadcrumbs.element.getBBox().width + buttonPadding : 0;
            const posY: number = buttonPadding;

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
        }

        breadcrumbs.alignGroup();
    }

    /**
     * Performs multiple drillups based on the provided number.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#multipleDrillUp
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} drillAmount
     *        A number of drillups that needs to be performed.
     */
    public multipleDrillUp(this: Breadcrumbs, drillAmount: number): void {
        const chart = this.chart,
            breadcrumbsList = this.breadcrumbsList,
            drillNumb = defined(drillAmount) ?
                breadcrumbsList[breadcrumbsList.length - 1][0] - drillAmount :
                breadcrumbsList[breadcrumbsList.length - 1][0] + 1;

        if (breadcrumbsList && breadcrumbsList.length) {
            for (let i = 0; i < drillNumb; i++) {
                if (chart.series[0].is('treemap')) {
                    (chart.series[0] as Highcharts.TreemapSeries).drillUp();
                } else {
                    chart.drillUp();
                }
            }
        }

        this.destroy(drillAmount);
    }
    /**
    * Redraw.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Breadcrumbs#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    public redraw(this: Breadcrumbs): void {
        const breadcrumbsGroup = this.breadcrumbsGroup;

        if (breadcrumbsGroup && this.breadcrumbsList.length) {
            this.alignGroup();
        }
        this.createList();
        this.draw();

    }

    /**
    * Render the button.
    *
    * @requires  modules/drilldown
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
    public renderButton(this: Breadcrumbs, breadcrumb: Array<any>, posX: number, posY: number): SVGElement|void {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsList = breadcrumbs.breadcrumbsList,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs,
            lang = chart.options.lang;

        if (breadcrumbsOptions && breadcrumb[1]) {
            const button = chart.renderer.button(
                breadcrumbsOptions.formatter ? breadcrumbsOptions.formatter(breadcrumb, breadcrumbs) : void 0 ||
                    format(breadcrumbsOptions.format as string,
                        { value: breadcrumb[1].name || (lang && lang.mainBreadCrumb) }, chart),
                posX,
                posY,
                function (e: (Event|Highcharts.Dictionary<any>)): void {
                    // extract events from button object and call
                    const buttonEvents = breadcrumbsOptions.events && breadcrumbsOptions.events.click;
                    let callDefaultEvent;

                    if (buttonEvents) {
                        callDefaultEvent = buttonEvents.call(breadcrumbsOptions, e as any, breadcrumbs);
                    }

                    // Prevent from click on the current level
                    if (callDefaultEvent !== false &&
                        breadcrumbsList[breadcrumbsList.length - 1][1].name !== button.textStr) {
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
    * @function Highcharts.Breadcrumbs#renderSeparator
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.Breadcrumbs} posX
    *        Initial horizontal position
    * @param {Highcharts.Breadcrumbs} posY
    *        Initial vertical position
    * @return {SVGElement|void}
    *        Returns the SVG button
    */
    public renderSeparator(this: Breadcrumbs, posX: number, posY: number): SVGElement|void {
        const breadcrumbs = this,
            chart = this.chart,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs,
            size = 10;

        if (breadcrumbsOptions) {
            const separatorSymbol = breadcrumbsOptions.separator,
                serparatorRotation = separatorSymbol && separatorSymbol.slice(0, 3) === 'url' ? 0 : 90;

            const separator = chart.renderer.symbol(
                    separatorSymbol as string,
                    posX,
                    posY,
                    size,
                    size
                )
                    .attr({
                        fill: 'white',
                        stroke: 'black',
                        'stroke-width': 1,
                        rotation: serparatorRotation,
                        rotationOriginX: posX,
                        rotationOriginY: posY
                    })
                    .add(breadcrumbs.breadcrumbsGroup)
                    .addClass('highcharts-drilldown-breadcrumbs-separator'),
                separatorBBox = separator.getBBox();

            separator.translate(separatorBBox.width, separatorBBox.height / 2);

            return separator;
        }
    }

    /**
    * Update.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Breadcrumbs#update
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.BreadcrumbsOptions} userOptions
    *        Breadcrumbs class.
    * @param {boolean} redrawFlag
    *        Redraw flag
    */
    public update(this: Breadcrumbs, userOptions: Highcharts.Options, redrawFlag: boolean = true): void {
        H.merge(true, this.chart.options.drilldown?.breadcrumbs, userOptions);

        if (redrawFlag) {
            this.destroy(-1);
            this.redraw();
        }
    }
}

/* eslint-disable no-invalid-this */

if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs as any;

    addEvent(Chart, 'getMargins', function (e: Chart): void {
        const chart = this,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs,
            defaultBreadcrumheight = 35, // TO DO: calculate that height
            extraMargin = chart.rangeSelector ? chart.rangeSelector.getHeight() : defaultBreadcrumheight;

        if (breadcrumbsOptions && breadcrumbsOptions.enabled && !breadcrumbsOptions.floating) {
            if (breadcrumbsOptions.position && breadcrumbsOptions.position.verticalAlign === 'top' && extraMargin) {
                chart.plotTop += extraMargin;
            }
            if (breadcrumbsOptions.position && breadcrumbsOptions.position.verticalAlign === 'bottom' && extraMargin) {
                (chart.marginBottom as number) += extraMargin;
            }
        }
    });

    addEvent(Chart, 'redraw', function (e: Chart): void {
        this.drilldown?.breadcrumbs?.redraw();
    });

    addEvent(Chart, 'afterDrilldown', function (e: Chart): void {
        const chart = this,
            drilldown = chart.drilldown as Highcharts.ChartDrilldownObject,
            breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;


        if (chart.drilldown && breadcrumbsOptions && breadcrumbsOptions.enabled) {
            if (!drilldown.breadcrumbs) {
                chart.drilldown.breadcrumbs = new Breadcrumbs(chart as Chart, chart.options as Highcharts.Options);
            }

            (chart.drilldown.breadcrumbs as Breadcrumbs).redraw();
        }
    });
    addEvent(H.Series, 'setRootNode', function (e): void {
        const chart = this.chart,
            drilldown = chart.drilldown as Highcharts.ChartDrilldownObject;

        if (chart.drilldown) {
            if (!drilldown.breadcrumbs) {
                chart.drilldown.breadcrumbs = new Breadcrumbs(chart as Chart, chart.options as Highcharts.Options);
            }

            // Create a list using the event after drilldown.
            if ((e as any).trigger === 'click' || !(e as any).trigger) {
                chart.drilldown.breadcrumbs?.createList(e);
                chart.drilldown.breadcrumbs?.draw();
            }
        }

    });
}

export default H.Breadcrumbs;
