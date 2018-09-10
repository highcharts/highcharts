/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Axis.js';
import './Options.js';
var addEvent = H.addEvent,
    Axis = H.Axis,
    correctFloat = H.correctFloat,
    defaultOptions = H.defaultOptions,
    defined = H.defined,
    destroyObjectProperties = H.destroyObjectProperties,
    each = H.each,
    fireEvent = H.fireEvent,
    hasTouch = H.hasTouch,
    isTouchDevice = H.isTouchDevice,
    merge = H.merge,
    pick = H.pick,
    removeEvent = H.removeEvent,
    swapXY;

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
 * @product highstock
 * @optionparent scrollbar
 */
var defaultScrollbarOptions = {

    /**
     * The height of the scrollbar. The height also applies to the width
     * of the scroll arrows so that they are always squares. Defaults to
     * 20 for touch devices and 14 for mouse devices.
     *
     * @sample {highstock} stock/scrollbar/height/
     *         A 30px scrollbar
     *
     * @type       {number}
     * @default    20/14
     * @product    highstock
     * @apioption  scrollbar.height
     */
    height: isTouchDevice ? 20 : 14,

    /**
     * The border rounding radius of the bar.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {number}
     * @default    0
     * @product    highstock
     * @apioption  scrollbar.barBorderRadius
     */
    barBorderRadius: 0,

    /**
     * The corner radius of the scrollbar buttons.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {number}
     * @default    0
     * @product    highstock
     * @apioption  scrollbar.buttonBorderRadius
     */
    buttonBorderRadius: 0,

    /**
     * Enable or disable the scrollbar.
     *
     * @type       {boolean}
     * @sample     {highstock} stock/scrollbar/enabled/
     *             Disable the scrollbar, only use navigator
     * @default    true
     * @product    highstock
     * @apioption  scrollbar.enabled
     */

    /**
     * Whether to redraw the main chart as the scrollbar or the navigator
     * zoomed window is moved. Defaults to `true` for modern browsers and
     * `false` for legacy IE browsers as well as mobile devices.
     *
     * @type       {boolean}
     * @since      1.3
     * @product    highstock
     * @apioption  scrollbar.liveRedraw
     */
    liveRedraw: undefined,

    /**
     * The margin between the scrollbar and its axis when the scrollbar is
     * applied directly to an axis.
     *
     * @type       {number}
     * @default    10
     * @apioption  scrollbar.margin
     */
    margin: 10,

    /**
     * The minimum width of the scrollbar.
     *
     * @type       {number}
     * @default    6
     * @since      1.2.5
     * @product    highstock
     * @apioption  scrollbar.minWidth
     */
    minWidth: 6,

    /**
     * Whether to show or hide the scrollbar when the scrolled content is
     * zoomed out to it full extent.
     *
     * @type       {boolean}
     * @default    true
     * @product    highstock
     * @apioption  scrollbar.showFull
     */

    /**
     * @type       {number}
     * @default    0.2
     * @apioption  scrollbar.step
     */
    step: 0.2,

    /**
     * The z index of the scrollbar group.
     *
     * @type       {number}
     * @default    3
     * @apioption  scrollbar.zIndex
     */
    zIndex: 3,

    /*= if (build.classic) { =*/

    /**
     * The background color of the scrollbar itself.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {Highcharts.ColorString}
     * @default    #cccccc
     * @product    highstock
     * @apioption  scrollbar.barBackgroundColor
     */
    barBackgroundColor: '${palette.neutralColor20}',

    /**
     * The width of the bar's border.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {number}
     * @default    1
     * @product    highstock
     * @apioption  scrollbar.barBorderWidth
     */
    barBorderWidth: 1,

    /**
     * The color of the scrollbar's border.
     *
     * @type       {Highcharts.ColorString}
     * @default    #cccccc
     * @product    highstock
     * @apioption  scrollbar.barBorderColor
     */
    barBorderColor: '${palette.neutralColor20}',

    /**
     * The color of the small arrow inside the scrollbar buttons.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {Highcharts.ColorString}
     * @default    #333333
     * @product    highstock
     * @apioption  scrollbar.buttonArrowColor
     */
    buttonArrowColor: '${palette.neutralColor80}',

    /**
     * The color of scrollbar buttons.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {Highcharts.ColorString}
     * @default    #e6e6e6
     * @product    highstock
     * @apioption  scrollbar.buttonBackgroundColor
     */
    buttonBackgroundColor: '${palette.neutralColor10}',

    /**
     * The color of the border of the scrollbar buttons.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {Highcharts.ColorString}
     * @default    #cccccc
     * @product    highstock
     * @apioption  scrollbar.buttonBorderColor
     */
    buttonBorderColor: '${palette.neutralColor20}',

    /**
     * The border width of the scrollbar buttons.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {number}
     * @default    1
     * @product    highstock
     * @apioption  scrollbar.buttonBorderWidth
     */
    buttonBorderWidth: 1,

    /**
     * The color of the small rifles in the middle of the scrollbar.
     *
     * @type       {Highcharts.ColorString}
     * @default    #333333
     * @product    highstock
     * @apioption  scrollbar.rifleColor
     */
    rifleColor: '${palette.neutralColor80}',

    /**
     * The color of the track background.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {Highcharts.ColorString}
     * @default    #f2f2f2
     * @product    highstock
     * @apioption  scrollbar.trackBackgroundColor
     */
    trackBackgroundColor: '${palette.neutralColor5}',

    /**
     * The color of the border of the scrollbar track.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {Highcharts.ColorString}
     * @default    #f2f2f2
     * @product    highstock
     * @apioption  scrollbar.trackBorderColor
     */
    trackBorderColor: '${palette.neutralColor5}',

    /**
     * The corner radius of the border of the scrollbar track.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {number}
     * @default    0
     * @product    highstock
     * @apioption  scrollbar.trackBorderRadius
     */

    /**
     * The width of the border of the scrollbar track.
     *
     * @sample {highstock} stock/scrollbar/style/
     *         Scrollbar styling
     *
     * @type       {number}
     * @default    1
     * @product    highstock
     * @apioption  scrollbar.trackBorderWidth
     */
    trackBorderWidth: 1
    /*= } =*/
};

