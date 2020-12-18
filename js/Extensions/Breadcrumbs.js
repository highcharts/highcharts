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
var addEvent = U.addEvent, defined = U.defined, extend = U.extend, format = U.format;
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
    mainBreadCrumb: 'Main'
});
extend(defaultOptions, {
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
        * Show only last button instead of whole drillUp tree.
        *
        * @type      {boolean}
        * @since     next
        */
        showOnlyLast: true,
        /**
        * Enable or disable the breadcrumbs.
        *
        * @type      {boolean}
        * @since     next
        */
        enabled: true,
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
        * to make space for it. By default, the chart will not make space
        * for the buttons.
        * This property won't work when positioned in the middle.
        *
        * @type      {boolean}
        * @since     next
        */
        floating: true,
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
        var chartOptions = H.merge(userOptions, this.options), breadcrumbsOptions = chart.options.breadcrumbs;
        this.chart = chart;
        this.options = breadcrumbsOptions || {};
    };
    /**
     * Align the breadcrumbs group.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#alingGroup
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     */
    Breadcrumbs.prototype.alignGroup = function () {
        var chart = this.chart, breadcrumbsOptions = this.options, bBox = this.breadcrumbsGroup.getBBox(), rangeSelector = chart.rangeSelector, positionOptions = breadcrumbsOptions.position;
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
        }
        else if (drilldownLevels && drilldownLevels.length) {
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
     * Destroy the chosen buttons and separators.
     *
     * @requires  modules/breadcrumbs
     *
     * @function Highcharts.Breadcrumbs#destroy
     * @param {Highcharts.Breadcrumbs} this
     *        Breadcrumbs class.
     * @param {Highcharts.Breadcrumbs} lastVisibleLevel
     *        Number of levels to destoy.
     */
    Breadcrumbs.prototype.destroy = function (lastVisibleLevel) {
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = chart.options.breadcrumbs;
        // Click the main breadcrumb
        if (!lastVisibleLevel && lastVisibleLevel !== 0) {
            breadcrumbsList.forEach(function (el) {
                var button = el[2], separator = el[3];
                // Remove SVG elements fromt the DOM.
                button && button.destroy();
                separator && separator.destroy();
            });
            // Clear the breadcrums list array.
            breadcrumbsList.length = 0;
        }
        else {
            var prevConector = breadcrumbsList[lastVisibleLevel + 1][3];
            // Remove connector from the previous button.
            prevConector && prevConector.destroy();
            breadcrumbsList[lastVisibleLevel + 1].length = 3;
            for (var i = lastVisibleLevel + 2; i < breadcrumbsList.length; i++) {
                var el = breadcrumbsList[i], button = el[2], conector = el[3];
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
        var breadcrumbs = this, chart = breadcrumbs.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = chart.options.breadcrumbs, lastBreadcrumbs = breadcrumbsList[breadcrumbsList.length - 2] &&
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
            if (breadcrumbsOptions.showOnlyLast) {
                var previousBreadcrumb = breadcrumbsList[breadcrumbsList.length - 2];
                if (!chart.drillUpButton) {
                    chart.drillUpButton = breadcrumbs.renderButton(previousBreadcrumb, posX_1, posY_1);
                }
                else {
                    var drilldownLevels = chart.drilldownLevels;
                    var level = void 0;
                    // Calculate on which level we are now.
                    if (chart.series[0].is('treemap')) {
                        level = Math.abs(chart.series[0].tree.levelDynamic) - 1;
                    }
                    else {
                        level = drilldownLevels && drilldownLevels[drilldownLevels.length - 1] &&
                            drilldownLevels[drilldownLevels.length - 1].levelNumber || 0;
                    }
                    // Update button.
                    if (drilldownLevels && !drilldownLevels.length || level === -1) {
                        chart.drillUpButton.destroy();
                        chart.drillUpButton = void 0;
                    }
                    else {
                        chart.drillUpButton.attr({
                            text: '◁ ' + breadcrumbsList[level][1].name
                        });
                    }
                }
            }
            else {
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
        var chart = this.chart, breadcrumbsList = this.breadcrumbsList, drillNumb = defined(drillAmount) ?
            breadcrumbsList[breadcrumbsList.length - 1][0] - drillAmount :
            breadcrumbsList[breadcrumbsList.length - 1][0] + 1;
        if (breadcrumbsList && breadcrumbsList.length) {
            for (var i = 0; i < drillNumb; i++) {
                if (chart.series[0].is('treemap')) {
                    chart.series[0].drillUp();
                }
                else {
                    chart.drillUp();
                }
            }
        }
        this.destroy(drillAmount);
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
        if (breadcrumbsGroup && this.breadcrumbsList.length) {
            this.alignGroup();
        }
        this.createList();
        this.draw();
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
        var breadcrumbs = this, chart = this.chart, breadcrumbsList = breadcrumbs.breadcrumbsList, breadcrumbsOptions = chart.options.breadcrumbs, lang = chart.options.lang;
        var arrow = '';
        if (breadcrumbsOptions && breadcrumb && breadcrumb[1]) {
            if (breadcrumbsOptions && breadcrumbsOptions.showOnlyLast) {
                arrow = '◁ ';
            }
            var button_1 = chart.renderer.button(breadcrumbsOptions.formatter ? breadcrumbsOptions.formatter(breadcrumb, breadcrumbs) : void 0 ||
                format(arrow + breadcrumbsOptions.format, { value: breadcrumb[1].name || (lang && lang.mainBreadCrumb) }, chart), posX, posY, function (e) {
                // extract events from button object and call
                var buttonEvents = breadcrumbsOptions.events && breadcrumbsOptions.events.click;
                var callDefaultEvent;
                if (buttonEvents) {
                    callDefaultEvent = buttonEvents.call(breadcrumbsOptions, e, breadcrumbs);
                }
                // Prevent from click on the current level
                if (callDefaultEvent !== false &&
                    breadcrumbsList[breadcrumbsList.length - 1][1].name !== button_1.textStr &&
                    !breadcrumbsOptions.showOnlyLast) {
                    breadcrumbs.multipleDrillUp(breadcrumb[0]);
                }
                if (callDefaultEvent !== false &&
                    breadcrumbsOptions.showOnlyLast) {
                    if (chart.series[0].is('treemap')) {
                        chart.series[0].drillUp();
                    }
                    else {
                        chart.drillUp();
                    }
                }
            })
                .attr({
                padding: 3
            })
                .css(breadcrumbsOptions.style)
                .addClass('highcharts-breadcrumbs-button')
                .add(breadcrumbs.breadcrumbsGroup);
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
    * @return {SVGElement|void}
    *        Returns the SVG button
    */
    Breadcrumbs.prototype.renderSeparator = function (posX, posY) {
        var breadcrumbs = this, chart = this.chart, breadcrumbsOptions = chart.options.breadcrumbs, size = 10;
        if (breadcrumbsOptions) {
            var separatorSymbol = breadcrumbsOptions.separator, serparatorRotation = separatorSymbol && separatorSymbol.slice(0, 3) === 'url' ? 0 : 90;
            var separator = chart.renderer.symbol(separatorSymbol, posX, posY, size, size)
                .attr({
                fill: 'white',
                stroke: 'black',
                'stroke-width': 1,
                rotation: serparatorRotation,
                rotationOriginX: posX,
                rotationOriginY: posY
            })
                .add(breadcrumbs.breadcrumbsGroup)
                .addClass('highcharts-breadcrumbs-separator'), separatorBBox = separator.getBBox();
            separator.translate(separatorBBox.width, separatorBBox.height / 2);
            return separator;
        }
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
        H.merge(true, this.chart.options.breadcrumbs, userOptions);
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
        var chart = this, breadcrumbsOptions = chart.options.breadcrumbs, defaultBreadcrumheight = 35, // TO DO: calculate that height
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
        var _a;
        (_a = this.breadcrumbs) === null || _a === void 0 ? void 0 : _a.redraw();
    });
    addEvent(Chart, 'afterDrilldown', function (e) {
        var chart = this, breadcrumbs = chart.breadcrumbs, breadcrumbsOptions = chart.options.breadcrumbs;
        if (breadcrumbsOptions && breadcrumbsOptions.enabled) {
            if (!breadcrumbs) {
                chart.breadcrumbs = new Breadcrumbs(chart, chart.options);
            }
            chart.breadcrumbs.redraw();
        }
    });
    addEvent(H.Series, 'setRootNode', function (e) {
        var _a, _b;
        var chart = this.chart;
        if (chart.options.breadcrumbs) {
            if (!chart.breadcrumbs) {
                chart.breadcrumbs = new Breadcrumbs(chart, chart.options);
            }
            // Create a list using the event after drilldown.
            if (e.trigger === 'click' || !e.trigger) {
                (_a = chart.breadcrumbs) === null || _a === void 0 ? void 0 : _a.createList(e);
                (_b = chart.breadcrumbs) === null || _b === void 0 ? void 0 : _b.draw();
            }
        }
    });
}
export default H.Breadcrumbs;
