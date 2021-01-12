/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Axis from './Axis/Axis.js';
import H from './Globals.js';
import palette from './Color/Palette.js';
import ScrollbarAxis from './Axis/ScrollbarAxis.js';
import U from './Utilities.js';
var addEvent = U.addEvent, correctFloat = U.correctFloat, defined = U.defined, destroyObjectProperties = U.destroyObjectProperties, fireEvent = U.fireEvent, merge = U.merge, pick = U.pick, removeEvent = U.removeEvent;
import O from './Options.js';
var defaultOptions = O.defaultOptions;
var isTouchDevice = H.isTouchDevice;
/**
 * When we have vertical scrollbar, rifles and arrow in buttons should be
 * rotated. The same method is used in Navigator's handles, to rotate them.
 *
 * @function Highcharts.swapXY
 *
 * @param {Highcharts.SVGPathArray} path
 * Path to be rotated.
 *
 * @param {boolean} [vertical]
 * If vertical scrollbar, swap x-y values.
 *
 * @return {Highcharts.SVGPathArray}
 * Rotated path.
 *
 * @requires modules/stock
 */
var swapXY = H.swapXY = function (path, vertical) {
    if (vertical) {
        path.forEach(function (seg) {
            var len = seg.length;
            var temp;
            for (var i = 0; i < len; i += 2) {
                temp = seg[i + 1];
                if (typeof temp === 'number') {
                    seg[i + 1] = seg[i + 2];
                    seg[i + 2] = temp;
                }
            }
        });
    }
    return path;
};
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A reusable scrollbar, internally used in Highstock's navigator and optionally
 * on individual axes.
 *
 * @private
 * @class
 * @name Highcharts.Scrollbar
 * @param {Highcharts.SVGRenderer} renderer
 * @param {Highcharts.ScrollbarOptions} options
 * @param {Highcharts.Chart} chart
 */
