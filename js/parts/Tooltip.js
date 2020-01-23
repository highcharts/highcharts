/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import U from './Utilities.js';
var clamp = U.clamp, defined = U.defined, discardElement = U.discardElement, extend = U.extend, isNumber = U.isNumber, isString = U.isString, pick = U.pick, splat = U.splat, syncTimeout = U.syncTimeout, timeUnits = U.timeUnits;
/**
 * Callback function to format the text of the tooltip from scratch.
 *
 * In case of single or shared tooltips, a string should be be returned. In case
 * of splitted tooltips, it should return an array where the first item is the
 * header, and subsequent items are mapped to the points. Return `false` to
 * disable tooltip for a specific point on series.
 *
 * @callback Highcharts.TooltipFormatterCallbackFunction
 *
 * @param {Highcharts.TooltipFormatterContextObject} this
 *        Context to format
 *
 * @param {Highcharts.Tooltip} tooltip
 *        The tooltip instance
 *
 * @return {false|string|Array<(string|null|undefined)>|null|undefined}
 *         Formatted text or false
 */
/**
 * @interface Highcharts.TooltipFormatterContextObject
 */ /**
* @name Highcharts.TooltipFormatterContextObject#color
* @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#colorIndex
* @type {number|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#key
* @type {number}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#percentage
* @type {number|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#point
* @type {Highcharts.Point}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#points
* @type {Array<Highcharts.TooltipFormatterContextObject>|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#series
* @type {Highcharts.Series}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#total
* @type {number|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#x
* @type {number}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#y
* @type {number}
*/
/**
 * A callback function to place the tooltip in a specific position.
 *
 * @callback Highcharts.TooltipPositionerCallbackFunction
 *
 * @param {number} labelWidth
 *        Width of the tooltip.
 *
 * @param {number} labelHeight
 *        Height of the tooltip.
 *
 * @param {Highcharts.TooltipPositionerPointObject} point
 *        Point information for positioning a tooltip.
 *
 * @return {Highcharts.PositionObject}
 *         New position for the tooltip.
 */
/**
 * Point information for positioning a tooltip.
 *
 * @interface Highcharts.TooltipPositionerPointObject
 */ /**
* If `tooltip.split` option is enabled and positioner is called for each of the
* boxes separately, this property indicates the call on the xAxis header, which
* is not a point itself.
* @name Highcharts.TooltipPositionerPointObject#isHeader
* @type {boolean}
*/ /**
* @name Highcharts.TooltipPositionerPointObject#negative
* @type {boolean}
*/ /**
* The reference point relative to the plot area. Add chart.plotLeft to get the
* full coordinates.
* @name Highcharts.TooltipPositionerPointObject#plotX
* @type {number}
*/ /**
* The reference point relative to the plot area. Add chart.plotTop to get the
* full coordinates.
* @name Highcharts.TooltipPositionerPointObject#plotY
* @type {number}
*/
/**
 * @typedef {"callout"|"circle"|"square"} Highcharts.TooltipShapeValue
 */
''; // separates doclets above from variables below
var doc = H.doc, format = H.format, merge = H.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Tooltip of a chart.
 *
 * @class
 * @name Highcharts.Tooltip
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @param {Highcharts.TooltipOptions} options
 *        Tooltip options.
 */
