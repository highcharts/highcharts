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
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import O from '../Core/Options.js';
var defaultOptions = O.defaultOptions;
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, defined = U.defined, extend = U.extend, format = U.format, merge = U.merge;
// Add language support.
extend(defaultOptions.lang, 
/**
 * @optionparent lang
 */
{
    /**
     * @since    next
     * @product  highcharts
     */
    mainBreadcrumb: 'Main'
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
    function Breadcrumbs(chart, userOptions, isTreemap) {
        this.chart = void 0;
        this.breadcrumbsGroup = void 0;
        this.breadcrumbsList = [];
        this.isDirty = true;
        this.isTreemap = void 0;
        this.level = -1;
        this.options = void 0;
        this.init(chart, userOptions, isTreemap);
    }
    Breadcrumbs.prototype.init = function (chart, userOptions, isTreemap) {
        var chartOptions = merge(Breadcrumbs.defaultBreadcrumbsOptions, userOptions);
        this.chart = chart;
        this.options = chartOptions || {};
        this.isTreemap = isTreemap;
    };
    /**
     * Align the breadcrumbs group depending on the alignment.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.alignGroup = function () {
        var chart = this.chart, breadcrumbsOptions = this.options, bBox = this.breadcrumbsGroup && this.breadcrumbsGroup.getBBox(), rangeSelector = chart.rangeSelector, positionOptions = breadcrumbsOptions.position;
        if (positionOptions) {
            // Create a deep copy.
            var calcPosition = {
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
                    var rangeSelectorBBox = rangeSelector.group.getBBox(), rangeSelectorY = rangeSelectorBBox.y, rangeSelectorHight = rangeSelectorBBox.height;
                    calcPosition.y += (rangeSelectorY + rangeSelectorHight) || 0;
                }
            }
            if (positionOptions.verticalAlign === 'bottom' && chart.marginBottom) {
                if (chart.legend && chart.legend.group && chart.legend.options.verticalAlign === 'bottom') {
                    calcPosition.y -= chart.marginBottom -
                        bBox.height -
                        chart.legend.legendHeight;
                }
                else {
                    calcPosition.y -= bBox.height;
                }
            }
            if (positionOptions.align === 'right') {
                calcPosition.x -= bBox.width;
            }
            else if (positionOptions.align === 'center') {
                calcPosition.x -= bBox.width / 2;
            }
            this.breadcrumbsGroup
                .align(calcPosition, true, chart.spacingBox);
        }
    };
    /**
     * Calcule level on which chart currently is.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#calculateLevel
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.calculateLevel = function () {
        var chart = this.chart, drilldownLevels = chart.drilldownLevels;
        // Calculate on which level we are now.
        if (this.isTreemap && chart.series[0].tree) {
            this.level = Math.abs(chart.series[0].tree.levelDynamic) - 1;
        }
        else {
            this.level = drilldownLevels && drilldownLevels[drilldownLevels.length - 1] &&
                drilldownLevels[drilldownLevels.length - 1].levelNumber || 0;
        }
    };
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
    Breadcrumbs.prototype.createList = function (e) {
        var breadcrumbsList = this.breadcrumbsList || [], chart = this.chart, drilldownLevels = chart.drilldownLevels;
        // If the list doesn't exist treat the initial series
        // as the current level- first iteration.
        var currentLevelNumber = breadcrumbsList.length ?
            breadcrumbsList[breadcrumbsList.length - 1][0] : null;
        if (this.isTreemap && e) {
            if (!breadcrumbsList[0]) {
                // As a first element add the series.
                breadcrumbsList.push([null, chart.series[0]]);
            }
            if (e.trigger === 'click') {
                // When a user clicks add element one by one.
                if (currentLevelNumber === null) {
                    breadcrumbsList.push([0, chart.get(e.newRootId)]);
                    currentLevelNumber = 0;
                }
                else {
                    breadcrumbsList.push([currentLevelNumber + 1, chart.get(e.newRootId)]);
                }
            }
            else {
                var node = e.target.nodeMap[e.newRootId];
                var extraNodes = [];
                // When the root node is set and has parent,
                // recreate the path from the node tree.
                while (node.parent || node.parent === '') {
                    extraNodes.push(node);
                    node = e.target.nodeMap[node.parent];
                }
                extraNodes.reverse().forEach(function (node) {
                    if (currentLevelNumber === null) {
                        breadcrumbsList.push([0, node]);
                        currentLevelNumber = 0;
                    }
                    else {
                        breadcrumbsList.push([++currentLevelNumber, node]);
                    }
                });
            }
        }
        if (!this.isTreemap && drilldownLevels && drilldownLevels.length) {
            // Add the initial series as the first element.
            if (!breadcrumbsList[0]) {
                breadcrumbsList.push([null, drilldownLevels[0].seriesOptions]);
                currentLevelNumber = -1;
            }
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
    Breadcrumbs.prototype.defaultFormatter = function (breadcrumb) {
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsOptions = breadcrumbs.options, arrow = breadcrumbsOptions.showFullPath ? '' : '◁ ', lang = chart.options.lang;
        return breadcrumbsOptions.formatter && breadcrumbsOptions.formatter(breadcrumb, breadcrumbs) ||
            arrow + (format(breadcrumbsOptions.format, { point: breadcrumb[1] }, chart) ||
                lang.mainBreadcrumb);
    };
    /**
     * Destroy the chosen buttons and separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#destroyGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.destroyGroup = function () {
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = breadcrumbs.options;
        // The full path of buttons is visible.
        if (breadcrumbsOptions && breadcrumbsOptions.showFullPath && this.breadcrumbsGroup) {
            breadcrumbsList.forEach(function (el) {
                var button = el[2], separator = el[3];
                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                separator && separator.destroy();
            });
            // Clear the breadcrums list array.
            breadcrumbsList.length = 0;
            this.breadcrumbsGroup.destroy();
            this.breadcrumbsGroup = void 0;
        }
        else {
            var drilldownLevels = chart.drilldownLevels;
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
    };
    /**
     * Create a group, then draw breadcrumbs together with the separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#draw
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.draw = function () {
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = breadcrumbs.options, lastBreadcrumbs = breadcrumbsList[breadcrumbsList.length - 2] &&
            breadcrumbsList[breadcrumbsList.length - 2][2], buttonPadding = breadcrumbsOptions && breadcrumbsOptions.buttonPadding;
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
            var posX_1 = lastBreadcrumbs ? lastBreadcrumbs.x +
                lastBreadcrumbs.element.getBBox().width + buttonPadding : 0;
            var posY_1 = buttonPadding;
            if (breadcrumbsOptions.showFullPath) {
                // Make sure that only one type of button is visible.
                if (chart.drillUpButton) {
                    chart.drillUpButton.destroy();
                    chart.drillUpButton = void 0;
                }
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
            }
            else {
                var previousBreadcrumb = breadcrumbsList[breadcrumbsList.length - 2], drilldownLevels = chart.drilldownLevels;
                if (!chart.drillUpButton &&
                    ((drilldownLevels && drilldownLevels.length) ||
                        (this.isTreemap && this.level >= 0))) {
                    chart.drillUpButton = breadcrumbs.renderButton(previousBreadcrumb, posX_1, posY_1);
                }
                else if (chart.drillUpButton) {
                    // Update button.
                    this.updateSingleButton();
                }
            }
        }
        breadcrumbs.alignGroup();
    };
    /**
     * Performs multiple drillups based on the provided number.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#multipleDrillUp
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} drillAmount
     *        A number of drillups that needs to be performed.
     */
    Breadcrumbs.prototype.multipleDrillUp = function (drillAmount) {
        var chart = this.chart, breadcrumbsList = this.breadcrumbsList, drillNumber = defined(drillAmount) ?
            breadcrumbsList[breadcrumbsList.length - 1][0] - drillAmount :
            breadcrumbsList[breadcrumbsList.length - 1][0] + 1;
        if (this.options.showFullPath) {
            if (breadcrumbsList && breadcrumbsList.length) {
                for (var i = 0; i < drillNumber; i++) {
                    if (this.isTreemap) {
                        chart.series[0].drillUp();
                    }
                    else {
                        chart.drillUp();
                    }
                }
            }
        }
        else {
            this.destroyGroup();
            if (this.isTreemap) {
                chart.series[0].drillUp();
            }
            else {
                chart.drillUp();
            }
        }
    };
    /**
    * Redraw.
    *
    * @requires  modules/breadcrums
    *
    * @function Highcharts.Breadcrumbs#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.redraw = function () {
        var breadcrumbsGroup = this.breadcrumbsGroup;
        this.calculateLevel();
        if (this.isDirty) {
            this.createList();
            this.draw();
        }
        if (breadcrumbsGroup && this.breadcrumbsList.length) {
            this.alignGroup();
        }
        this.isDirty = false;
    };
    /**
    * Reset list after the drillUp.
    *
    * @requires  modules/breadcrums
    *
    * @function Highcharts.Breadcrumbs#redraw
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.resetList = function () {
        var breadcrumbsList = this.breadcrumbsList;
        if (this.level === 0) {
            this.destroyGroup();
        }
        else {
            if (this.options.showFullPath) {
                var el = breadcrumbsList[breadcrumbsList.length - 1], button = el && el[2], conector = el && el[3], prevConector = breadcrumbsList[breadcrumbsList.length - 2] &&
                    breadcrumbsList[breadcrumbsList.length - 2][3];
                // Remove connector from the previous button.
                prevConector && prevConector.destroy();
                breadcrumbsList[breadcrumbsList.length - 2].length = 3;
                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                conector && conector.destroy();
            }
            else {
                this.updateSingleButton();
            }
            breadcrumbsList.pop();
        }
    };
    /**
    * Render the button.
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
    Breadcrumbs.prototype.renderButton = function (breadcrumb, posX, posY) {
        var breadcrumbs = this, chart = this.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = breadcrumbs.options, lang = chart.options.lang;
        if (breadcrumbsOptions && breadcrumb && breadcrumb[1]) {
            var button_1 = chart.renderer.button(breadcrumbs.defaultFormatter(breadcrumb), posX, posY, function (e) {
                // Extract events from button object and call
                var buttonEvents = breadcrumbsOptions.events && breadcrumbsOptions.events.click;
                var callDefaultEvent;
                if (buttonEvents) {
                    callDefaultEvent = buttonEvents.call(breadcrumbsOptions, e, breadcrumbs);
                }
                // Prevent from click on the current level
                if (callDefaultEvent !== false &&
                    breadcrumbsList[breadcrumbsList.length - 1][1].name !== button_1.textStr &&
                    breadcrumbsOptions.showFullPath) {
                    breadcrumbs.multipleDrillUp(breadcrumb[0]);
                }
                if (callDefaultEvent !== false && !breadcrumbsOptions.showFullPath) {
                    breadcrumbs.multipleDrillUp(null);
                }
            })
                .attr({
                padding: 3
            })
                .addClass('highcharts-breadcrumbs-button')
                .add(breadcrumbs.breadcrumbsGroup);
            if (!chart.styledMode) {
                button_1.attr(breadcrumbsOptions.style);
            }
            return button_1;
        }
    };
    /**
    * Render the separator.
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
    * @return {SVGElement}
    *        Returns the SVG button
    */
    Breadcrumbs.prototype.renderSeparator = function (posX, posY) {
        var breadcrumbs = this, chart = this.chart, breadcrumbsOptions = breadcrumbs.options, size = 10, separatorOptions = breadcrumbsOptions.separator;
        var separator, separatorBBox;
        if (separatorOptions) {
            separator = chart.renderer.symbol(separatorOptions.symbol, posX, posY, separatorOptions.size, separatorOptions.size).add(breadcrumbs.breadcrumbsGroup)
                .addClass('highcharts-breadcrumbs-separator');
            separatorBBox = separator.getBBox();
            if (!chart.styledMode) {
                separator.css({
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 1
                });
            }
            separator.translate(0, separatorBBox.height / 2);
        }
        return separator;
    };
    /**
    * Update.
    * @function Highcharts.Breadcrumbs#update
    *
    * @requires  modules/breadcrumbs
    *
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    * @param {Highcharts.BreadcrumbsOptions} userOptions
    *        Breadcrumbs class.
    * @param {boolean} redrawFlag
    *        Redraw flag
    */
    Breadcrumbs.prototype.update = function (userOptions, redrawFlag) {
        if (redrawFlag === void 0) { redrawFlag = true; }
        merge(true, this.options, userOptions);
        if (redrawFlag) {
            this.destroyGroup();
            this.redraw();
        }
    };
    /**
    * Update button text when the showFullPath set to false.
    * @function Highcharts.Breadcrumbs#updateSingleButton
    *
    * @requires  modules/breadcrumbs
    *
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.updateSingleButton = function () {
        var chart = this.chart, breadcrumbsOptions = this.options, breadcrumbsList = this.breadcrumbsList, currentBreadcrumb = breadcrumbsList[this.level], lang = chart.options.lang;
        if (chart.drillUpButton && breadcrumbsOptions && lang) {
            chart.drillUpButton.attr({
                text: this.defaultFormatter(currentBreadcrumb)
            });
        }
    };
    /**
    * Set margins if the floating: false.
    * @function Highcharts.Breadcrumbs#update
    *
    * @requires  modules/breadcrumbs
    *
    * @param {Highcharts.Breadcrumbs} this
    *        Breadcrumbs class.
    */
    Breadcrumbs.prototype.setMargins = function () {
        var chart = this.chart, breadcrumbsOptions = this.options, defaultBreadcrumheight = 35, // TO DO: calculate that height
        extraMargin = chart.rangeSelector ? chart.rangeSelector.getHeight() : defaultBreadcrumheight;
        if (breadcrumbsOptions &&
            !breadcrumbsOptions.floating &&
            chart.breadcrumbs &&
            chart.breadcrumbs.breadcrumbsList &&
            chart.breadcrumbs.breadcrumbsList.length) {
            chart.yAxis[0].options.offsets = [extraMargin, 0, 0, 0];
        }
        else {
            chart.yAxis[0].options.offsets = [0, 0, 0, 0];
        }
    };
    /**
     * Options for breadcrumbs
     *
     * @since   next
     * @product highcharts
     */
    Breadcrumbs.defaultBreadcrumbsOptions = {
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
         * @type      {Highcharts.DrilldownBreadcrumbsClickCallbackFunction}
         * @since     next
         * @apioption breadcrumbs.events.click
         */
        /**
         * When the breadcrumbs is floating, the plot area will not move
         * to make space for it. By default, the chart will not make space
         * for the buttons.
         * This property won't work when positioned in the middle.
         *
         * @sample {highcharts} highcharts/breadcrumbs/floating
         *          Organization chart drilldown
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
         * @param {Highcharts.Breadcrumbs} breadcrumbs
         *        The breadcrumbs instance
         *
         * @return {string}
         *         Formatted text or false
         * @since    next
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
             * A size of the separator
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
         * A CSS styles for all breadcrumbs.
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
    };
    return Breadcrumbs;
}());
/* eslint-disable no-invalid-this */
if (!H.Breadcrumbs) {
    H.Breadcrumbs = Breadcrumbs;
    addEvent(Chart, 'setOffsets', function () {
        this.breadcrumbs && this.breadcrumbs.setMargins();
    });
    addEvent(Chart, 'update', function (e) {
        var breadcrumbs = this.breadcrumbs;
        if (breadcrumbs && e.options.drilldown && e.options.drilldown.breadcrumbs) {
            breadcrumbs.isDirty = true;
            breadcrumbs.update(e.options.drilldown.breadcrumbs, false);
            breadcrumbs.redraw();
        }
    });
    addEvent(Chart, 'redraw', function () {
        this.breadcrumbs && this.breadcrumbs.redraw();
    });
    addEvent(Chart, 'beforeDrillUp', function () {
        if (this.breadcrumbs) {
            this.breadcrumbs.isDirty = true;
            this.breadcrumbs.resetList();
        }
    });
    addEvent(Chart, 'applyDrilldown', function () {
        var chart = this, breadcrumbs = chart.breadcrumbs, breadcrumbsOptions = chart.options.drilldown && chart.options.drilldown.breadcrumbs;
        if (!breadcrumbs) {
            chart.breadcrumbs = new Breadcrumbs(chart, breadcrumbsOptions, false);
            chart.breadcrumbs.createList();
        }
        else {
            breadcrumbs.isDirty = true;
            breadcrumbs.redraw();
        }
    });
    var treemapEventsAdded_1 = false;
    // Causes some troubles in karma tests.
    addEvent(Chart, 'init', function () {
        if (H.seriesTypes.treemap && !treemapEventsAdded_1) {
            addEvent(H.seriesTypes.treemap, 'setRootNode', function (e) {
                var chart = this.chart, breadcrumbsOptions = this.options.breadcrumbs;
                if (!chart.breadcrumbs) {
                    chart.breadcrumbs = new Breadcrumbs(chart, breadcrumbsOptions, true);
                }
                if (chart.breadcrumbs) {
                    chart.breadcrumbs.isDirty = true;
                    // Create a list using the event after drilldown.
                    if (e.trigger === 'click' || !e.trigger) {
                        chart.breadcrumbs.createList(e);
                        chart.breadcrumbs.draw();
                    }
                    if (e.trigger === 'traverseUpButton') {
                        chart.breadcrumbs.resetList();
                    }
                }
            });
            addEvent(H.seriesTypes.treemap, 'update', function (e) {
                var breadcrumbs = this.chart.breadcrumbs;
                if (breadcrumbs && e.options.breadcrumbs) {
                    breadcrumbs.isDirty = true;
                    breadcrumbs.update(e.options.breadcrumbs, false);
                    breadcrumbs.redraw();
                }
            });
            treemapEventsAdded_1 = true;
        }
    });
    // Remove resize/afterSetExtremes at chart destroy
    addEvent(Chart, 'destroy', function destroyEvents() {
        if (this.breadcrumbs) {
            this.breadcrumbs.destroyGroup(void 0);
            this.breadcrumbs = void 0;
        }
    });
}
export default H.Breadcrumbs;
