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
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import O from '../Core/Options.js';
var defaultOptions = O.defaultOptions;
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, extend = U.extend, format = U.format, pick = U.pick;
// Add language support.
extend(defaultOptions.lang, 
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
});
extend(defaultOptions.drilldown, {
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
        useHTML: false,
        /**
        * The zIndex of the group.
        *
        * @type      {boolean}
        * @since     next
        */
        zIndex: 7
    }
});
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
var Breadcrumbs = /** @class */ (function () {
    function Breadcrumbs(chart, userOptions) {
        this.chart = void 0;
        this.breadcrumbsGroup = void 0;
        this.breadcrumbsList = [];
        this.options = void 0;
        this.init(chart, userOptions);
    }
    Breadcrumbs.prototype.init = function (chart, userOptions) {
        var chartOptions = H.merge(userOptions, this.options), breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;
        this.chart = chart;
        this.options = breadcrumbsOptions;
    };
    /**
     * Align the breadcrumbs group.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.alignGroup = function () {
        var chart = this.chart, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs, calcPosition = {};
        if (breadcrumbsOptions && breadcrumbsOptions.position) {
            // Create a deep copy.
            calcPosition.align = breadcrumbsOptions.position.align;
            calcPosition.alignByTranslate = breadcrumbsOptions.position.alignByTranslate;
            calcPosition.verticalAlign = breadcrumbsOptions.position.verticalAlign;
            calcPosition.x = breadcrumbsOptions.position.x;
            calcPosition.y = breadcrumbsOptions.position.y;
            // Change the initial position based on other elements on the chart.
            if (breadcrumbsOptions.position.verticalAlign === 'top') {
                if (chart.title && chart.title.textStr) {
                    var titleY = chart.title.alignOptions.y, titleHeight = chart.title.alignOptions.height;
                    calcPosition.y += titleY + titleHeight;
                }
                if (chart.subtitle) {
                    var subtitletitleHeight = chart.subtitle.alignOptions.height;
                    calcPosition.y += subtitletitleHeight;
                }
                if (chart.rangeSelector && chart.rangeSelector.group) {
                    var rangeSelectorY = chart.rangeSelector.group.getBBox().y, rangeSelectorHight = chart.rangeSelector.group.getBBox().height;
                    calcPosition.y += (rangeSelectorY && rangeSelectorHight) ?
                        rangeSelectorY + rangeSelectorHight : 0;
                }
            }
            else if (breadcrumbsOptions.position.verticalAlign === 'bottom' && chart.marginBottom) {
                if (chart.legend && chart.legend.group && chart.legend.options.verticalAlign === 'bottom') {
                    calcPosition.y -= chart.marginBottom -
                        this.breadcrumbsGroup.getBBox().height -
                        chart.legend.legendHeight;
                }
                else {
                    calcPosition.y -= this.breadcrumbsGroup.getBBox().height;
                }
            }
            if (breadcrumbsOptions.position.align === 'right') {
                calcPosition.x -= this.breadcrumbsGroup.getBBox().width;
            }
            else if (breadcrumbsOptions.position.align === 'center') {
                calcPosition.x -= this.breadcrumbsGroup.getBBox().width / 2;
            }
            this.breadcrumbsGroup
                .align(calcPosition, true, chart.spacingBox);
        }
    };
    /**
     * This method creates an array of arrays containing a level number
     * with the corresponding series/point.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#createList
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.createList = function () {
        var breadcrumbsList = this.breadcrumbsList || [];
        var chart = this.chart, drilldownLevels = chart.drilldownLevels, 
        // First created drilldown level has number 0,
        // that is why the initial series is treated as -1 level.
        initialSeriesLevel = -1, 
        // If the list doesn't exist treat the initial series
        // as the current level- first iteration.
        currentLevelNumber = breadcrumbsList.length ?
            breadcrumbsList[breadcrumbsList.length - 1][0] : initialSeriesLevel;
        if (drilldownLevels && drilldownLevels.length) {
            // Add the initial series as the first element.
            breadcrumbsList = !breadcrumbsList.length ?
                [[initialSeriesLevel, drilldownLevels[0].seriesOptions]] : breadcrumbsList;
            drilldownLevels.forEach(function (level) {
                // If level is already added to breadcrumbs list,
                // don't add it again- drilling categories
                if (level.levelNumber > currentLevelNumber) {
                    breadcrumbsList.push([level.levelNumber, level.pointOptions]);
                }
            });
        }
        this.breadcrumbsList = breadcrumbsList;
    };
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
    Breadcrumbs.prototype.destroy = function (lastVisibleLevel) {
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, initialSeriesLevel = -1, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;
        // Click the main breadcrumb
        if (lastVisibleLevel === initialSeriesLevel || (!lastVisibleLevel && lastVisibleLevel !== 0)) {
            breadcrumbsList.forEach(function (el) {
                var button = el[2], separator = el[3];
                // Remove SVG elements fromt the DOM.
                button ? button.destroy() : void 0;
                separator ? separator.destroy() : void 0;
            });
            // Clear the breadcrums list array.
            breadcrumbsList.length = 0;
        }
        else {
            var prevConector = breadcrumbsList[lastVisibleLevel + 1][3];
            // Remove connector from the previous button.
            prevConector ? prevConector.destroy() : void 0;
            breadcrumbsList[lastVisibleLevel + 1].length = 3;
            for (var i = lastVisibleLevel + 2; i < breadcrumbsList.length; i++) {
                var el = breadcrumbsList[i], button = el[2], conector = el[3];
                // Remove SVG elements fromt the DOM.
                button ? button.destroy() : void 0;
                conector ? conector.destroy() : void 0;
            }
            // Clear the breadcrums list array.
            breadcrumbsList.length = lastVisibleLevel + 2;
        }
        if (breadcrumbsOptions && breadcrumbsOptions.position && breadcrumbsOptions.position.align !== 'left') {
            breadcrumbs.alignGroup();
        }
    };
    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Breadcrumbs#draw
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.draw = function () {
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs, lastBreadcrumbs = breadcrumbsList[breadcrumbsList.length - 2][2], buttonPadding = breadcrumbsOptions && breadcrumbsOptions.buttonPadding;
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
            var posX_1 = lastBreadcrumbs ? lastBreadcrumbs.x +
                lastBreadcrumbs.element.getBBox().width + buttonPadding : 0;
            var posY_1 = buttonPadding;
            breadcrumbsList.forEach(function (breadcrumb, index) {
                var breadcrumbButton = breadcrumb[2], separatorElement = breadcrumb[3];
                // Render a button.
                if (!breadcrumbButton) {
                    var button = breadcrumbs.renderButton(breadcrumb, posX_1, posY_1);
                    breadcrumb.push(button);
                    posX_1 += button ? button.getBBox().width + buttonPadding : 0;
                    breadcrumbs.breadcrumbsGroup.lastXPos = posX_1;
                }
                // Render a separator.
                if (!separatorElement && index !== breadcrumbsList.length - 1) {
                    var separator = breadcrumbs.renderSeparator(posX_1, posY_1);
                    breadcrumb.push(separator);
                    posX_1 += separator ? separator.getBBox().width + buttonPadding : 0;
                }
            });
            // breadcrumbsList[breadcrumbsList.length - 1][3].destroy()
            // breadcrumbsList[breadcrumbsList.length - 1].length = 3
        }
        breadcrumbs.alignGroup();
    };
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
    Breadcrumbs.prototype.multipleDrillUp = function (drillAmount) {
        var chart = this.chart, breadcrumbsList = this.breadcrumbsList;
        if (breadcrumbsList && breadcrumbsList.length) {
            for (var i = 0; i < breadcrumbsList[breadcrumbsList.length - 1][0] - drillAmount; i++) {
                chart.drillUp();
            }
        }
        this.destroy(drillAmount);
    };
    /**
    * Redraw.
    *
    * @requires  modules/drilldown
    *
    * @function Highcharts.Breadcrumbs#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.redraw = function () {
        var breadcrumbsGroup = this.breadcrumbsGroup;
        if (breadcrumbsGroup && this.breadcrumbsList.length) {
            this.alignGroup();
        }
        this.createList();
        this.draw();
    };
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
    Breadcrumbs.prototype.renderButton = function (breadcrumb, posX, posY) {
        var breadcrumbs = this, chart = this.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs, lang = chart.options.lang;
        if (breadcrumbsOptions) {
            var button_1 = chart.renderer.button(breadcrumbsOptions.formatter ? breadcrumbsOptions.formatter(breadcrumbs) : void 0 ||
                format(breadcrumbsOptions.format, { value: breadcrumb[1].name || (lang && lang.mainBreadCrumb) }, chart), posX, posY, function () {
                if (breadcrumbsOptions.events && breadcrumbsOptions.events.click) {
                    breadcrumbsOptions.events.click(button_1, breadcrumbs);
                    // Prevent from click on the current level
                }
                else if (breadcrumbsList[breadcrumbsList.length - 1][1].name !== button_1.textStr) {
                    breadcrumbs.multipleDrillUp(breadcrumb[0]);
                }
            })
                .attr({
                padding: 3
            })
                .css(breadcrumbsOptions.style)
                .addClass('highcharts-drilldown-breadcrumbs-button')
                .add(breadcrumbs.breadcrumbsGroup);
            return button_1;
        }
    };
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
    Breadcrumbs.prototype.renderSeparator = function (posX, posY) {
        var breadcrumbs = this, chart = this.chart, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;
        if (breadcrumbsOptions) {
            return chart.renderer.symbol(breadcrumbsOptions.separator, posX + 5, posY - 10, 10, 10)
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
    };
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
    Breadcrumbs.prototype.update = function (userOptions, redrawFlag) {
        var _a;
        if (redrawFlag === void 0) { redrawFlag = true; }
        H.merge(true, (_a = this.chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs, userOptions);
        if (redrawFlag) {
            this.destroy(-1);
            this.redraw();
        }
    };
    return Breadcrumbs;
}());
/* eslint-disable no-invalid-this */
if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs;
    addEvent(Chart, 'getMargins', function (e) {
        var chart = this, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs, defaultBreadcrumheight = 35, // TO DO: calculate that height
        extraMargin = chart.rangeSelector ? chart.rangeSelector.getHeight() : defaultBreadcrumheight;
        if (breadcrumbsOptions && breadcrumbsOptions.enabled && !breadcrumbsOptions.floating) {
            if (breadcrumbsOptions.position && breadcrumbsOptions.position.verticalAlign === 'top' && extraMargin) {
                chart.plotTop += extraMargin;
            }
            if (breadcrumbsOptions.position && breadcrumbsOptions.position.verticalAlign === 'bottom' && extraMargin) {
                chart.marginBottom += extraMargin;
            }
        }
    });
    addEvent(Chart, 'redraw', function (e) {
        var _a, _b;
        (_b = (_a = this.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs) === null || _b === void 0 ? void 0 : _b.redraw();
    });
    addEvent(Chart, 'afterDrilldown', function (e) {
        var chart = this, drilldown = chart.drilldown, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;
        if (chart.drilldown && breadcrumbsOptions && breadcrumbsOptions.enabled) {
            if (!drilldown.breadcrumbs) {
                chart.drilldown.breadcrumbs = new Breadcrumbs(chart, chart.options);
            }
            chart.drilldown.breadcrumbs.redraw();
        }
    });
}
export default H.Breadcrumbs;
