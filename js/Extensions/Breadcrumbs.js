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
});
var Breadcrumbs = /** @class */ (function () {
    function Breadcrumbs(chart, userOptions) {
        this.chart = void 0;
        this.breadcrumbsGroup = void 0;
        this.breadcrumbsList = [];
        this.options = void 0;
        this.init(chart, userOptions);
    }
    Breadcrumbs.prototype.init = function (chart, userOptions) {
        var _a;
        var chartOptions = H.merge(userOptions, this.options), breadcrumbsOptions = (_a = chartOptions.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs;
        this.chart = chart;
        this.options = breadcrumbsOptions;
    };
    /**
     * Align the breadcrumbs group.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.alignGroup = function () {
        var _a;
        var chart = this.chart, breadcrumbsOptions = (_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs, calcPosition = Object.assign({}, breadcrumbsOptions.position);
        // Change the initial position based on other elements on the chart.
        if (breadcrumbsOptions.position && breadcrumbsOptions.position.verticalAlign === 'top') {
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
                calcPosition.y += (rangeSelectorY && rangeSelectorHight) ? rangeSelectorY + rangeSelectorHight : 0;
            }
        }
        else if (breadcrumbsOptions.position &&
            breadcrumbsOptions.position.verticalAlign === 'bottom' &&
            chart.marginBottom) {
            if (chart.legend && chart.legend.group && chart.legend.options.verticalAlign === 'bottom') {
                calcPosition.y -= chart.marginBottom -
                    this.breadcrumbsGroup.getBBox().height -
                    chart.legend.legendHeight;
            }
            else {
                calcPosition.y -= this.breadcrumbsGroup.getBBox().height;
            }
        }
        if (breadcrumbsOptions.position && breadcrumbsOptions.position.align === 'right') {
            calcPosition.x -= this.breadcrumbsGroup.getBBox().width;
        }
        else if (breadcrumbsOptions.position && breadcrumbsOptions.position.align === 'center') {
            calcPosition.x -= this.breadcrumbsGroup.getBBox().width / 2;
        }
        this.breadcrumbsGroup
            .align(calcPosition, true, chart.spacingBox);
    };
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
    Breadcrumbs.prototype.createList = function () {
        var chart = this.chart, drilldownLevels = chart.drilldownLevels, initialSeriesLevel = -1;
        var breadcrumbsList = this.breadcrumbsList || [], 
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
                    currentLevelNumber = level.levelNumber;
                    breadcrumbsList.push([currentLevelNumber, level.pointOptions]);
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
     * @function Highcharts.Chart#destroy
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} lastVisibleLevel
     *        Number of levels to destoy.
     */
    Breadcrumbs.prototype.destroy = function (lastVisibleLevel) {
        var _a;
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, initialSeriesLevel = -1, breadcrumbsOptions = (_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs;
        // Click the main breadcrumb
        if (lastVisibleLevel === initialSeriesLevel) {
            breadcrumbsList.forEach(function (el) {
                var button = el[2], conector = el[3];
                // Remove SVG elements fromt the DOM.
                button ? button.destroy() : void 0;
                conector ? conector.destroy() : void 0;
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
        if (breadcrumbsOptions.position && breadcrumbsOptions.position.align !== 'left') {
            breadcrumbs.alignGroup();
        }
    };
    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/drilldown
     *
     * @function Highcharts.Chart#draw
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.draw = function () {
        var _a;
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = (_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs, lastBreadcrumbs = breadcrumbsList[breadcrumbsList.length - 2][2], buttonPadding = 5;
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
        var posX = lastBreadcrumbs ? lastBreadcrumbs.x +
            lastBreadcrumbs.element.getBBox().width + buttonPadding : 0;
        var posY = buttonPadding;
        // Draw breadcrumbs.
        if (breadcrumbsList && breadcrumbsOptions) {
            breadcrumbsList.forEach(function (breadcrumb, index) {
                var breadcrumbButton = breadcrumb[2];
                // Render a button.
                if (!breadcrumbButton) {
                    var button = breadcrumbs.renderButton(breadcrumb, posX, posY);
                    breadcrumb.push(button);
                    posX += button ? button.getBBox().width + buttonPadding : 0;
                    breadcrumbs.breadcrumbsGroup.lastXPos = posX;
                }
                // Render a separator.
                if (index === breadcrumbsList.length - 2) {
                    var separator = breadcrumbs.renderSeparator(breadcrumb, posX, posY);
                    breadcrumb.push(separator);
                    posX += separator ? separator.getBBox().width + buttonPadding : 0;
                }
            });
        }
        breadcrumbs.alignGroup();
    };
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
    * @function Highcharts.Chart#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.redraw = function () {
        var breadcrumbsGroup = this.breadcrumbsGroup;
        if (breadcrumbsGroup) {
            this.alignGroup();
        }
    };
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
    Breadcrumbs.prototype.renderButton = function (breadcrumb, posX, posY) {
        var _a;
        var breadcrumbs = this, chart = this.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = (_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs, lang = chart.options.lang;
        if (breadcrumbsOptions) {
            var button_1 = chart.renderer.button(breadcrumbsOptions.formatter ? breadcrumbsOptions.formatter(breadcrumbs) : void 0 ||
                format(breadcrumbsOptions.format, { value: breadcrumb[1].name || (lang === null || lang === void 0 ? void 0 : lang.mainBreadCrumb) }, chart), posX, posY, function () {
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
    Breadcrumbs.prototype.renderSeparator = function (breadcrumb, posX, posY) {
        var _a;
        var breadcrumbs = this, chart = this.chart, breadcrumbsOptions = (_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs;
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
    * @function Highcharts.Chart#update
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.Options} userOptions
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.update = function (userOptions) {
        var chartOptions = H.merge(userOptions, this.options);
    };
    return Breadcrumbs;
}());
/* eslint-disable no-invalid-this */
if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs;
    addEvent(Chart, 'getMargins', function (e) {
        var _a, _b, _c;
        var chart = this, breadcrumbsOptions = (_a = chart.options.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs, extraMargin = chart.rangeSelector ? 40 : 30;
        if (breadcrumbsOptions && breadcrumbsOptions.enabled && !breadcrumbsOptions.floating) {
            if (((_b = breadcrumbsOptions.position) === null || _b === void 0 ? void 0 : _b.verticalAlign) === 'top' && extraMargin) {
                chart.plotTop += extraMargin;
            }
            if (((_c = breadcrumbsOptions.position) === null || _c === void 0 ? void 0 : _c.verticalAlign) === 'bottom' && extraMargin) {
                chart.marginBottom += extraMargin;
            }
        }
    });
    addEvent(Chart, 'redraw', function (e) {
        var _a, _b;
        (_b = (_a = this.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs) === null || _b === void 0 ? void 0 : _b.redraw();
    });
    addEvent(Chart, 'afterDrilldown', function (e) {
        var _a, _b, _c, _d;
        var chart = this;
        if (!((_a = chart.drilldown) === null || _a === void 0 ? void 0 : _a.breadcrumbs) && chart.drilldown) {
            chart.drilldown.breadcrumbs = new Breadcrumbs(chart, chart.options);
        }
        if (chart.drilldown && ((_c = (_b = chart.options.drilldown) === null || _b === void 0 ? void 0 : _b.breadcrumbs) === null || _c === void 0 ? void 0 : _c.enabled) && ((_d = chart.drilldown) === null || _d === void 0 ? void 0 : _d.breadcrumbs)) {
            chart.drilldown.breadcrumbs.createList();
            chart.drilldown.breadcrumbs.draw();
        }
    });
}
export default H.Breadcrumbs;