var Scrollbar = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function Scrollbar(renderer, options, chart) {
        /* *
         *
         *  Properties
         *
         * */
        this._events = [];
        this.chartX = 0;
        this.chartY = 0;
        this.from = 0;
        this.group = void 0;
        this.scrollbar = void 0;
        this.scrollbarButtons = [];
        this.scrollbarGroup = void 0;
        this.scrollbarLeft = 0;
        this.scrollbarRifles = void 0;
        this.scrollbarStrokeWidth = 1;
        this.scrollbarTop = 0;
        this.size = 0;
        this.to = 0;
        this.track = void 0;
        this.trackBorderWidth = 1;
        this.userOptions = {};
        this.x = 0;
        this.y = 0;
        this.chart = chart;
        this.options = options;
        this.renderer = chart.renderer;
        this.init(renderer, options, chart);
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Set up the mouse and touch events for the Scrollbar
     *
     * @private
     * @function Highcharts.Scrollbar#addEvents
     * @return {void}
     */
    Scrollbar.prototype.addEvents = function () {
        var buttonsOrder = this.options.inverted ? [1, 0] : [0, 1], buttons = this.scrollbarButtons, bar = this.scrollbarGroup.element, track = this.track.element, mouseDownHandler = this.mouseDownHandler.bind(this), mouseMoveHandler = this.mouseMoveHandler.bind(this), mouseUpHandler = this.mouseUpHandler.bind(this), _events;
        // Mouse events
        _events = [
            [buttons[buttonsOrder[0]].element, 'click', this.buttonToMinClick.bind(this)],
            [buttons[buttonsOrder[1]].element, 'click', this.buttonToMaxClick.bind(this)],
            [track, 'click', this.trackClick.bind(this)],
            [bar, 'mousedown', mouseDownHandler],
            [bar.ownerDocument, 'mousemove', mouseMoveHandler],
            [bar.ownerDocument, 'mouseup', mouseUpHandler]
        ];
        // Touch events
        if (H.hasTouch) {
            _events.push([bar, 'touchstart', mouseDownHandler], [bar.ownerDocument, 'touchmove', mouseMoveHandler], [bar.ownerDocument, 'touchend', mouseUpHandler]);
        }
        // Add them all
        _events.forEach(function (args) {
            addEvent.apply(null, args);
        });
        this._events = _events;
    };
    Scrollbar.prototype.buttonToMaxClick = function (e) {
        var scroller = this;
        var range = (scroller.to - scroller.from) * pick(scroller.options.step, 0.2);
        scroller.updatePosition(scroller.from + range, scroller.to + range);
        fireEvent(scroller, 'changed', {
            from: scroller.from,
            to: scroller.to,
            trigger: 'scrollbar',
            DOMEvent: e
        });
    };
    Scrollbar.prototype.buttonToMinClick = function (e) {
        var scroller = this;
        var range = correctFloat(scroller.to - scroller.from) *
            pick(scroller.options.step, 0.2);
        scroller.updatePosition(correctFloat(scroller.from - range), correctFloat(scroller.to - range));
        fireEvent(scroller, 'changed', {
            from: scroller.from,
            to: scroller.to,
            trigger: 'scrollbar',
            DOMEvent: e
        });
    };
    /**
     * Get normalized (0-1) cursor position over the scrollbar
     *
     * @private
     * @function Highcharts.Scrollbar#cursorToScrollbarPosition
     *
     * @param  {*} normalizedEvent
     *         normalized event, with chartX and chartY values
     *
     * @return {Highcharts.Dictionary<number>}
     *         Local position {chartX, chartY}
     */
    Scrollbar.prototype.cursorToScrollbarPosition = function (normalizedEvent) {
        var scroller = this, options = scroller.options, minWidthDifference = options.minWidth > scroller.calculatedWidth ?
            options.minWidth :
            0; // minWidth distorts translation
        return {
            chartX: (normalizedEvent.chartX - scroller.x -
                scroller.xOffset) /
                (scroller.barWidth - minWidthDifference),
            chartY: (normalizedEvent.chartY - scroller.y -
                scroller.yOffset) /
                (scroller.barWidth - minWidthDifference)
        };
    };
    /**
     * Destroys allocated elements.
     *
     * @private
     * @function Highcharts.Scrollbar#destroy
     * @return {void}
     */
    Scrollbar.prototype.destroy = function () {
        var scroller = this.chart.scroller;
        // Disconnect events added in addEvents
        this.removeEvents();
        // Destroy properties
        [
            'track',
            'scrollbarRifles',
            'scrollbar',
            'scrollbarGroup',
            'group'
        ].forEach(function (prop) {
            if (this[prop] && this[prop].destroy) {
                this[prop] = this[prop].destroy();
            }
        }, this);
        // #6421, chart may have more scrollbars
        if (scroller && this === scroller.scrollbar) {
            scroller.scrollbar = null;
            // Destroy elements in collection
            destroyObjectProperties(scroller.scrollbarButtons);
        }
    };
    /**
     * Draw the scrollbar buttons with arrows
     *
     * @private
     * @function Highcharts.Scrollbar#drawScrollbarButton
     * @param {number} index
     *        0 is left, 1 is right
     * @return {void}
     */
    Scrollbar.prototype.drawScrollbarButton = function (index) {
        var scroller = this, renderer = scroller.renderer, scrollbarButtons = scroller.scrollbarButtons, options = scroller.options, size = scroller.size, group, tempElem;
        group = renderer.g().add(scroller.group);
        scrollbarButtons.push(group);
        // Create a rectangle for the scrollbar button
        tempElem = renderer.rect()
            .addClass('highcharts-scrollbar-button')
            .add(group);
        // Presentational attributes
        if (!this.chart.styledMode) {
            tempElem.attr({
                stroke: options.buttonBorderColor,
                'stroke-width': options.buttonBorderWidth,
                fill: options.buttonBackgroundColor
            });
        }
        // Place the rectangle based on the rendered stroke width
        tempElem.attr(tempElem.crisp({
            x: -0.5,
            y: -0.5,
            width: size + 1,
            height: size + 1,
            r: options.buttonBorderRadius
        }, tempElem.strokeWidth()));
        // Button arrow
        tempElem = renderer
            .path(swapXY([[
                'M',
                size / 2 + (index ? -1 : 1),
                size / 2 - 3
            ], [
                'L',
                size / 2 + (index ? -1 : 1),
                size / 2 + 3
            ], [
                'L',
                size / 2 + (index ? 2 : -2),
                size / 2
            ]], options.vertical))
            .addClass('highcharts-scrollbar-arrow')
            .add(scrollbarButtons[index]);
        if (!this.chart.styledMode) {
            tempElem.attr({
                fill: options.buttonArrowColor
            });
        }
    };
    /**
     * @private
     * @function Highcharts.Scrollbar#init
     * @param {Highcharts.SVGRenderer} renderer
     * @param {Highcharts.ScrollbarOptions} options
     * @param {Highcharts.Chart} chart
     */
    Scrollbar.prototype.init = function (renderer, options, chart) {
        this.scrollbarButtons = [];
        this.renderer = renderer;
        this.userOptions = options;
        this.options = merge(Scrollbar.defaultOptions, options);
        this.chart = chart;
        // backward compatibility
        this.size = pick(this.options.size, this.options.height);
        // Init
        if (options.enabled) {
            this.render();
            this.addEvents();
        }
    };
    Scrollbar.prototype.mouseDownHandler = function (e) {
        var scroller = this;
        var normalizedEvent = scroller.chart.pointer.normalize(e), mousePosition = scroller.cursorToScrollbarPosition(normalizedEvent);
        scroller.chartX = mousePosition.chartX;
        scroller.chartY = mousePosition.chartY;
        scroller.initPositions = [scroller.from, scroller.to];
        scroller.grabbedCenter = true;
    };
    /**
     * Event handler for the mouse move event.
     * @private
     */
    Scrollbar.prototype.mouseMoveHandler = function (e) {
        var scroller = this;
        var normalizedEvent = scroller.chart.pointer.normalize(e), options = scroller.options, direction = options.vertical ? 'chartY' : 'chartX', initPositions = scroller.initPositions || [], scrollPosition, chartPosition, change;
        // In iOS, a mousemove event with e.pageX === 0 is fired when
        // holding the finger down in the center of the scrollbar. This
        // should be ignored.
        if (scroller.grabbedCenter &&
            // #4696, scrollbar failed on Android
            (!e.touches || e.touches[0][direction] !== 0)) {
            chartPosition = scroller.cursorToScrollbarPosition(normalizedEvent)[direction];
            scrollPosition = scroller[direction];
            change = chartPosition - scrollPosition;
            scroller.hasDragged = true;
            scroller.updatePosition(initPositions[0] + change, initPositions[1] + change);
            if (scroller.hasDragged) {
                fireEvent(scroller, 'changed', {
                    from: scroller.from,
                    to: scroller.to,
                    trigger: 'scrollbar',
                    DOMType: e.type,
                    DOMEvent: e
                });
            }
        }
    };
    /**
     * Event handler for the mouse up event.
     * @private
     */
    Scrollbar.prototype.mouseUpHandler = function (e) {
        var scroller = this;
        if (scroller.hasDragged) {
            fireEvent(scroller, 'changed', {
                from: scroller.from,
                to: scroller.to,
                trigger: 'scrollbar',
                DOMType: e.type,
                DOMEvent: e
            });
        }
        scroller.grabbedCenter =
            scroller.hasDragged =
                scroller.chartX =
                    scroller.chartY = null;
    };
    /**
     * Position the scrollbar, method called from a parent with defined
     * dimensions.
     *
     * @private
     * @function Highcharts.Scrollbar#position
     * @param {number} x
     *        x-position on the chart
     * @param {number} y
     *        y-position on the chart
     * @param {number} width
     *        width of the scrollbar
     * @param {number} height
     *        height of the scorllbar
     * @return {void}
     */
    Scrollbar.prototype.position = function (x, y, width, height) {
        var scroller = this, options = scroller.options, vertical = options.vertical, xOffset = height, yOffset = 0, method = scroller.rendered ? 'animate' : 'attr';
        scroller.x = x;
        scroller.y = y + this.trackBorderWidth;
        scroller.width = width; // width with buttons
        scroller.height = height;
        scroller.xOffset = xOffset;
        scroller.yOffset = yOffset;
        // If Scrollbar is a vertical type, swap options:
        if (vertical) {
            scroller.width = scroller.yOffset = width = yOffset = scroller.size;
            scroller.xOffset = xOffset = 0;
            scroller.barWidth = height - width * 2; // width without buttons
            scroller.x = x = x + scroller.options.margin;
        }
        else {
            scroller.height = scroller.xOffset = height = xOffset =
                scroller.size;
            scroller.barWidth = width - height * 2; // width without buttons
            scroller.y = scroller.y + scroller.options.margin;
        }
        // Set general position for a group:
        scroller.group[method]({
            translateX: x,
            translateY: scroller.y
        });
        // Resize background/track:
        scroller.track[method]({
            width: width,
            height: height
        });
        // Move right/bottom button ot it's place:
        scroller.scrollbarButtons[1][method]({
            translateX: vertical ? 0 : width - xOffset,
            translateY: vertical ? height - yOffset : 0
        });
    };
    /**
     * Removes the event handlers attached previously with addEvents.
     *
     * @private
     * @function Highcharts.Scrollbar#removeEvents
     * @return {void}
     */
    Scrollbar.prototype.removeEvents = function () {
        this._events.forEach(function (args) {
            removeEvent.apply(null, args);
        });
        this._events.length = 0;
    };
    /**
     * Render scrollbar with all required items.
     *
     * @private
     * @function Highcharts.Scrollbar#render
     */
    Scrollbar.prototype.render = function () {
        var scroller = this, renderer = scroller.renderer, options = scroller.options, size = scroller.size, styledMode = this.chart.styledMode, group;
        // Draw the scrollbar group
        scroller.group = group = renderer.g('scrollbar').attr({
            zIndex: options.zIndex,
            translateY: -99999
        }).add();
        // Draw the scrollbar track:
        scroller.track = renderer.rect()
            .addClass('highcharts-scrollbar-track')
            .attr({
            x: 0,
            r: options.trackBorderRadius || 0,
            height: size,
            width: size
        }).add(group);
        if (!styledMode) {
            scroller.track.attr({
                fill: options.trackBackgroundColor,
                stroke: options.trackBorderColor,
                'stroke-width': options.trackBorderWidth
            });
        }
        this.trackBorderWidth = scroller.track.strokeWidth();
        scroller.track.attr({
            y: -this.trackBorderWidth % 2 / 2
        });
        // Draw the scrollbar itself
        scroller.scrollbarGroup = renderer.g().add(group);
        scroller.scrollbar = renderer.rect()
            .addClass('highcharts-scrollbar-thumb')
            .attr({
            height: size,
            width: size,
            r: options.barBorderRadius || 0
        }).add(scroller.scrollbarGroup);
        scroller.scrollbarRifles = renderer
            .path(swapXY([
            ['M', -3, size / 4],
            ['L', -3, 2 * size / 3],
            ['M', 0, size / 4],
            ['L', 0, 2 * size / 3],
            ['M', 3, size / 4],
            ['L', 3, 2 * size / 3]
        ], options.vertical))
            .addClass('highcharts-scrollbar-rifles')
            .add(scroller.scrollbarGroup);
        if (!styledMode) {
            scroller.scrollbar.attr({
                fill: options.barBackgroundColor,
                stroke: options.barBorderColor,
                'stroke-width': options.barBorderWidth
            });
            scroller.scrollbarRifles.attr({
                stroke: options.rifleColor,
                'stroke-width': 1
            });
        }
        scroller.scrollbarStrokeWidth = scroller.scrollbar.strokeWidth();
        scroller.scrollbarGroup.translate(-scroller.scrollbarStrokeWidth % 2 / 2, -scroller.scrollbarStrokeWidth % 2 / 2);
        // Draw the buttons:
        scroller.drawScrollbarButton(0);
        scroller.drawScrollbarButton(1);
    };
    /**
     * Set scrollbar size, with a given scale.
     *
     * @private
     * @function Highcharts.Scrollbar#setRange
     * @param {number} from
     *        scale (0-1) where bar should start
     * @param {number} to
     *        scale (0-1) where bar should end
     * @return {void}
     */
    Scrollbar.prototype.setRange = function (from, to) {
        var scroller = this, options = scroller.options, vertical = options.vertical, minWidth = options.minWidth, fullWidth = scroller.barWidth, fromPX, toPX, newPos, newSize, newRiflesPos, method = (this.rendered &&
            !this.hasDragged &&
            !(this.chart.navigator && this.chart.navigator.hasDragged)) ? 'animate' : 'attr';
        if (!defined(fullWidth)) {
            return;
        }
        from = Math.max(from, 0);
        fromPX = Math.ceil(fullWidth * from);
        toPX = fullWidth * Math.min(to, 1);
        scroller.calculatedWidth = newSize = correctFloat(toPX - fromPX);
        // We need to recalculate position, if minWidth is used
        if (newSize < minWidth) {
            fromPX = (fullWidth - minWidth + newSize) * from;
            newSize = minWidth;
        }
        newPos = Math.floor(fromPX + scroller.xOffset + scroller.yOffset);
        newRiflesPos = newSize / 2 - 0.5; // -0.5 -> rifle line width / 2
        // Store current position:
        scroller.from = from;
        scroller.to = to;
        if (!vertical) {
            scroller.scrollbarGroup[method]({
                translateX: newPos
            });
            scroller.scrollbar[method]({
                width: newSize
            });
            scroller.scrollbarRifles[method]({
                translateX: newRiflesPos
            });
            scroller.scrollbarLeft = newPos;
            scroller.scrollbarTop = 0;
        }
        else {
            scroller.scrollbarGroup[method]({
                translateY: newPos
            });
            scroller.scrollbar[method]({
                height: newSize
            });
            scroller.scrollbarRifles[method]({
                translateY: newRiflesPos
            });
            scroller.scrollbarTop = newPos;
            scroller.scrollbarLeft = 0;
        }
        if (newSize <= 12) {
            scroller.scrollbarRifles.hide();
        }
        else {
            scroller.scrollbarRifles.show(true);
        }
        // Show or hide the scrollbar based on the showFull setting
        if (options.showFull === false) {
            if (from <= 0 && to >= 1) {
                scroller.group.hide();
            }
            else {
                scroller.group.show();
            }
        }
        scroller.rendered = true;
    };
    Scrollbar.prototype.trackClick = function (e) {
        var scroller = this;
        var normalizedEvent = scroller.chart.pointer.normalize(e), range = scroller.to - scroller.from, top = scroller.y + scroller.scrollbarTop, left = scroller.x + scroller.scrollbarLeft;
        if ((scroller.options.vertical && normalizedEvent.chartY > top) ||
            (!scroller.options.vertical && normalizedEvent.chartX > left)) {
            // On the top or on the left side of the track:
            scroller.updatePosition(scroller.from + range, scroller.to + range);
        }
        else {
            // On the bottom or the right side of the track:
            scroller.updatePosition(scroller.from - range, scroller.to - range);
        }
        fireEvent(scroller, 'changed', {
            from: scroller.from,
            to: scroller.to,
            trigger: 'scrollbar',
            DOMEvent: e
        });
    };
    /**
     * Update the scrollbar with new options
     *
     * @private
     * @function Highcharts.Scrollbar#update
     * @param  {Highcharts.ScrollbarOptions} options
     * @return {void}
     */
    Scrollbar.prototype.update = function (options) {
        this.destroy();
        this.init(this.chart.renderer, merge(true, this.options, options), this.chart);
    };
    /**
     * Update position option in the Scrollbar, with normalized 0-1 scale
     *
     * @private
     * @function Highcharts.Scrollbar#updatePosition
     * @param  {number} from
     * @param  {number} to
     * @return {void}
     */
    Scrollbar.prototype.updatePosition = function (from, to) {
        if (to > 1) {
            from = correctFloat(1 - correctFloat(to - from));
            to = 1;
        }
        if (from < 0) {
            to = correctFloat(to - from);
            from = 0;
        }
        this.from = from;
        this.to = to;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     *
     * The scrollbar is a means of panning over the X axis of a stock chart.
     * Scrollbars can  also be applied to other types of axes.
     *
     * Another approach to scrollable charts is the [chart.scrollablePlotArea](
     * https://api.highcharts.com/highcharts/chart.scrollablePlotArea) option that
     * is especially suitable for simpler cartesian charts on mobile.
     *
     * In styled mode, all the presentational options for the
     * scrollbar are replaced by the classes `.highcharts-scrollbar-thumb`,
     * `.highcharts-scrollbar-arrow`, `.highcharts-scrollbar-button`,
     * `.highcharts-scrollbar-rifles` and `.highcharts-scrollbar-track`.
     *
     * @sample stock/yaxis/inverted-bar-scrollbar/
     *         A scrollbar on a simple bar chart
     *
     * @product highstock gantt
     * @optionparent scrollbar
     *
     * @private
     */
    Scrollbar.defaultOptions = {
        /**
         * The height of the scrollbar. The height also applies to the width
         * of the scroll arrows so that they are always squares. Defaults to
         * 20 for touch devices and 14 for mouse devices.
         *
         * @sample stock/scrollbar/height/
         *         A 30px scrollbar
         *
         * @type    {number}
         * @default 20/14
         */
        height: isTouchDevice ? 20 : 14,
        /**
         * The border rounding radius of the bar.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         */
        barBorderRadius: 0,
        /**
         * The corner radius of the scrollbar buttons.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         */
        buttonBorderRadius: 0,
        /**
         * Enable or disable the scrollbar.
         *
         * @sample stock/scrollbar/enabled/
         *         Disable the scrollbar, only use navigator
         *
         * @type      {boolean}
         * @default   true
         * @apioption scrollbar.enabled
         */
        /**
         * Whether to redraw the main chart as the scrollbar or the navigator
         * zoomed window is moved. Defaults to `true` for modern browsers and
         * `false` for legacy IE browsers as well as mobile devices.
         *
         * @sample stock/scrollbar/liveredraw
         *         Setting live redraw to false
         *
         * @type  {boolean}
         * @since 1.3
         */
        liveRedraw: void 0,
        /**
         * The margin between the scrollbar and its axis when the scrollbar is
         * applied directly to an axis.
         */
        margin: 10,
        /**
         * The minimum width of the scrollbar.
         *
         * @since 1.2.5
         */
        minWidth: 6,
        /**
         * Whether to show or hide the scrollbar when the scrolled content is
         * zoomed out to it full extent.
         *
         * @type      {boolean}
         * @default   true
         * @apioption scrollbar.showFull
         */
        step: 0.2,
        /**
         * The z index of the scrollbar group.
         */
        zIndex: 3,
        /**
         * The background color of the scrollbar itself.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        barBackgroundColor: palette.neutralColor20,
        /**
         * The width of the bar's border.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         */
        barBorderWidth: 1,
        /**
         * The color of the scrollbar's border.
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        barBorderColor: palette.neutralColor20,
        /**
         * The color of the small arrow inside the scrollbar buttons.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        buttonArrowColor: palette.neutralColor80,
        /**
         * The color of scrollbar buttons.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        buttonBackgroundColor: palette.neutralColor10,
        /**
         * The color of the border of the scrollbar buttons.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        buttonBorderColor: palette.neutralColor20,
        /**
         * The border width of the scrollbar buttons.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         */
        buttonBorderWidth: 1,
        /**
         * The color of the small rifles in the middle of the scrollbar.
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        rifleColor: palette.neutralColor80,
        /**
         * The color of the track background.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        trackBackgroundColor: palette.neutralColor5,
        /**
         * The color of the border of the scrollbar track.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        trackBorderColor: palette.neutralColor5,
        /**
         * The corner radius of the border of the scrollbar track.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         *
         * @type      {number}
         * @default   0
         * @apioption scrollbar.trackBorderRadius
         */
        /**
         * The width of the border of the scrollbar track.
         *
         * @sample stock/scrollbar/style/
         *         Scrollbar styling
         */
        trackBorderWidth: 1
    };
    return Scrollbar;
}());
if (!H.Scrollbar) {
    defaultOptions.scrollbar = merge(true, Scrollbar.defaultOptions, defaultOptions.scrollbar);
    H.Scrollbar = Scrollbar;
    ScrollbarAxis.compose(Axis, Scrollbar);
}
export default H.Scrollbar;
