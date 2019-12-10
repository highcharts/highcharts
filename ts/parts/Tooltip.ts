/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

import U from './Utilities.js';
const {
    clamp,
    defined,
    discardElement,
    extend,
    isNumber,
    isString,
    pick,
    splat,
    syncTimeout
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class Tooltip {
            public constructor(chart: Chart, options: TooltipOptions);
            public chart: Chart;
            public container?: HTMLDOMElement;
            public crosshairs: Array<null>;
            public distance: number;
            public followPointer?: boolean;
            public hideTimer?: number;
            public isHidden: boolean;
            public label?: SVGElement;
            public len?: number;
            public now: Dictionary<number>;
            public options: TooltipOptions;
            public outside: (boolean|undefined);
            public renderer?: Renderer;
            public shared: (boolean|undefined);
            public split: (boolean|undefined);
            public tooltipTimeout?: number;
            public tt?: SVGElement;
            public applyFilter(): void;
            public bodyFormatter(items: Array<(Point|Series)>): Array<string>;
            public cleanSplit(force?: boolean): void;
            public defaultFormatter(
                this: TooltipFormatterContextObject,
                tooltip: Tooltip
            ): (string|Array<string>);
            public destroy(): void;
            public getAnchor(
                points: Array<Point>,
                mouseEvent?: PointerEventObject
            ): Array<number>;
            public getDateFormat(
                range: number,
                date: number,
                startOfWeek: number,
                dateTimeLabelFormats: Dictionary<string>
            ): string;
            public getLabel(): SVGElement;
            public getPosition(
                boxWidth: number,
                boxHeight: number,
                point: Point
            ): Dictionary<number>;
            public getXDateFormat(
                point: Point,
                options: TooltipOptions,
                xAxis: Axis
            ): string;
            public hide(delay?: number): void;
            public init(chart: Chart, options: TooltipOptions): void;
            public move(
                x: number,
                y: number,
                anchorX: number,
                anchorY: number
            ): void;
            public refresh(
                pointOrPoints: (Point|Array<Point>),
                mouseEvent?: PointerEventObject
            ): void;
            public renderSplit(
                labels: (string|Array<(boolean|string)>),
                points: Array<Point>
            ): void;
            public styledModeFormat(formatString: string): string;
            public tooltipFooterHeaderFormatter(
                labelConfig: PointLabelObject,
                isFooter?: boolean
            ): string;
            public update(options: TooltipOptions): void;
            public updatePosition(point: Point): void;
        }
        interface Point {
            tooltipPos?: Array<number>;
        }
        interface Series {
            noSharedTooltip?: boolean;
            tt?: SVGElement;
        }
        interface SeriesOptions {
            tooltip?: TooltipOptions;
        }
        interface TooltipFormatterCallbackFunction {
            (
                this: TooltipFormatterContextObject,
                tooltip: Tooltip
            ): (false|string|Array<string>);
        }
        interface TooltipFormatterContextObject {
            color: (ColorString|GradientColorObject|PatternObject);
            colorIndex?: number;
            key: number;
            percentage?: number;
            point: Point;
            points?: Array<Highcharts.TooltipFormatterContextObject>;
            series: Series;
            total?: number;
            x: number;
            y: number;
        }
        interface TooltipOptions {
            distance?: number;
        }
        interface TooltipPositionerCallbackFunction {
            (
                labelWidth: number,
                labelHeight: number,
                point: TooltipPositionerPointObject
            ): PositionObject;
        }
        interface TooltipPositionerPointObject {
            isHeader: boolean;
            negative: boolean;
            plotX: number;
            plotY: number;
        }
        type TooltipShapeValue = ('callout'|'circle'|'square');
    }
}

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
 *//**
 * @name Highcharts.TooltipFormatterContextObject#color
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#colorIndex
 * @type {number|undefined}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#key
 * @type {number}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#percentage
 * @type {number|undefined}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#point
 * @type {Highcharts.Point}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#points
 * @type {Array<Highcharts.TooltipFormatterContextObject>|undefined}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#series
 * @type {Highcharts.Series}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#total
 * @type {number|undefined}
 *//**
 * @name Highcharts.TooltipFormatterContextObject#x
 * @type {number}
 *//**
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
 *//**
 * If `tooltip.split` option is enabled and positioner is called for each of the
 * boxes separately, this property indicates the call on the xAxis header, which
 * is not a point itself.
 * @name Highcharts.TooltipPositionerPointObject#isHeader
 * @type {boolean}
 *//**
 * @name Highcharts.TooltipPositionerPointObject#negative
 * @type {boolean}
 *//**
 * The reference point relative to the plot area. Add chart.plotLeft to get the
 * full coordinates.
 * @name Highcharts.TooltipPositionerPointObject#plotX
 * @type {number}
 *//**
 * The reference point relative to the plot area. Add chart.plotTop to get the
 * full coordinates.
 * @name Highcharts.TooltipPositionerPointObject#plotY
 * @type {number}
 */