H.Tooltip = function () {
    this.init.apply(this, arguments);
};
H.Tooltip.prototype = {
    /**
     * @private
     * @function Highcharts.Tooltip#init
     *
     * @param {Highcharts.Chart} chart
     *        The chart instance.
     *
     * @param {Highcharts.TooltipOptions} options
     *        Tooltip options.
     *
     * @return {void}
     */
    init: function (chart, options) {
        /**
         * Chart of the tooltip.
         *
         * @readonly
         * @name Highcharts.Tooltip#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;
        /**
         * Used tooltip options.
         *
         * @readonly
         * @name Highcharts.Tooltip#options
         * @type {Highcharts.TooltipOptions}
         */
        this.options = options;
        /**
         * List of crosshairs.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#crosshairs
         * @type {Array<*>}
         */
        this.crosshairs = [];
        /**
         * Current values of x and y when animating.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#now
         * @type {Highcharts.PositionObject}
         */
        this.now = { x: 0, y: 0 };
        /**
         * Tooltips are initially hidden.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#isHidden
         * @type {boolean}
         */
        this.isHidden = true;
        /**
         * True, if the tooltip is split into one label per series, with the
         * header close to the axis.
         *
         * @readonly
         * @name Highcharts.Tooltip#split
         * @type {boolean|undefined}
         */
        this.split = options.split && !chart.inverted && !chart.polar;
        /**
         * When the tooltip is shared, the entire plot area will capture mouse
         * movement or touch events.
         *
         * @readonly
         * @name Highcharts.Tooltip#shared
         * @type {boolean|undefined}
         */
        this.shared = options.shared || this.split;
        /**
         * Whether to allow the tooltip to render outside the chart's SVG
         * element box. By default (false), the tooltip is rendered within the
         * chart's SVG element, which results in the tooltip being aligned
         * inside the chart area.
         *
         * @readonly
         * @name Highcharts.Tooltip#outside
         * @type {boolean}
         *
         * @todo
         * Split tooltip does not support outside in the first iteration. Should
         * not be too complicated to implement.
         */
        this.outside = pick(options.outside, Boolean(chart.scrollablePixelsX || chart.scrollablePixelsY));
    },
    /**
     * Destroy the single tooltips in a split tooltip.
     * If the tooltip is active then it is not destroyed, unless forced to.
     *
     * @private
     * @function Highcharts.Tooltip#cleanSplit
     *
     * @param {boolean} [force]
     *        Force destroy all tooltips.
     *
     * @return {void}
     */
    cleanSplit: function (force) {
        this.chart.series.forEach(function (series) {
            var tt = series && series.tt;
            if (tt) {
                if (!tt.isActive || force) {
                    series.tt = tt.destroy();
                }
                else {
                    tt.isActive = false;
                }
            }
        });
    },
    /**
     * In styled mode, apply the default filter for the tooltip drop-shadow. It
     * needs to have an id specific to the chart, otherwise there will be issues
     * when one tooltip adopts the filter of a different chart, specifically one
     * where the container is hidden.
     *
     * @private
     * @function Highcharts.Tooltip#applyFilter
     * @return {void}
     */
    applyFilter: function () {
        var chart = this.chart;
        chart.renderer.definition({
            tagName: 'filter',
            id: 'drop-shadow-' + chart.index,
            opacity: 0.5,
            children: [{
                    tagName: 'feGaussianBlur',
                    'in': 'SourceAlpha',
                    stdDeviation: 1
                }, {
                    tagName: 'feOffset',
                    dx: 1,
                    dy: 1
                }, {
                    tagName: 'feComponentTransfer',
                    children: [{
                            tagName: 'feFuncA',
                            type: 'linear',
                            slope: 0.3
                        }]
                }, {
                    tagName: 'feMerge',
                    children: [{
                            tagName: 'feMergeNode'
                        }, {
                            tagName: 'feMergeNode',
                            'in': 'SourceGraphic'
                        }]
                }]
        });
        chart.renderer.definition({
            tagName: 'style',
            textContent: '.highcharts-tooltip-' + chart.index + '{' +
                'filter:url(#drop-shadow-' + chart.index + ')' +
                '}'
        });
    },
    /**
     * Creates the Tooltip label element if it does not exist, then returns it.
     *
     * @function Highcharts.Tooltip#getLabel
     * @return {Highcharts.SVGElement}
     */
    getLabel: function () {
        var tooltip = this, renderer = this.chart.renderer, styledMode = this.chart.styledMode, options = this.options, className = 'tooltip' +
            (defined(options.className) ? ' ' + options.className : ''), container, set;
        if (!this.label) {
            if (this.outside) {
                /**
                 * Reference to the tooltip's container, when
                 * [Highcharts.Tooltip#outside] is set to true, otherwise
                 * it's undefined.
                 *
                 * @name Highcharts.Tooltip#container
                 * @type {Highcharts.HTMLDOMElement|undefined}
                 */
                this.container = container = H.doc.createElement('div');
                container.className = 'highcharts-tooltip-container';
                H.css(container, {
                    position: 'absolute',
                    top: '1px',
                    pointerEvents: options.style && options.style.pointerEvents,
                    zIndex: 3
                });
                H.doc.body.appendChild(container);
                /**
                 * Reference to the tooltip's renderer, when
                 * [Highcharts.Tooltip#outside] is set to true, otherwise
                 * it's undefined.
                 *
                 * @name Highcharts.Tooltip#renderer
                 * @type {Highcharts.SVGRenderer|undefined}
                 */
                this.renderer = renderer = new H.Renderer(container, 0, 0, {}, void 0, void 0, renderer.styledMode);
            }
            // Create the label
            if (this.split) {
                this.label = renderer.g(className);
            }
            else {
                this.label = renderer
                    .label('', 0, 0, options.shape || 'callout', null, null, options.useHTML, null, className)
                    .attr({
                    padding: options.padding,
                    r: options.borderRadius
                });
                if (!styledMode) {
                    this.label
                        .attr({
                        fill: options.backgroundColor,
                        'stroke-width': options.borderWidth
                    })
                        // #2301, #2657
                        .css(options.style)
                        .shadow(options.shadow);
                }
            }
            if (styledMode) {
                // Apply the drop-shadow filter
                this.applyFilter();
                this.label.addClass('highcharts-tooltip-' + this.chart.index);
            }
            // Split tooltip use updateTooltipContainer to position the tooltip
            // container.
            if (tooltip.outside && !tooltip.split) {
                set = {
                    x: this.label.xSetter,
                    y: this.label.ySetter
                };
                this.label.xSetter = function (value, key) {
                    set[key].call(this.label, tooltip.distance);
                    container.style.left = value + 'px';
                };
                this.label.ySetter = function (value, key) {
                    set[key].call(this.label, tooltip.distance);
                    container.style.top = value + 'px';
                };
            }
            this.label
                .attr({
                zIndex: 8
            })
                .add();
        }
        return this.label;
    },
    /**
     * Updates the tooltip with the provided tooltip options.
     *
     * @function Highcharts.Tooltip#update
     *
     * @param {Highcharts.TooltipOptions} options
     *        The tooltip options to update.
     *
     * @return {void}
     */
    update: function (options) {
        this.destroy();
        // Update user options (#6218)
        merge(true, this.chart.options.tooltip.userOptions, options);
        this.init(this.chart, merge(true, this.options, options));
    },
    /**
     * Removes and destroys the tooltip and its elements.
     *
     * @function Highcharts.Tooltip#destroy
     * @return {void}
     */
    destroy: function () {
        // Destroy and clear local variables
        if (this.label) {
            this.label = this.label.destroy();
        }
        if (this.split && this.tt) {
            this.cleanSplit(this.chart, true);
            this.tt = this.tt.destroy();
        }
        if (this.renderer) {
            this.renderer = this.renderer.destroy();
            discardElement(this.container);
        }
        H.clearTimeout(this.hideTimer);
        H.clearTimeout(this.tooltipTimeout);
    },
    /**
     * Moves the tooltip with a soft animation to a new position.
     *
     * @private
     * @function Highcharts.Tooltip#move
     *
     * @param {number} x
     *
     * @param {number} y
     *
     * @param {number} anchorX
     *
     * @param {number} anchorY
     *
     * @return {void}
     */
    move: function (x, y, anchorX, anchorY) {
        var tooltip = this, now = tooltip.now, animate = tooltip.options.animation !== false &&
            !tooltip.isHidden &&
            // When we get close to the target position, abort animation and
            // land on the right place (#3056)
            (Math.abs(x - now.x) > 1 || Math.abs(y - now.y) > 1), skipAnchor = tooltip.followPointer || tooltip.len > 1;
        // Get intermediate values for animation
        extend(now, {
            x: animate ? (2 * now.x + x) / 3 : x,
            y: animate ? (now.y + y) / 2 : y,
            anchorX: skipAnchor ?
                void 0 :
                animate ? (2 * now.anchorX + anchorX) / 3 : anchorX,
            anchorY: skipAnchor ?
                void 0 :
                animate ? (now.anchorY + anchorY) / 2 : anchorY
        });
        // Move to the intermediate value
        tooltip.getLabel().attr(now);
        // Run on next tick of the mouse tracker
        if (animate) {
            // Never allow two timeouts
            H.clearTimeout(this.tooltipTimeout);
            // Set the fixed interval ticking for the smooth tooltip
            this.tooltipTimeout = setTimeout(function () {
                // The interval function may still be running during destroy,
                // so check that the chart is really there before calling.
                if (tooltip) {
                    tooltip.move(x, y, anchorX, anchorY);
                }
            }, 32);
        }
    },
    /**
     * Hides the tooltip with a fade out animation.
     *
     * @function Highcharts.Tooltip#hide
     *
     * @param {number} [delay]
     *        The fade out in milliseconds. If no value is provided the value
     *        of the tooltip.hideDelay option is used. A value of 0 disables
     *        the fade out animation.
     *
     * @return {void}
     */
    hide: function (delay) {
        var tooltip = this;
        // disallow duplicate timers (#1728, #1766)
        H.clearTimeout(this.hideTimer);
        delay = pick(delay, this.options.hideDelay, 500);
        if (!this.isHidden) {
            this.hideTimer = syncTimeout(function () {
                tooltip.getLabel()[delay ? 'fadeOut' : 'hide']();
                tooltip.isHidden = true;
            }, delay);
        }
    },
    /**
     * Extendable method to get the anchor position of the tooltip
     * from a point or set of points
     *
     * @private
     * @function Highcharts.Tooltip#getAnchor
     *
     * @param {Highcharts.Point|Array<Highcharts.Point>} points
     *
     * @param {Highcharts.PointerEventObject} [mouseEvent]
     *
     * @return {Array<number>}
     */
    getAnchor: function (points, mouseEvent) {
        var ret, chart = this.chart, pointer = chart.pointer, inverted = chart.inverted, plotTop = chart.plotTop, plotLeft = chart.plotLeft, plotX = 0, plotY = 0, yAxis, xAxis;
        points = splat(points);
        // When tooltip follows mouse, relate the position to the mouse
        if (this.followPointer && mouseEvent) {
            if (typeof mouseEvent.chartX === 'undefined') {
                mouseEvent = pointer.normalize(mouseEvent);
            }
            ret = [
                mouseEvent.chartX - chart.plotLeft,
                mouseEvent.chartY - plotTop
            ];
            // Pie uses a special tooltipPos
        }
        else if (points[0].tooltipPos) {
            ret = points[0].tooltipPos;
            // When shared, use the average position
        }
        else {
            points.forEach(function (point) {
                yAxis = point.series.yAxis;
                xAxis = point.series.xAxis;
                plotX += point.plotX +
                    (!inverted && xAxis ? xAxis.left - plotLeft : 0);
                plotY += (point.plotLow ?
                    (point.plotLow + point.plotHigh) / 2 :
                    point.plotY) + (!inverted && yAxis ? yAxis.top - plotTop : 0); // #1151
            });
            plotX /= points.length;
            plotY /= points.length;
            ret = [
                inverted ? chart.plotWidth - plotY : plotX,
                this.shared && !inverted && points.length > 1 && mouseEvent ?
                    // place shared tooltip next to the mouse (#424)
                    mouseEvent.chartY - plotTop :
                    inverted ? chart.plotHeight - plotX : plotY
            ];
        }
        return ret.map(Math.round);
    },
    /**
     * Place the tooltip in a chart without spilling over
     * and not covering the point it self.
     *
     * @private
     * @function Highcharts.Tooltip#getPosition
     *
     * @param {number} boxWidth
     *
     * @param {number} boxHeight
     *
     * @param {Highcharts.Point} point
     *
     * @return {Highcharts.PositionObject}
     */
    getPosition: function (boxWidth, boxHeight, point) {
        var chart = this.chart, distance = this.distance, ret = {}, 
        // Don't use h if chart isn't inverted (#7242) ???
        h = (chart.inverted && point.h) || 0, // #4117 ???
        swapped, outside = this.outside, outerWidth = outside ?
            // substract distance to prevent scrollbars
            doc.documentElement.clientWidth - 2 * distance :
            chart.chartWidth, outerHeight = outside ?
            Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, doc.body.offsetHeight, doc.documentElement.offsetHeight, doc.documentElement.clientHeight) :
            chart.chartHeight, chartPosition = chart.pointer.getChartPosition(), containerScaling = chart.containerScaling, scaleX = function (val) { return ( // eslint-disable-line no-confusing-arrow
        containerScaling ? val * containerScaling.scaleX : val); }, scaleY = function (val) { return ( // eslint-disable-line no-confusing-arrow
        containerScaling ? val * containerScaling.scaleY : val); }, 
        // Build parameter arrays for firstDimension()/secondDimension()
        buildDimensionArray = function (dim) {
            var isX = dim === 'x';
            return [
                dim,
                isX ? outerWidth : outerHeight,
                isX ? boxWidth : boxHeight
            ].concat(outside ? [
                // If we are using tooltip.outside, we need to scale the
                // position to match scaling of the container in case there
                // is a transform/zoom on the container. #11329
                isX ? scaleX(boxWidth) : scaleY(boxHeight),
                isX ? chartPosition.left - distance +
                    scaleX(point.plotX + chart.plotLeft) :
                    chartPosition.top - distance +
                        scaleY(point.plotY + chart.plotTop),
                0,
                isX ? outerWidth : outerHeight
            ] : [
                // Not outside, no scaling is needed
                isX ? boxWidth : boxHeight,
                isX ? point.plotX + chart.plotLeft :
                    point.plotY + chart.plotTop,
                isX ? chart.plotLeft : chart.plotTop,
                isX ? chart.plotLeft + chart.plotWidth :
                    chart.plotTop + chart.plotHeight
            ]);
        }, first = buildDimensionArray('y'), second = buildDimensionArray('x'), 
        // The far side is right or bottom
        preferFarSide = !this.followPointer && pick(point.ttBelow, !chart.inverted === !!point.negative), // #4984
        /*
         * Handle the preferred dimension. When the preferred dimension is
         * tooltip on top or bottom of the point, it will look for space
         * there.
         *
         * @private
         */
        firstDimension = function (dim, outerSize, innerSize, scaledInnerSize, // #11329
        point, min, max) {
            var scaledDist = dim === 'y' ?
                scaleY(distance) : scaleX(distance), scaleDiff = (innerSize - scaledInnerSize) / 2, roomLeft = scaledInnerSize < point - distance, roomRight = point + distance + scaledInnerSize < outerSize, alignedLeft = point - scaledDist - innerSize + scaleDiff, alignedRight = point + scaledDist - scaleDiff;
            if (preferFarSide && roomRight) {
                ret[dim] = alignedRight;
            }
            else if (!preferFarSide && roomLeft) {
                ret[dim] = alignedLeft;
            }
            else if (roomLeft) {
                ret[dim] = Math.min(max - scaledInnerSize, alignedLeft - h < 0 ? alignedLeft : alignedLeft - h);
            }
            else if (roomRight) {
                ret[dim] = Math.max(min, alignedRight + h + innerSize > outerSize ?
                    alignedRight :
                    alignedRight + h);
            }
            else {
                return false;
            }
        }, 
        /*
         * Handle the secondary dimension. If the preferred dimension is
         * tooltip on top or bottom of the point, the second dimension is to
         * align the tooltip above the point, trying to align center but
         * allowing left or right align within the chart box.
         *
         * @private
         */
        secondDimension = function (dim, outerSize, innerSize, scaledInnerSize, // #11329
        point) {
            var retVal;
            // Too close to the edge, return false and swap dimensions
            if (point < distance || point > outerSize - distance) {
                retVal = false;
                // Align left/top
            }
            else if (point < innerSize / 2) {
                ret[dim] = 1;
                // Align right/bottom
            }
            else if (point > outerSize - scaledInnerSize / 2) {
                ret[dim] = outerSize - scaledInnerSize - 2;
                // Align center
            }
            else {
                ret[dim] = point - innerSize / 2;
            }
            return retVal;
        }, 
        /*
         * Swap the dimensions
         */
        swap = function (count) {
            var temp = first;
            first = second;
            second = temp;
            swapped = count;
        }, run = function () {
            if (firstDimension.apply(0, first) !== false) {
                if (secondDimension.apply(0, second) === false &&
                    !swapped) {
                    swap(true);
                    run();
                }
            }
            else if (!swapped) {
                swap(true);
                run();
            }
            else {
                ret.x = ret.y = 0;
            }
        };
        // Under these conditions, prefer the tooltip on the side of the point
        if (chart.inverted || this.len > 1) {
            swap();
        }
        run();
        return ret;
    },
    /**
     * In case no user defined formatter is given, this will be used. Note that
     * the context here is an object holding point, series, x, y etc.
     *
     * @function Highcharts.Tooltip#defaultFormatter
     *
     * @param {Highcharts.Tooltip} tooltip
     *
     * @return {Array<string>}
     */
    defaultFormatter: function (tooltip) {
        var items = this.points || splat(this), s;
        // Build the header
        s = [tooltip.tooltipFooterHeaderFormatter(items[0])];
        // build the values
        s = s.concat(tooltip.bodyFormatter(items));
        // footer
        s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));
        return s;
    },
    /**
     * Refresh the tooltip's text and position.
     *
     * @function Highcharts.Tooltip#refresh
     *
     * @param {Highcharts.Point|Array<Highcharts.Point>} pointOrPoints
     *        Either a point or an array of points.
     *
     * @param {Highcharts.PointerEventObject} [mouseEvent]
     *        Mouse event, that is responsible for the refresh and should be
     *        used for the tooltip update.
     *
     * @return {void}
     */
    refresh: function (pointOrPoints, mouseEvent) {
        var tooltip = this, chart = this.chart, options = tooltip.options, x, y, point = pointOrPoints, anchor, textConfig = {}, text, pointConfig = [], formatter = options.formatter || tooltip.defaultFormatter, shared = tooltip.shared, currentSeries, styledMode = chart.styledMode;
        if (!options.enabled) {
            return;
        }
        H.clearTimeout(this.hideTimer);
        // get the reference point coordinates (pie charts use tooltipPos)
        tooltip.followPointer = splat(point)[0].series.tooltipOptions
            .followPointer;
        anchor = tooltip.getAnchor(point, mouseEvent);
        x = anchor[0];
        y = anchor[1];
        // shared tooltip, array is sent over
        if (shared &&
            !(point.series &&
                point.series.noSharedTooltip)) {
            chart.pointer.applyInactiveState(point);
            // Now set hover state for the choosen ones:
            point.forEach(function (item) {
                item.setState('hover');
                pointConfig.push(item.getLabelConfig());
            });
            textConfig = {
                x: point[0].category,
                y: point[0].y
            };
            textConfig.points = pointConfig;
            point = point[0];
            // single point tooltip
        }
        else {
            textConfig = point.getLabelConfig();
        }
        this.len = pointConfig.length; // #6128
        text = formatter.call(textConfig, tooltip);
        // register the current series
        currentSeries = point.series;
        this.distance = pick(currentSeries.tooltipOptions.distance, 16);
        // update the inner HTML
        if (text === false) {
            this.hide();
        }
        else {
            // update text
            if (tooltip.split) {
                this.renderSplit(text, splat(pointOrPoints));
            }
            else {
                var label = tooltip.getLabel();
                // Prevent the tooltip from flowing over the chart box (#6659)
                if (!options.style.width || styledMode) {
                    label.css({
                        width: this.chart.spacingBox.width
                    });
                }
                label.attr({
                    text: text && text.join ?
                        text.join('') :
                        text
                });
                // Set the stroke color of the box to reflect the point
                label.removeClass(/highcharts-color-[\d]+/g)
                    .addClass('highcharts-color-' +
                    pick(point.colorIndex, currentSeries.colorIndex));
                if (!styledMode) {
                    label.attr({
                        stroke: (options.borderColor ||
                            point.color ||
                            currentSeries.color ||
                            '${palette.neutralColor60}')
                    });
                }
                tooltip.updatePosition({
                    plotX: x,
                    plotY: y,
                    negative: point.negative,
                    ttBelow: point.ttBelow,
                    h: anchor[2] || 0
                });
            }
            // show it
            if (tooltip.isHidden && tooltip.label) {
                tooltip.label.attr({
                    opacity: 1
                }).show();
            }
            tooltip.isHidden = false;
        }
        H.fireEvent(this, 'refresh');
    },
    /**
     * Render the split tooltip. Loops over each point's text and adds
     * a label next to the point, then uses the distribute function to
     * find best non-overlapping positions.
     *
     * @private
     * @function Highcharts.Tooltip#renderSplit
     *
     * @param {string|Array<(boolean|string)>} labels
     *
     * @param {Array<Highcharts.Point>} points
     */
    renderSplit: function (labels, points) {
        var tooltip = this;
        var chart = tooltip.chart, _a = tooltip.chart, chartWidth = _a.chartWidth, chartHeight = _a.chartHeight, plotHeight = _a.plotHeight, plotLeft = _a.plotLeft, plotTop = _a.plotTop, plotWidth = _a.plotWidth, pointer = _a.pointer, ren = _a.renderer, _b = _a.scrollablePixelsX, scrollablePixelsX = _b === void 0 ? 0 : _b, _c = _a.scrollablePixelsY, scrollablePixelsY = _c === void 0 ? 0 : _c, _d = _a.scrollingContainer, _e = _d === void 0 ? { scrollLeft: 0, scrollTop: 0 } : _d, scrollLeft = _e.scrollLeft, scrollTop = _e.scrollTop, styledMode = _a.styledMode, distance = tooltip.distance, options = tooltip.options, positioner = tooltip.options.positioner;
        // The area which the tooltip should be limited to. Limit to scrollable
        // plot area if enabled, otherwise limit to the chart container.
        var boundaries = {
            left: scrollablePixelsX ? plotLeft : 0,
            right: scrollablePixelsX ?
                plotLeft + plotWidth - scrollablePixelsX : chartWidth,
            top: scrollablePixelsY ? plotTop : 0,
            bottom: scrollablePixelsY ?
                plotTop + plotHeight - scrollablePixelsY : chartHeight
        };
        var tooltipLabel = tooltip.getLabel();
        var headerTop = Boolean(chart.xAxis[0] && chart.xAxis[0].opposite);
        var distributionBoxTop = plotTop;
        var headerHeight = 0;
        var maxLength = plotHeight - scrollablePixelsY;
        /**
         * Calculates the anchor position for the partial tooltip
         *
         * @private
         * @param {Highcharts.Point} point The point related to the tooltip
         * @return {object} Returns an object with anchorX and anchorY
         */
        function getAnchor(point) {
            var isHeader = point.isHeader, _a = point.plotX, plotX = _a === void 0 ? 0 : _a, _b = point.plotY, plotY = _b === void 0 ? 0 : _b, series = point.series;
            var anchorX;
            var anchorY;
            if (isHeader) {
                // Set anchorX to plotX
                anchorX = plotLeft + plotX - scrollLeft;
                // Set anchorY to center of visible plot area.
                anchorY = plotTop + (plotHeight - scrollablePixelsY) / 2;
            }
            else {
                var xAxis = series.xAxis, yAxis = series.yAxis;
                // Set anchorX to plotX. Limit to within xAxis.
                anchorX = xAxis.pos +
                    clamp(plotX, -distance, xAxis.len + distance) - scrollLeft;
                // Set anchorY to plotY. Limit to within yAxis.
                anchorY = yAxis.pos + clamp(plotY, 0, yAxis.len) - scrollTop;
            }
            // Limit values to plot area
            anchorX = clamp(anchorX, boundaries.left - distance, boundaries.right + distance);
            anchorY = clamp(anchorY, boundaries.top, boundaries.bottom);
            return { anchorX: anchorX, anchorY: anchorY };
        }
        /**
         * Calculates the position of the partial tooltip
         *
         * @private
         * @param {number} anchorX The partial tooltip anchor x position
         * @param {number} anchorY The partial tooltip anchor y position
         * @param {boolean} isHeader Wether the partial tooltip is a header
         * @param {number} boxWidth Width of the partial tooltip
         * @return {Highcharts.PositionObject} Returns the partial tooltip x and
         * y position
         */
        function defaultPositioner(anchorX, anchorY, isHeader, boxWidth, alignedLeft) {
            if (alignedLeft === void 0) { alignedLeft = true; }
            var y;
            var x;
            if (isHeader) {
                y = headerTop ? 0 : maxLength;
                x = clamp(anchorX - (boxWidth / 2), boundaries.left, boundaries.right - boxWidth);
            }
            else {
                y = anchorY - distributionBoxTop;
                x = alignedLeft ?
                    anchorX - boxWidth - distance :
                    anchorX + distance;
                x = clamp(x, alignedLeft ? x : boundaries.left, boundaries.right);
            }
            // NOTE: y is relative to distributionBoxTop
            return { x: x, y: y };
        }
        /**
         * Updates the attributes and styling of the partial tooltip. Creates a
         * new partial tooltip if it does not exists.
         *
         * @private
         * @param {Highcharts.SVGElement|undefined} partialTooltip
         *  The partial tooltip to update
         * @param {Highcharts.Point} point
         *  The point related to the partial tooltip
         * @param {boolean|string} str The text for the partial tooltip
         * @return {Highcharts.SVGElement} Returns the updated partial tooltip
         */
        function updatePartialTooltip(partialTooltip, point, str) {
            var tt = partialTooltip;
            var isHeader = point.isHeader, series = point.series;
            var colorClass = 'highcharts-color-' + pick(point.colorIndex, series.colorIndex, 'none');
            if (!tt) {
                var attribs = {
                    padding: options.padding,
                    r: options.borderRadius
                };
                if (!styledMode) {
                    attribs.fill = options.backgroundColor;
                    attribs['stroke-width'] = options.borderWidth;
                }
                tt = ren
                    .label(null, null, null, (options[isHeader ? 'headerShape' : 'shape']) ||
                    'callout', null, null, options.useHTML)
                    .addClass((isHeader ? 'highcharts-tooltip-header ' : '') +
                    'highcharts-tooltip-box ' +
                    colorClass)
                    .attr(attribs)
                    .add(tooltipLabel);
            }
            tt.isActive = true;
            tt.attr({
                text: str
            });
            if (!styledMode) {
                tt.css(options.style)
                    .shadow(options.shadow)
                    .attr({
                    stroke: (options.borderColor ||
                        point.color ||
                        series.color ||
                        '${palette.neutralColor80}')
                });
            }
            return tt;
        }
        // Graceful degradation for legacy formatters
        if (isString(labels)) {
            labels = [false, labels];
        }
        // Create the individual labels for header and points, ignore footer
        var boxes = labels.slice(0, points.length + 1).reduce(function (boxes, str, i) {
            if (str !== false && str !== '') {
                var point = points[i - 1] || {
                    // Item 0 is the header. Instead of this, we could also
                    // use the crosshair label
                    isHeader: true,
                    plotX: points[0].plotX,
                    plotY: plotHeight,
                    series: {}
                };
                var isHeader = point.isHeader;
                // Store the tooltip label referance on the series
                var owner = isHeader ? tooltip : point.series;
                var tt = owner.tt = updatePartialTooltip(owner.tt, point, str);
                // Get X position now, so we can move all to the other side in
                // case of overflow
                var bBox = tt.getBBox();
                var boxWidth = bBox.width + tt.strokeWidth();
                if (isHeader) {
                    headerHeight = bBox.height;
                    maxLength += headerHeight;
                    if (headerTop) {
                        distributionBoxTop -= headerHeight;
                    }
                }
                var _a = getAnchor(point), anchorX = _a.anchorX, anchorY = _a.anchorY;
                var size = bBox.height + 1;
                var boxPosition = positioner ? positioner.call(tooltip, boxWidth, size, point) : defaultPositioner(anchorX, anchorY, isHeader, boxWidth);
                boxes.push({
                    // 0-align to the top, 1-align to the bottom
                    align: positioner ? 0 : void 0,
                    anchorX: anchorX,
                    anchorY: anchorY,
                    boxWidth: boxWidth,
                    point: point,
                    rank: pick(boxPosition.rank, isHeader ? 1 : 0),
                    size: size,
                    target: boxPosition.y,
                    tt: tt,
                    x: boxPosition.x
                });
            }
            return boxes;
        }, []);
        // If overflow left then align all labels to the right
        if (!positioner && boxes.some(function (box) { return box.x < 0; })) {
            boxes = boxes.map(function (box) {
                var _a = defaultPositioner(box.anchorX, box.anchorY, box.point.isHeader, box.boxWidth, false), x = _a.x, y = _a.y;
                return extend(box, {
                    target: y,
                    x: x
                });
            });
        }
        // Clean previous run (for missing points)
        tooltip.cleanSplit();
        // Distribute and put in place
        H.distribute(boxes, maxLength);
        boxes.forEach(function (box) {
            var anchorX = box.anchorX, anchorY = box.anchorY, pos = box.pos, x = box.x;
            // Put the label in place
            box.tt.attr({
                visibility: typeof pos === 'undefined' ? 'hidden' : 'inherit',
                x: x,
                /* NOTE: y should equal pos to be consistent with !split
                 * tooltip, but is currently relative to plotTop. Is left as is
                 * to avoid breaking change. Remove distributionBoxTop to make
                 * it consistent.
                 */
                y: pos + distributionBoxTop,
                anchorX: anchorX,
                anchorY: anchorY
            });
        });
        /* If we have a seperate tooltip container, then update the necessary
         * container properties.
         * Test that tooltip has its own container and renderer before executing
         * the operation.
         */
        var container = tooltip.container, outside = tooltip.outside, renderer = tooltip.renderer;
        if (outside && container && renderer) {
            // Set container size to fit the tooltip
            var _f = tooltipLabel.getBBox(), width = _f.width, height = _f.height, x = _f.x, y = _f.y;
            renderer.setSize(width + x, height + y, false);
            // Position the tooltip container to the chart container
            var chartPosition = pointer.getChartPosition();
            container.style.left = chartPosition.left + 'px';
            container.style.top = chartPosition.top + 'px';
        }
    },
    /**
     * Find the new position and perform the move
     *
     * @private
     * @function Highcharts.Tooltip#updatePosition
     *
     * @param {Highcharts.Point} point
     */
    updatePosition: function (point) {
        var chart = this.chart, pointer = chart.pointer, label = this.getLabel(), pos, anchorX = point.plotX + chart.plotLeft, anchorY = point.plotY + chart.plotTop, pad;
        // Needed for outside: true (#11688)
        var chartPosition = pointer.getChartPosition();
        pos = (this.options.positioner || this.getPosition).call(this, label.width, label.height, point);
        // Set the renderer size dynamically to prevent document size to change
        if (this.outside) {
            pad = (this.options.borderWidth || 0) + 2 * this.distance;
            this.renderer.setSize(label.width + pad, label.height + pad, false);
            // Anchor and tooltip container need scaling if chart container has
            // scale transform/css zoom. #11329.
            var containerScaling = chart.containerScaling;
            if (containerScaling) {
                H.css(this.container, {
                    transform: "scale(" + containerScaling.scaleX + ", " + containerScaling.scaleY + ")"
                });
                anchorX *= containerScaling.scaleX;
                anchorY *= containerScaling.scaleY;
            }
            anchorX += chartPosition.left - pos.x;
            anchorY += chartPosition.top - pos.y;
        }
        // do the move
        this.move(Math.round(pos.x), Math.round(pos.y || 0), // can be undefined (#3977)
        anchorX, anchorY);
    },
    /**
     * Get the optimal date format for a point, based on a range.
     *
     * @private
     * @function Highcharts.Tooltip#getDateFormat
     *
     * @param {number} range
     *        The time range
     *
     * @param {number} date
     *        The date of the point in question
     *
     * @param {number} startOfWeek
     *        An integer representing the first day of the week, where 0 is
     *        Sunday.
     *
     * @param {Highcharts.Dictionary<string>} dateTimeLabelFormats
     *        A map of time units to formats.
     *
     * @return {string}
     *         The optimal date format for a point.
     */
    getDateFormat: function (range, date, startOfWeek, dateTimeLabelFormats) {
        var time = this.chart.time, dateStr = time.dateFormat('%m-%d %H:%M:%S.%L', date), format, n, blank = '01-01 00:00:00.000', strpos = {
            millisecond: 15,
            second: 12,
            minute: 9,
            hour: 6,
            day: 3
        }, lastN = 'millisecond'; // for sub-millisecond data, #4223
        for (n in timeUnits) { // eslint-disable-line guard-for-in
            // If the range is exactly one week and we're looking at a
            // Sunday/Monday, go for the week format
            if (range === timeUnits.week &&
                +time.dateFormat('%w', date) === startOfWeek &&
                dateStr.substr(6) === blank.substr(6)) {
                n = 'week';
                break;
            }
            // The first format that is too great for the range
            if (timeUnits[n] > range) {
                n = lastN;
                break;
            }
            // If the point is placed every day at 23:59, we need to show
            // the minutes as well. #2637.
            if (strpos[n] &&
                dateStr.substr(strpos[n]) !== blank.substr(strpos[n])) {
                break;
            }
            // Weeks are outside the hierarchy, only apply them on
            // Mondays/Sundays like in the first condition
            if (n !== 'week') {
                lastN = n;
            }
        }
        if (n) {
            format = time.resolveDTLFormat(dateTimeLabelFormats[n]).main;
        }
        return format;
    },
    /**
     * Get the best X date format based on the closest point range on the axis.
     *
     * @private
     * @function Highcharts.Tooltip#getXDateFormat
     *
     * @param {Highcharts.Point} point
     *
     * @param {Highcharts.TooltipOptions} options
     *
     * @param {Highcharts.Axis} xAxis
     *
     * @return {string}
     */
    getXDateFormat: function (point, options, xAxis) {
        var xDateFormat, dateTimeLabelFormats = options.dateTimeLabelFormats, closestPointRange = xAxis && xAxis.closestPointRange;
        if (closestPointRange) {
            xDateFormat = this.getDateFormat(closestPointRange, point.x, xAxis.options.startOfWeek, dateTimeLabelFormats);
        }
        else {
            xDateFormat = dateTimeLabelFormats.day;
        }
        return xDateFormat || dateTimeLabelFormats.year; // #2546, 2581
    },
    /**
     * Format the footer/header of the tooltip
     * #3397: abstraction to enable formatting of footer and header
     *
     * @private
     * @function Highcharts.Tooltip#tooltipFooterHeaderFormatter
     * @param {Highcharts.PointLabelObject} labelConfig
     * @param {boolean} [isFooter]
     * @return {string}
     */
    tooltipFooterHeaderFormatter: function (labelConfig, isFooter) {
        var footOrHead = isFooter ? 'footer' : 'header', series = labelConfig.series, tooltipOptions = series.tooltipOptions, xDateFormat = tooltipOptions.xDateFormat, xAxis = series.xAxis, isDateTime = (xAxis &&
            xAxis.options.type === 'datetime' &&
            isNumber(labelConfig.key)), formatString = tooltipOptions[footOrHead + 'Format'], evt = {
            isFooter: isFooter,
            labelConfig: labelConfig
        };
        H.fireEvent(this, 'headerFormatter', evt, function (e) {
            // Guess the best date format based on the closest point distance
            // (#568, #3418)
            if (isDateTime && !xDateFormat) {
                xDateFormat = this.getXDateFormat(labelConfig, tooltipOptions, xAxis);
            }
            // Insert the footer date format if any
            if (isDateTime && xDateFormat) {
                ((labelConfig.point && labelConfig.point.tooltipDateKeys) ||
                    ['key']).forEach(function (key) {
                    formatString = formatString.replace('{point.' + key + '}', '{point.' + key + ':' + xDateFormat + '}');
                });
            }
            // Replace default header style with class name
            if (series.chart.styledMode) {
                formatString = this.styledModeFormat(formatString);
            }
            e.text = format(formatString, {
                point: labelConfig,
                series: series
            }, this.chart);
        });
        return evt.text;
    },
    /**
     * Build the body (lines) of the tooltip by iterating over the items and
     * returning one entry for each item, abstracting this functionality allows
     * to easily overwrite and extend it.
     *
     * @private
     * @function Highcharts.Tooltip#bodyFormatter
     * @param {Array<(Highcharts.Point|Highcharts.Series)>} items
     * @return {Array<string>}
     */
    bodyFormatter: function (items) {
        return items.map(function (item) {
            var tooltipOptions = item.series.tooltipOptions;
            return (tooltipOptions[(item.point.formatPrefix || 'point') + 'Formatter'] ||
                item.point.tooltipFormatter).call(item.point, tooltipOptions[(item.point.formatPrefix || 'point') + 'Format'] || '');
        });
    },
    styledModeFormat: function (formatString) {
        return formatString
            .replace('style="font-size: 10px"', 'class="highcharts-header"')
            .replace(/style="color:{(point|series)\.color}"/g, 'class="highcharts-color-{$1.colorIndex}"');
    }
};