defaultOptions.scrollbar = merge(
    true,
    defaultScrollbarOptions,
    defaultOptions.scrollbar
);

/**
 * When we have vertical scrollbar, rifles and arrow in buttons should be
 * rotated. The same method is used in Navigator's handles, to rotate them.
 *
 * @function Highcharts.swapXY
 *
 * @param  {Array<number|string>} path
 *         Path to be rotated.
 *
 * @param  {boolean} vertical
 *         If vertical scrollbar, swap x-y values.
 *
 * @return {Array<number|string>}
 */
H.swapXY = swapXY = function (path, vertical) {
    var i,
        len = path.length,
        temp;

    if (vertical) {
        for (i = 0; i < len; i += 3) {
            temp = path[i + 1];
            path[i + 1] = path[i + 2];
            path[i + 2] = temp;
        }
    }

    return path;
};

/**
 * A reusable scrollbar, internally used in Highstock's navigator and optionally
 * on individual axes.
 *
 * @class Highcharts.Scrollbar
 *
 * @param {Highcharts.SVGRenderer} renderer
 *
 * @param {Highcharts.ScrollbarOptions} options
 *
 * @param {Highcharts.Chart} chart
 */
function Scrollbar(renderer, options, chart) { // docs
    this.init(renderer, options, chart);
}