/**
 * @typedef {"callout"|"circle"|"square"} Highcharts.TooltipShapeValue
 */

''; // separates doclets above from variables below

var doc = H.doc,
    format = H.format,
    merge = H.merge,
    timeUnits = H.timeUnits;

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
H.Tooltip = function (this: Highcharts.Tooltip): any {
    this.init.apply(this, arguments as any);
} as any;

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
    init: function (
        this: Highcharts.Tooltip,
        chart: Highcharts.Chart,
        options: Highcharts.TooltipOptions
    ): void {

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
        this.outside = pick(
            options.outside,
            Boolean(chart.scrollablePixelsX || chart.scrollablePixelsY)
        );
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
    cleanSplit: function (this: Highcharts.Tooltip, force: boolean): void {
        this.chart.series.forEach(function (series: Highcharts.Series): void {
            var tt = series && series.tt;

            if (tt) {
                if (!tt.isActive || force) {
                    series.tt = tt.destroy();
                } else {
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
    applyFilter: function (this: Highcharts.Tooltip): void {

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
    getLabel: function (this: Highcharts.Tooltip): Highcharts.SVGElement {

        var tooltip = this,
            renderer = this.chart.renderer as Highcharts.Renderer,
            styledMode = this.chart.styledMode,
            options = this.options,
            className: string = 'tooltip' +
                (defined(options.className) ? ' ' + options.className : ''),
            container: Highcharts.HTMLDOMElement,
            set: Highcharts.Dictionary<Function>;

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
                this.renderer = renderer = new H.Renderer(
                    container,
                    0,
                    0,
                    {},
                    void 0,
                    void 0,
                    renderer.styledMode
                );
            }


            // Create the label
            if (this.split) {
                this.label = renderer.g(className);
            } else {
                this.label = renderer
                    .label(
                        '',
                        0,
                        0,
                        options.shape || 'callout',
                        null as any,
                        null as any,
                        options.useHTML,
                        null as any,
                        className
                    )
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
                        .css(options.style as any)
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
                    x: this.label.xSetter as any,
                    y: this.label.ySetter as any
                };
                this.label.xSetter = function (
                    value: string,
                    key: string
                ): void {
                    set[key].call(this.label, tooltip.distance);
                    container.style.left = value + 'px';
                };
                this.label.ySetter = function (
                    value: string,
                    key: string
                ): void {
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
    update: function (
        this: Highcharts.Tooltip,
        options: Highcharts.TooltipOptions
    ): void {
        this.destroy();
        // Update user options (#6218)
        merge(true, (this.chart.options.tooltip as any).userOptions, options);
        this.init(this.chart, merge(true, this.options, options));
    },

    /**
     * Removes and destroys the tooltip and its elements.
     *
     * @function Highcharts.Tooltip#destroy
     * @return {void}
     */
    destroy: function (this: Highcharts.Tooltip): void {
        // Destroy and clear local variables
        if (this.label) {
            this.label = this.label.destroy();
        }
        if (this.split && this.tt) {
            (this.cleanSplit as any)(this.chart, true);
            this.tt = this.tt.destroy();
        }
        if (this.renderer) {
            this.renderer = this.renderer.destroy() as any;
            discardElement(this.container as any);
        }
        H.clearTimeout(this.hideTimer as any);
        H.clearTimeout(this.tooltipTimeout as any);
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
    move: function (
        this: Highcharts.Tooltip,
        x: number,
        y: number,
        anchorX: number,
        anchorY: number
    ): void {
        var tooltip = this,
            now = tooltip.now,
            animate = tooltip.options.animation !== false &&
                !tooltip.isHidden &&
                // When we get close to the target position, abort animation and
                // land on the right place (#3056)
                (Math.abs(x - now.x) > 1 || Math.abs(y - now.y) > 1),
            skipAnchor = tooltip.followPointer || (tooltip.len as any) > 1;

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
            H.clearTimeout(this.tooltipTimeout as any);

            // Set the fixed interval ticking for the smooth tooltip
            this.tooltipTimeout = setTimeout(function (): void {
                // The interval function may still be running during destroy,
                // so check that the chart is really there before calling.
                if (tooltip) {
                    tooltip.move(x, y, anchorX, anchorY);
                }
            }, 32) as any;

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
    hide: function (this: Highcharts.Tooltip, delay?: number): void {
        var tooltip = this;

        // disallow duplicate timers (#1728, #1766)
        H.clearTimeout(this.hideTimer as any);
        delay = pick(delay, this.options.hideDelay, 500);
        if (!this.isHidden) {
            this.hideTimer = syncTimeout(function (): void {
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
     * @param {Array<Highcharts.Point>} points
     *
     * @param {Highcharts.PointerEventObject} [mouseEvent]
     *
     * @return {Array<number>}
     */
    getAnchor: function (
        this: Highcharts.Tooltip,
        points: Array<Highcharts.Point>,
        mouseEvent?: Highcharts.PointerEventObject
    ): Array<number> {
        var ret,
            chart = this.chart,
            pointer = chart.pointer,
            inverted = chart.inverted,
            plotTop = chart.plotTop,
            plotLeft = chart.plotLeft,
            plotX = 0,
            plotY = 0,
            yAxis,
            xAxis;

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
        } else if (points[0].tooltipPos) {
            ret = points[0].tooltipPos;
        // When shared, use the average position
        } else {
            points.forEach(function (point: Highcharts.Point): void {
                yAxis = point.series.yAxis;
                xAxis = point.series.xAxis;
                plotX += (point.plotX as any) +
                    (!inverted && xAxis ? xAxis.left - plotLeft : 0);
                plotY += (
                    point.plotLow ?
                        ((point.plotLow as any) + point.plotHigh) / 2 :
                        (point.plotY as any)
                ) + (!inverted && yAxis ? yAxis.top - plotTop : 0); // #1151
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
     * @return {Highcharts.Dictionary<number>}
     */
    getPosition: function (
        this: Highcharts.Tooltip,
        boxWidth: number,
        boxHeight: number,
        point: Highcharts.Point
    ): Highcharts.Dictionary<number> {

        var chart = this.chart,
            distance = this.distance,
            ret = {} as Highcharts.Dictionary<number>,
            // Don't use h if chart isn't inverted (#7242) ???
            h = (chart.inverted && (point as any).h) || 0, // #4117 ???
            swapped: (boolean|undefined),
            outside = this.outside,
            outerWidth = outside ?
                // substract distance to prevent scrollbars
                doc.documentElement.clientWidth - 2 * distance :
                chart.chartWidth,
            outerHeight = outside ?
                Math.max(
                    doc.body.scrollHeight,
                    doc.documentElement.scrollHeight,
                    doc.body.offsetHeight,
                    doc.documentElement.offsetHeight,
                    doc.documentElement.clientHeight
                ) :
                chart.chartHeight,
            chartPosition = chart.pointer.getChartPosition(),
            containerScaling = chart.containerScaling,
            scaleX = (val: number): number => ( // eslint-disable-line no-confusing-arrow
                containerScaling ? val * containerScaling.scaleX : val
            ),
            scaleY = (val: number): number => ( // eslint-disable-line no-confusing-arrow
                containerScaling ? val * containerScaling.scaleY : val
            ),
            // Build parameter arrays for firstDimension()/secondDimension()
            buildDimensionArray = (dim: 'x' | 'y'): Array<number|string> => {
                const isX = dim === 'x';
                return [
                    dim, // Dimension - x or y
                    isX ? outerWidth : outerHeight,
                    isX ? boxWidth : boxHeight
                ].concat(outside ? [
                    // If we are using tooltip.outside, we need to scale the
                    // position to match scaling of the container in case there
                    // is a transform/zoom on the container. #11329
                    isX ? scaleX(boxWidth) : scaleY(boxHeight),
                    isX ? chartPosition.left - distance +
                            scaleX((point.plotX as any) + chart.plotLeft) :
                        chartPosition.top - distance +
                            scaleY((point.plotY as any) + chart.plotTop),
                    0,
                    isX ? outerWidth : outerHeight
                ] : [
                    // Not outside, no scaling is needed
                    isX ? boxWidth : boxHeight,
                    isX ? (point.plotX as any) + chart.plotLeft :
                        (point.plotY as any) + chart.plotTop,
                    isX ? chart.plotLeft : chart.plotTop,
                    isX ? chart.plotLeft + chart.plotWidth :
                        chart.plotTop + chart.plotHeight
                ]);
            },
            first = buildDimensionArray('y'),
            second = buildDimensionArray('x'),
            // The far side is right or bottom
            preferFarSide = !this.followPointer && pick(
                point.ttBelow,
                !chart.inverted === !!point.negative
            ), // #4984

            /*
             * Handle the preferred dimension. When the preferred dimension is
             * tooltip on top or bottom of the point, it will look for space
             * there.
             *
             * @private
             */
            firstDimension = function (
                dim: string,
                outerSize: number,
                innerSize: number,
                scaledInnerSize: number, // #11329
                point: number,
                min: number,
                max: number
            ): (boolean|undefined) {
                const scaledDist = dim === 'y' ?
                        scaleY(distance) : scaleX(distance),
                    scaleDiff = (innerSize - scaledInnerSize) / 2,
                    roomLeft = scaledInnerSize < point - distance,
                    roomRight = point + distance + scaledInnerSize < outerSize,
                    alignedLeft = point - scaledDist - innerSize + scaleDiff,
                    alignedRight = point + scaledDist - scaleDiff;

                if (preferFarSide && roomRight) {
                    ret[dim] = alignedRight;
                } else if (!preferFarSide && roomLeft) {
                    ret[dim] = alignedLeft;
                } else if (roomLeft) {
                    ret[dim] = Math.min(
                        max - scaledInnerSize,
                        alignedLeft - h < 0 ? alignedLeft : alignedLeft - h
                    );
                } else if (roomRight) {
                    ret[dim] = Math.max(
                        min,
                        alignedRight + h + innerSize > outerSize ?
                            alignedRight :
                            alignedRight + h
                    );
                } else {
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
            secondDimension = function (
                dim: number,
                outerSize: number,
                innerSize: number,
                scaledInnerSize: number, // #11329
                point: number
            ): (boolean|undefined) {
                var retVal;
                // Too close to the edge, return false and swap dimensions
                if (point < distance || point > outerSize - distance) {
                    retVal = false;
                // Align left/top
                } else if (point < innerSize / 2) {
                    ret[dim] = 1;
                // Align right/bottom
                } else if (point > outerSize - scaledInnerSize / 2) {
                    ret[dim] = outerSize - scaledInnerSize - 2;
                // Align center
                } else {
                    ret[dim] = point - innerSize / 2;
                }
                return retVal;
            },

            /*
             * Swap the dimensions
             */
            swap = function (count?: boolean): void {
                var temp = first;

                first = second;
                second = temp;
                swapped = count;
            },
            run = function (): void {
                if (firstDimension.apply(0, first as any) !== false) {
                    if (
                        secondDimension.apply(0, second as any) === false &&
                        !swapped
                    ) {
                        swap(true);
                        run();
                    }
                } else if (!swapped) {
                    swap(true);
                    run();
                } else {
                    ret.x = ret.y = 0;
                }
            };

        // Under these conditions, prefer the tooltip on the side of the point
        if (chart.inverted || (this.len as any) > 1) {
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
    defaultFormatter: function (
        this: Highcharts.TooltipFormatterContextObject,
        tooltip: Highcharts.Tooltip
    ): (string|Array<string>) {
        var items = this.points || splat(this),
            s: (string|Array<string>);

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
    refresh: function (
        this: Highcharts.Tooltip,
        pointOrPoints: (Highcharts.Point|Array<Highcharts.Point>),
        mouseEvent?: Highcharts.PointerEventObject
    ): void {
        var tooltip = this,
            chart = this.chart,
            options = tooltip.options,
            x,
            y,
            point = pointOrPoints,
            anchor,
            textConfig = {} as Highcharts.TooltipFormatterContextObject,
            text: (boolean|string),
            pointConfig = [] as Array<Highcharts.PointLabelObject>,
            formatter = options.formatter || tooltip.defaultFormatter,
            shared = tooltip.shared,
            currentSeries,
            styledMode = chart.styledMode;

        if (!options.enabled) {
            return;
        }

        H.clearTimeout(this.hideTimer as any);

        // get the reference point coordinates (pie charts use tooltipPos)
        tooltip.followPointer = splat(point)[0].series.tooltipOptions
            .followPointer;
        anchor = tooltip.getAnchor(point as any, mouseEvent);
        x = anchor[0];
        y = anchor[1];

        // shared tooltip, array is sent over
        if (shared &&
            !((point as any).series &&
            (point as any).series.noSharedTooltip)
        ) {
            chart.pointer.applyInactiveState(point as any);

            // Now set hover state for the choosen ones:
            (point as any).forEach(function (item: Highcharts.Point): void {
                item.setState('hover');
                pointConfig.push(item.getLabelConfig());
            });

            textConfig = {
                x: (point as any)[0].category,
                y: (point as any)[0].y
            } as any;
            textConfig.points = pointConfig as any;
            point = (point as any)[0];

        // single point tooltip
        } else {
            textConfig = (point as any).getLabelConfig();
        }
        this.len = pointConfig.length; // #6128
        text = (formatter as any).call(textConfig, tooltip);

        // register the current series
        currentSeries = (point as any).series;
        this.distance = pick(currentSeries.tooltipOptions.distance, 16);

        // update the inner HTML
        if (text === false) {
            this.hide();
        } else {
            // update text
            if (tooltip.split) {
                this.renderSplit(text as any, splat(pointOrPoints));
            } else {
                const label = tooltip.getLabel();

                // Prevent the tooltip from flowing over the chart box (#6659)
                if (!(options.style as any).width || styledMode) {
                    label.css({
                        width: this.chart.spacingBox.width
                    });
                }

                label.attr({
                    text: text && (text as any).join ?
                        (text as any).join('') :
                        text
                });

                // Set the stroke color of the box to reflect the point
                label.removeClass(/highcharts-color-[\d]+/g)
                    .addClass(
                        'highcharts-color-' +
                        pick(
                            (point as any).colorIndex,
                            currentSeries.colorIndex
                        )
                    );

                if (!styledMode) {
                    label.attr({
                        stroke: (
                            options.borderColor ||
                            (point as any).color ||
                            currentSeries.color ||
                            '${palette.neutralColor60}'
                        )
                    });
                }

                tooltip.updatePosition({
                    plotX: x,
                    plotY: y,
                    negative: (point as any).negative,
                    ttBelow: (point as any).ttBelow,
                    h: anchor[2] || 0
                } as any);
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
    renderSplit: function (
        this: Highcharts.Tooltip,
        labels: (string|Array<(boolean|string)>),
        points: Array<Highcharts.Point>
    ): void {
        const tooltip = this;
        const {
            chart,
            chart: {
                chartWidth,
                chartHeight,
                plotHeight,
                plotLeft,
                plotTop,
                plotWidth,
                pointer,
                renderer: ren,
                scrollablePixelsX = 0,
                scrollablePixelsY = 0,
                scrollingContainer: {
                    scrollLeft,
                    scrollTop
                } = { scrollLeft: 0, scrollTop: 0 },
                styledMode
            },
            distance,
            options,
            options: {
                positioner
            }
        } = tooltip;

        // The area which the tooltip should be limited to. Limit to scrollable
        // plot area if enabled, otherwise limit to the chart container.
        const boundaries = {
            left: scrollablePixelsX ? plotLeft : 0,
            right: scrollablePixelsX ?
                plotLeft + plotWidth - scrollablePixelsX : chartWidth,
            top: scrollablePixelsY ? plotTop : 0,
            bottom: scrollablePixelsY ?
                plotTop + plotHeight - scrollablePixelsY : chartHeight
        };

        const tooltipLabel = tooltip.getLabel();
        const headerTop = Boolean(chart.xAxis[0] && chart.xAxis[0].opposite);

        let distributionBoxTop = plotTop;
        let headerHeight = 0;
        let maxLength = plotHeight - scrollablePixelsY;

        /**
         * Calculates the anchor position for the partial tooltip
         *
         * @private
         * @param {Highcharts.Point} point The point related to the tooltip
         * @return {object} Returns an object with anchorX and anchorY
         */
        function getAnchor(
            point: Highcharts.Point & { isHeader?: boolean }
        ): ({ anchorX: number; anchorY: number }) {
            const { isHeader, plotX = 0, plotY = 0, series } = point;

            let anchorX;
            let anchorY;
            if (isHeader) {
                // Set anchorX to plotX
                anchorX = plotLeft + plotX - scrollLeft;
                // Set anchorY to center of visible plot area.
                anchorY = plotTop + (plotHeight - scrollablePixelsY) / 2;
            } else {
                const { xAxis, yAxis } = series;
                // Set anchorX to plotX. Limit to within xAxis.
                anchorX = xAxis.pos +
                    clamp(plotX, -distance, xAxis.len + distance) - scrollLeft;
                // Set anchorY to plotY. Limit to within yAxis.
                anchorY = yAxis.pos + clamp(plotY, 0, yAxis.len) - scrollTop;
            }

            // Limit values to plot area
            anchorX = clamp(
                anchorX,
                boundaries.left - distance,
                boundaries.right + distance
            );
            anchorY = clamp(anchorY, boundaries.top, boundaries.bottom);
            return { anchorX, anchorY };
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
        function defaultPositioner(
            anchorX: number,
            anchorY: number,
            isHeader: boolean,
            boxWidth: number,
            alignedLeft = true
        ): Highcharts.PositionObject {
            let y;
            let x;
            if (isHeader) {
                y = headerTop ? 0 : maxLength;
                x = clamp(
                    anchorX - (boxWidth / 2),
                    boundaries.left,
                    boundaries.right - boxWidth
                );
            } else {
                y = anchorY - distributionBoxTop;
                x = alignedLeft ?
                    anchorX - boxWidth - distance :
                    anchorX + distance;
                x = clamp(
                    x, alignedLeft ? x : boundaries.left, boundaries.right
                );
            }

            // NOTE: y is relative to distributionBoxTop
            return { x, y };
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
        function updatePartialTooltip(
            partialTooltip: (Highcharts.SVGElement|undefined),
            point: (Highcharts.Point & { isHeader?: boolean }),
            str: (boolean|string)
        ): Highcharts.SVGElement {
            let tt = partialTooltip;
            const { isHeader, series } = point;
            const colorClass = 'highcharts-color-' + pick(
                point.colorIndex, series.colorIndex, 'none'
            );
            if (!tt) {

                const attribs: Highcharts.SVGAttributes = {
                    padding: options.padding,
                    r: options.borderRadius
                };

                if (!styledMode) {
                    attribs.fill = options.backgroundColor;
                    attribs['stroke-width'] = options.borderWidth;
                }

                tt = ren
                    .label(
                        null as any,
                        null as any,
                        null as any,
                        (options[isHeader ? 'headerShape' : 'shape']) ||
                        'callout',
                        null as any,
                        null as any,
                        options.useHTML
                    )
                    .addClass(
                        isHeader ? 'highcharts-tooltip-header ' : '' +
                        'highcharts-tooltip-box ' +
                        colorClass
                    )
                    .attr(attribs)
                    .add(tooltipLabel);
            }

            tt.isActive = true;
            tt.attr({
                text: str
            });
            if (!styledMode) {
                tt.css(options.style as any)
                    .shadow(options.shadow)
                    .attr({
                        stroke: (
                            options.borderColor ||
                            point.color ||
                            series.color ||
                            '${palette.neutralColor80}'
                        )
                    });
            }
            return tt;
        }

        // Graceful degradation for legacy formatters
        if (isString(labels)) {
            labels = [false, labels];
        }
        // Create the individual labels for header and points, ignore footer
        let boxes = labels.slice(0, points.length + 1).reduce(function (
            boxes: Array<Highcharts.Dictionary<any>>,
            str: (boolean|string),
            i: number
        ): Array<Highcharts.Dictionary<any>> {
            if (str !== false && str !== '') {
                const point = points[i - 1] || {
                    // Item 0 is the header. Instead of this, we could also
                    // use the crosshair label
                    isHeader: true,
                    plotX: points[0].plotX,
                    plotY: plotHeight,
                    series: {}
                };
                const isHeader: boolean = (point as any).isHeader;

                // Store the tooltip label referance on the series
                const owner = isHeader ? tooltip : point.series;
                const tt = owner.tt = updatePartialTooltip(
                    owner.tt, point, str
                );

                // Get X position now, so we can move all to the other side in
                // case of overflow
                const bBox = tt.getBBox();
                const boxWidth = bBox.width + tt.strokeWidth();
                if (isHeader) {
                    headerHeight = bBox.height;
                    maxLength += headerHeight;
                    if (headerTop) {
                        distributionBoxTop -= headerHeight;
                    }
                }

                const { anchorX, anchorY } = getAnchor(point);
                const size = bBox.height + 1;
                const boxPosition = positioner ? positioner.call(
                    tooltip,
                    boxWidth,
                    size,
                    point as any
                ) : defaultPositioner(
                    anchorX,
                    anchorY,
                    isHeader,
                    boxWidth
                );

                boxes.push({
                    // 0-align to the top, 1-align to the bottom
                    align: positioner ? 0 : void 0,
                    anchorX,
                    anchorY,
                    boxWidth,
                    point: point as any,
                    rank: pick((boxPosition as any).rank, isHeader ? 1 : 0),
                    size,
                    target: boxPosition.y,
                    tt,
                    x: boxPosition.x
                });
            }
            return boxes;
        }, []);

        // If overflow left then align all labels to the right
        if (!positioner && boxes.some((box): boolean => box.x < 0)) {
            boxes = boxes.map((box): Highcharts.Dictionary<any> => {
                const { x, y } = defaultPositioner(
                    box.anchorX,
                    box.anchorY,
                    box.point.isHeader,
                    box.boxWidth,
                    false
                );
                return extend(box, {
                    target: y,
                    x
                });
            });
        }

        // Clean previous run (for missing points)
        tooltip.cleanSplit();

        // Distribute and put in place
        H.distribute(boxes as any, maxLength, void 0 as any);
        boxes.forEach(function (box: Highcharts.Dictionary<any>): void {
            const { anchorX, anchorY, pos, x } = box;
            // Put the label in place
            box.tt.attr({
                visibility: typeof pos === 'undefined' ? 'hidden' : 'inherit',
                x,
                /* NOTE: y should equal pos to be consistent with !split
                 * tooltip, but is currently relative to plotTop. Is left as is
                 * to avoid breaking change. Remove distributionBoxTop to make
                 * it consistent.
                 */
                y: pos + distributionBoxTop,
                anchorX,
                anchorY
            });
        });

        /* If we have a seperate tooltip container, then update the necessary
         * container properties.
         * Test that tooltip has its own container and renderer before executing
         * the operation.
         */
        const {
            container,
            outside,
            renderer
        } = tooltip;
        if (outside && container && renderer) {
            // Set container size to fit the tooltip
            const { width, height, x, y } = tooltipLabel.getBBox();
            renderer.setSize(
                width + x,
                height + y,
                false
            );

            // Position the tooltip container to the chart container
            const chartPosition = pointer.getChartPosition();
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
    updatePosition: function (
        this: Highcharts.Tooltip,
        point: Highcharts.Point
    ): void {
        var chart = this.chart,
            pointer = chart.pointer,
            label = this.getLabel(),
            pos,
            anchorX = (point.plotX as any) + chart.plotLeft,
            anchorY = (point.plotY as any) + chart.plotTop,
            pad;

        // Needed for outside: true (#11688)
        const chartPosition = pointer.getChartPosition();

        pos = ((this.options.positioner as any) || this.getPosition).call(
            this,
            label.width,
            label.height,
            point
        );

        // Set the renderer size dynamically to prevent document size to change
        if (this.outside) {
            pad = (this.options.borderWidth || 0) + 2 * this.distance;
            (this.renderer as any).setSize(
                label.width + pad,
                label.height + pad,
                false
            );

            // Anchor and tooltip container need scaling if chart container has
            // scale transform/css zoom. #11329.
            const containerScaling = chart.containerScaling;
            if (containerScaling) {
                H.css(this.container as Highcharts.HTMLDOMElement, {
                    transform: `scale(${
                        containerScaling.scaleX
                    }, ${
                        containerScaling.scaleY
                    })`
                });
                anchorX *= containerScaling.scaleX;
                anchorY *= containerScaling.scaleY;
            }

            anchorX += chartPosition.left - pos.x;
            anchorY += chartPosition.top - pos.y;
        }

        // do the move
        this.move(
            Math.round(pos.x),
            Math.round(pos.y || 0), // can be undefined (#3977)
            anchorX,
            anchorY
        );
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
    getDateFormat: function (
        this: Highcharts.Tooltip,
        range: number,
        date: number,
        startOfWeek: number,
        dateTimeLabelFormats: Highcharts.Dictionary<string>
    ): string {
        var time = this.chart.time,
            dateStr = time.dateFormat('%m-%d %H:%M:%S.%L', date),
            format,
            n,
            blank = '01-01 00:00:00.000',
            strpos = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
            } as Highcharts.Dictionary<number>,
            lastN = 'millisecond'; // for sub-millisecond data, #4223

        for (n in timeUnits) { // eslint-disable-line guard-for-in

            // If the range is exactly one week and we're looking at a
            // Sunday/Monday, go for the week format
            if (
                range === timeUnits.week &&
                +time.dateFormat('%w', date) === startOfWeek &&
                dateStr.substr(6) === blank.substr(6)
            ) {
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
            if (
                strpos[n] &&
                dateStr.substr(strpos[n]) !== blank.substr(strpos[n])
            ) {
                break;
            }

            // Weeks are outside the hierarchy, only apply them on
            // Mondays/Sundays like in the first condition
            if (n !== 'week') {
                lastN = n;
            }
        }

        if (n) {
            format = time.resolveDTLFormat(dateTimeLabelFormats[n]).main as any;
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
    getXDateFormat: function (
        this: Highcharts.Tooltip,
        point: Highcharts.Point,
        options: Highcharts.TooltipOptions,
        xAxis: Highcharts.Axis
    ): string {
        var xDateFormat,
            dateTimeLabelFormats = options.dateTimeLabelFormats,
            closestPointRange = xAxis && xAxis.closestPointRange;

        if (closestPointRange) {
            xDateFormat = this.getDateFormat(
                closestPointRange,
                point.x as any,
                xAxis.options.startOfWeek as any,
                dateTimeLabelFormats as any
            );
        } else {
            xDateFormat = (dateTimeLabelFormats as any).day;
        }

        return xDateFormat || (dateTimeLabelFormats as any).year; // #2546, 2581
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
    tooltipFooterHeaderFormatter: function (
        this: Highcharts.Tooltip,
        labelConfig: Highcharts.PointLabelObject,
        isFooter?: boolean
    ): string {
        var footOrHead = isFooter ? 'footer' : 'header',
            series = labelConfig.series,
            tooltipOptions = series.tooltipOptions,
            xDateFormat = tooltipOptions.xDateFormat,
            xAxis = series.xAxis,
            isDateTime = (
                xAxis &&
                xAxis.options.type === 'datetime' &&
                isNumber(labelConfig.key)
            ),
            formatString = (tooltipOptions as any)[footOrHead + 'Format'],
            evt = {
                isFooter: isFooter,
                labelConfig: labelConfig
            } as Highcharts.Dictionary<any>;

        H.fireEvent(this, 'headerFormatter', evt, function (
            this: Highcharts.Tooltip,
            e: Highcharts.Dictionary<any>
        ): void {

            // Guess the best date format based on the closest point distance
            // (#568, #3418)
            if (isDateTime && !xDateFormat) {
                xDateFormat = this.getXDateFormat(
                    labelConfig as any,
                    tooltipOptions,
                    xAxis
                );
            }

            // Insert the footer date format if any
            if (isDateTime && xDateFormat) {
                ((labelConfig.point && labelConfig.point.tooltipDateKeys) ||
                        ['key']).forEach(
                    function (key: string): void {
                        formatString = formatString.replace(
                            '{point.' + key + '}',
                            '{point.' + key + ':' + xDateFormat + '}'
                        );
                    }
                );
            }

            // Replace default header style with class name
            if (series.chart.styledMode) {
                formatString = this.styledModeFormat(formatString);
            }

            (e as any).text = format(formatString, {
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
    bodyFormatter: function (
        this: Highcharts.Tooltip,
        items: Array<Highcharts.Point>
    ): Array<string> {
        return items.map(function (
            item: (Highcharts.Point|Highcharts.Series)
        ): string {
            var tooltipOptions = (item as any).series.tooltipOptions;

            return (
                (tooltipOptions as any)[
                    ((item as any).point.formatPrefix || 'point') + 'Formatter'
                ] ||
                (item as any).point.tooltipFormatter
            ).call(
                (item as any).point,
                tooltipOptions[
                    ((item as any).point.formatPrefix || 'point') + 'Format'
                ] || ''
            );
        });
    },

    styledModeFormat: function (
        this: Highcharts.Tooltip,
        formatString: string
    ): string {
        return formatString
            .replace(
                'style="font-size: 10px"',
                'class="highcharts-header"'
            )
            .replace(
                /style="color:{(point|series)\.color}"/g,
                'class="highcharts-color-{$1.colorIndex}"'
            );
    }

} as any;