Scrollbar.prototype = {

    /**
     * @function Highcharts.Scrollbar#init
     *
     * @param  {Highcharts.SVGRenderer} renderer
     *
     * @param  {Highcharts.ScrollbarOptions} options
     *
     * @param  {Highcharts.Chart} chart
     *
     * @return {void}
     */
    init: function (renderer, options, chart) {

        this.scrollbarButtons = [];

        this.renderer = renderer;

        this.userOptions = options;
        this.options = merge(defaultScrollbarOptions, options);

        this.chart = chart;

        // backward compatibility
        this.size = pick(this.options.size, this.options.height);

        // Init
        if (options.enabled) {
            this.render();
            this.initEvents();
            this.addEvents();
        }
    },

    /**
    * Render scrollbar with all required items.
    *
    * @function Highcharts.Scrollbar#render
    *
    * @return {void}
    */
    render: function () {
        var scroller = this,
            renderer = scroller.renderer,
            options = scroller.options,
            size = scroller.size,
            group;

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

        /*= if (build.classic) { =*/
        scroller.track.attr({
            fill: options.trackBackgroundColor,
            stroke: options.trackBorderColor,
            'stroke-width': options.trackBorderWidth
        });
        /*= } =*/
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

        scroller.scrollbarRifles = renderer.path(
            swapXY([
                'M',
                -3, size / 4,
                'L',
                -3, 2 * size / 3,
                'M',
                0, size / 4,
                'L',
                0, 2 * size / 3,
                'M',
                3, size / 4,
                'L',
                3, 2 * size / 3
            ], options.vertical))
            .addClass('highcharts-scrollbar-rifles')
            .add(scroller.scrollbarGroup);

        /*= if (build.classic) { =*/
        scroller.scrollbar.attr({
            fill: options.barBackgroundColor,
            stroke: options.barBorderColor,
            'stroke-width': options.barBorderWidth
        });
        scroller.scrollbarRifles.attr({
            stroke: options.rifleColor,
            'stroke-width': 1
        });
        /*= } =*/
        scroller.scrollbarStrokeWidth = scroller.scrollbar.strokeWidth();
        scroller.scrollbarGroup.translate(
            -scroller.scrollbarStrokeWidth % 2 / 2,
            -scroller.scrollbarStrokeWidth % 2 / 2
        );

        // Draw the buttons:
        scroller.drawScrollbarButton(0);
        scroller.drawScrollbarButton(1);
    },

    /**
     * Position the scrollbar, method called from a parent with defined
     * dimensions.
     *
     * @function Highcharts.Scrollbar#position
     *
     * @param  {number} x
     *         x-position on the chart
     *
     * @param  {number} y
     *         y-position on the chart
     *
     * @param  {number} width
     *         width of the scrollbar
     *
     * @param  {number} height
     *         height of the scorllbar
     *
     * @return {void}
     */
    position: function (x, y, width, height) {
        var scroller = this,
            options = scroller.options,
            vertical = options.vertical,
            xOffset = height,
            yOffset = 0,
            method = scroller.rendered ? 'animate' : 'attr';

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
        } else {
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
    },

    /**
     * Draw the scrollbar buttons with arrows
     *
     * @function Highcharts.Scrollbar#drawScrollbarButton
     *
     * @param  {number} index
     *         0 is left, 1 is right
     *
     * @return {void}
     */
    drawScrollbarButton: function (index) {
        var scroller = this,
            renderer = scroller.renderer,
            scrollbarButtons = scroller.scrollbarButtons,
            options = scroller.options,
            size = scroller.size,
            group,
            tempElem;

        group = renderer.g().add(scroller.group);
        scrollbarButtons.push(group);

        // Create a rectangle for the scrollbar button
        tempElem = renderer.rect()
            .addClass('highcharts-scrollbar-button')
            .add(group);

        /*= if (build.classic) { =*/
        // Presentational attributes
        tempElem.attr({
            stroke: options.buttonBorderColor,
            'stroke-width': options.buttonBorderWidth,
            fill: options.buttonBackgroundColor
        });
        /*= } =*/

        // Place the rectangle based on the rendered stroke width
        tempElem.attr(tempElem.crisp({
            x: -0.5,
            y: -0.5,
            width: size + 1, // +1 to compensate for crispifying in rect method
            height: size + 1,
            r: options.buttonBorderRadius
        }, tempElem.strokeWidth()));

        // Button arrow
        tempElem = renderer
            .path(swapXY([
                'M',
                size / 2 + (index ? -1 : 1),
                size / 2 - 3,
                'L',
                size / 2 + (index ? -1 : 1),
                size / 2 + 3,
                'L',
                size / 2 + (index ? 2 : -2),
                size / 2
            ], options.vertical))
            .addClass('highcharts-scrollbar-arrow')
            .add(scrollbarButtons[index]);

        /*= if (build.classic) { =*/
        tempElem.attr({
            fill: options.buttonArrowColor
        });
        /*= } =*/
    },

    /**
    * Set scrollbar size, with a given scale.
    *
    * @function Highcharts.Scrollbar#setRange
    *
    * @param  {number} from
    *         scale (0-1) where bar should start
    *
    * @param  {number} to
    *         scale (0-1) where bar should end
    *
    * @return {void}
    */
    setRange: function (from, to) {
        var scroller = this,
            options = scroller.options,
            vertical = options.vertical,
            minWidth = options.minWidth,
            fullWidth = scroller.barWidth,
            fromPX,
            toPX,
            newPos,
            newSize,
            newRiflesPos,
            method = (
                this.rendered &&
                !this.hasDragged &&
                !(this.chart.navigator && this.chart.navigator.hasDragged)
            ) ? 'animate' : 'attr';

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
        } else {
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
        } else {
            scroller.scrollbarRifles.show(true);
        }

        // Show or hide the scrollbar based on the showFull setting
        if (options.showFull === false) {
            if (from <= 0 && to >= 1) {
                scroller.group.hide();
            } else {
                scroller.group.show();
            }
        }

        scroller.rendered = true;
    },

    /**
    * Init events methods, so we have an access to the Scrollbar itself
    *
    * @function Highcharts.Scrollbar#initEvents
    *
    * @return {void}
    *
    * @todo
    * Make events official: Fires the event `changed`.
    */
    initEvents: function () {
        var scroller = this;
        /**
         * Event handler for the mouse move event.
         */
        scroller.mouseMoveHandler = function (e) {
            var normalizedEvent = scroller.chart.pointer.normalize(e),
                options = scroller.options,
                direction = options.vertical ? 'chartY' : 'chartX',
                initPositions = scroller.initPositions,
                scrollPosition,
                chartPosition,
                change;

            // In iOS, a mousemove event with e.pageX === 0 is fired when
            // holding the finger down in the center of the scrollbar. This
            // should be ignored.
            if (
                scroller.grabbedCenter &&
                // #4696, scrollbar failed on Android
                (!e.touches || e.touches[0][direction] !== 0)
            ) {
                chartPosition = scroller.cursorToScrollbarPosition(
                    normalizedEvent
                )[direction];
                scrollPosition = scroller[direction];

                change = chartPosition - scrollPosition;

                scroller.hasDragged = true;
                scroller.updatePosition(
                    initPositions[0] + change,
                    initPositions[1] + change
                );

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
         */
        scroller.mouseUpHandler = function (e) {
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

        scroller.mouseDownHandler = function (e) {
            var normalizedEvent = scroller.chart.pointer.normalize(e),
                mousePosition = scroller.cursorToScrollbarPosition(
                    normalizedEvent
                );

            scroller.chartX = mousePosition.chartX;
            scroller.chartY = mousePosition.chartY;
            scroller.initPositions = [scroller.from, scroller.to];

            scroller.grabbedCenter = true;
        };

        scroller.buttonToMinClick = function (e) {
            var range = correctFloat(scroller.to - scroller.from) *
                scroller.options.step;
            scroller.updatePosition(
                correctFloat(scroller.from - range),
                correctFloat(scroller.to - range)
            );
            fireEvent(scroller, 'changed', {
                from: scroller.from,
                to: scroller.to,
                trigger: 'scrollbar',
                DOMEvent: e
            });
        };

        scroller.buttonToMaxClick = function (e) {
            var range = (scroller.to - scroller.from) * scroller.options.step;
            scroller.updatePosition(scroller.from + range, scroller.to + range);
            fireEvent(scroller, 'changed', {
                from: scroller.from,
                to: scroller.to,
                trigger: 'scrollbar',
                DOMEvent: e
            });
        };

        scroller.trackClick = function (e) {
            var normalizedEvent = scroller.chart.pointer.normalize(e),
                range = scroller.to - scroller.from,
                top = scroller.y + scroller.scrollbarTop,
                left = scroller.x + scroller.scrollbarLeft;

            if (
                (scroller.options.vertical && normalizedEvent.chartY > top) ||
                (!scroller.options.vertical && normalizedEvent.chartX > left)
            ) {
                // On the top or on the left side of the track:
                scroller.updatePosition(
                    scroller.from + range,
                    scroller.to + range
                );
            } else {
                // On the bottom or the right side of the track:
                scroller.updatePosition(
                    scroller.from - range,
                    scroller.to - range
                );
            }

            fireEvent(scroller, 'changed', {
                from: scroller.from,
                to: scroller.to,
                trigger: 'scrollbar',
                DOMEvent: e
            });
        };
    },

    /**
     * Get normalized (0-1) cursor position over the scrollbar
     *
     * @function Highcharts.Scrollbar#cursorToScrollbarPosition
     *
     * @param  {*} normalizedEvent
     *         normalized event, with chartX and chartY values
     *
     * @return {*}
     *         Local position {chartX, chartY}
     */
    cursorToScrollbarPosition: function (normalizedEvent) {
        var scroller = this,
            options = scroller.options,
            minWidthDifference = options.minWidth > scroller.calculatedWidth ?
                options.minWidth :
                0; // minWidth distorts translation

        return {
            chartX: (normalizedEvent.chartX - scroller.x - scroller.xOffset) /
                (scroller.barWidth - minWidthDifference),
            chartY: (normalizedEvent.chartY - scroller.y - scroller.yOffset) /
                (scroller.barWidth - minWidthDifference)
        };
    },

    /**
    * Update position option in the Scrollbar, with normalized 0-1 scale
    *
    * @function Highcharts.Scrollbar#updatePosition
    *
    * @param  {number} from
    *
    * @param  {number} to
    *
    * @return {void}
    */
    updatePosition: function (from, to) {
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
    },

    /**
     * Update the scrollbar with new options
     *
     * @function Highcharts.Scrollbar#update
     *
     * @param  {Highcharts.ScrollbarOptions} options
     *
     * @return {void}
     */
    update: function (options) {
        this.destroy();
        this.init(
            this.chart.renderer,
            merge(true, this.options, options),
            this.chart
        );
    },

    /**
     * Set up the mouse and touch events for the Scrollbar
     *
     * @function Highcharts.Scrollbar#addEvents
     *
     * @return {void}
     */
    addEvents: function () {
        var buttonsOrder = this.options.inverted ? [1, 0] : [0, 1],
            buttons = this.scrollbarButtons,
            bar = this.scrollbarGroup.element,
            track = this.track.element,
            mouseDownHandler = this.mouseDownHandler,
            mouseMoveHandler = this.mouseMoveHandler,
            mouseUpHandler = this.mouseUpHandler,
            _events;

        // Mouse events
        _events = [
            [buttons[buttonsOrder[0]].element, 'click', this.buttonToMinClick],
            [buttons[buttonsOrder[1]].element, 'click', this.buttonToMaxClick],
            [track, 'click', this.trackClick],
            [bar, 'mousedown', mouseDownHandler],
            [bar.ownerDocument, 'mousemove', mouseMoveHandler],
            [bar.ownerDocument, 'mouseup', mouseUpHandler]
        ];

        // Touch events
        if (hasTouch) {
            _events.push(
                [bar, 'touchstart', mouseDownHandler],
                [bar.ownerDocument, 'touchmove', mouseMoveHandler],
                [bar.ownerDocument, 'touchend', mouseUpHandler]
            );
        }

        // Add them all
        each(_events, function (args) {
            addEvent.apply(null, args);
        });
        this._events = _events;
    },

    /**
     * Removes the event handlers attached previously with addEvents.
     *
     * @function Highcharts.Scrollbar#removeEvents
     *
     * @return {void}
     */
    removeEvents: function () {
        each(this._events, function (args) {
            removeEvent.apply(null, args);
        });
        this._events.length = 0;
    },

    /**
     * Destroys allocated elements.
     *
     * @function Highcharts.Scrollbar#destroy
     *
     * @return {void}
     */
    destroy: function () {

        var scroller = this.chart.scroller;

        // Disconnect events added in addEvents
        this.removeEvents();

        // Destroy properties
        each(
            [
                'track',
                'scrollbarRifles',
                'scrollbar',
                'scrollbarGroup',
                'group'
            ],
            function (prop) {
                if (this[prop] && this[prop].destroy) {
                    this[prop] = this[prop].destroy();
                }
            },
            this
        );

        // #6421, chart may have more scrollbars
        if (scroller && this === scroller.scrollbar) {
            scroller.scrollbar = null;

            // Destroy elements in collection
            destroyObjectProperties(scroller.scrollbarButtons);
        }
    }
};

/*
 * Wrap axis initialization and create scrollbar if enabled:
 */
addEvent(Axis, 'afterInit', function () {
    var axis = this;

    if (axis.options.scrollbar && axis.options.scrollbar.enabled) {
        // Predefined options:
        axis.options.scrollbar.vertical = !axis.horiz;
        axis.options.startOnTick = axis.options.endOnTick = false;

        axis.scrollbar = new Scrollbar(
            axis.chart.renderer,
            axis.options.scrollbar,
            axis.chart
        );

        addEvent(axis.scrollbar, 'changed', function (e) {
            var unitedMin = Math.min(
                    pick(axis.options.min, axis.min),
                    axis.min,
                    axis.dataMin
                ),
                unitedMax = Math.max(
                    pick(axis.options.max, axis.max),
                    axis.max,
                    axis.dataMax
                ),
                range = unitedMax - unitedMin,
                to,
                from;

            if (
                (axis.horiz && !axis.reversed) ||
                (!axis.horiz && axis.reversed)
            ) {
                to = unitedMin + range * this.to;
                from = unitedMin + range * this.from;
            } else {
                // y-values in browser are reversed, but this also applies for
                // reversed horizontal axis:
                to = unitedMin + range * (1 - this.from);
                from = unitedMin + range * (1 - this.to);
            }

            axis.setExtremes(from, to, true, false, e);
        });
    }
});

/*
 * Wrap rendering axis, and update scrollbar if one is created:
 */
addEvent(Axis, 'afterRender', function () {
    var axis = this,
        scrollMin = Math.min(
            pick(axis.options.min, axis.min),
            axis.min,
            pick(axis.dataMin, axis.min) // #6930
        ),
        scrollMax = Math.max(
            pick(axis.options.max, axis.max),
            axis.max,
            pick(axis.dataMax, axis.max) // #6930
        ),
        scrollbar = axis.scrollbar,
        titleOffset = axis.titleOffset || 0,
        offsetsIndex,
        from,
        to;

    if (scrollbar) {

        if (axis.horiz) {
            scrollbar.position(
                axis.left,
                axis.top + axis.height + 2 + axis.chart.scrollbarsOffsets[1] +
                    (axis.opposite ?
                        0 :
                        titleOffset + axis.axisTitleMargin + axis.offset
                    ),
                axis.width,
                axis.height
            );
            offsetsIndex = 1;
        } else {
            scrollbar.position(
                axis.left + axis.width + 2 + axis.chart.scrollbarsOffsets[0] +
                    (axis.opposite ?
                        titleOffset + axis.axisTitleMargin + axis.offset :
                        0
                    ),
                axis.top,
                axis.width,
                axis.height
            );
            offsetsIndex = 0;
        }

        if ((!axis.opposite && !axis.horiz) || (axis.opposite && axis.horiz)) {
            axis.chart.scrollbarsOffsets[offsetsIndex] +=
                axis.scrollbar.size + axis.scrollbar.options.margin;
        }

        if (
            isNaN(scrollMin) ||
            isNaN(scrollMax) ||
            !defined(axis.min) ||
            !defined(axis.max)
        ) {
            // default action: when there is not extremes on the axis, but
            // scrollbar exists, make it full size
            scrollbar.setRange(0, 0);
        } else {
            from = (axis.min - scrollMin) / (scrollMax - scrollMin);
            to = (axis.max - scrollMin) / (scrollMax - scrollMin);

            if (
                (axis.horiz && !axis.reversed) ||
                (!axis.horiz && axis.reversed)
            ) {
                scrollbar.setRange(from, to);
            } else {
                scrollbar.setRange(1 - to, 1 - from); // inverse vertical axis
            }
        }
    }
});

/*
 * Make space for a scrollbar
 */
addEvent(Axis, 'afterGetOffset', function () {
    var axis = this,
        index = axis.horiz ? 2 : 1,
        scrollbar = axis.scrollbar;

    if (scrollbar) {
        axis.chart.scrollbarsOffsets = [0, 0]; // reset scrollbars offsets
        axis.chart.axisOffset[index] +=
            scrollbar.size + scrollbar.options.margin;
    }
});

H.Scrollbar = Scrollbar;
