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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type FlagsShapeValue = ('circlepin'|'flag'|'squarepin');
        interface DataLabelsBoxObject {
            anchorX?: number;
            plotX?: number;
        }
        interface FlagsPointOptions extends ColumnPointOptions {
            fillColor?: (ColorString|GradientColorObject|PatternObject);
            labelrank?: number;
            selected?: boolean;
            shape?: FlagsShapeValue;
            text?: string;
            title?: string;
            x?: number;
        }
        interface FlagsSeriesOptions extends ColumnSeriesOptions {
            allowOverlapX?: boolean;
            fillColor?: (ColorString|GradientColorObject|PatternObject);
            height?: number;
            lineColor?: (ColorString|GradientColorObject|PatternObject);
            lineWidth?: number;
            onKey?: string;
            onSeries?: string;
            shape?: FlagsShapeValue;
            stackDistance?: number;
            states?: SeriesStatesOptionsObject<FlagsSeries>;
            style?: CSSObject;
            textAlign?: AlignValue;
            title?: string;
            useHTML?: boolean;
            width?: number;
            y?: number;
        }
        interface SeriesStatesHoverOptionsObject {
            fillColor?: (ColorString|GradientColorObject|PatternObject);
            lineColor?: (ColorString|GradientColorObject|PatternObject);
            shape?: FlagsShapeValue;
        }
        interface Series {
            allowDG?: boolean;
        }
        interface SymbolDictionary {
            circlepin: SymbolFunction<SVGPathArray>;
            flag: SymbolFunction<SVGPathArray>;
            squarepin: SymbolFunction<SVGPathArray>;
        }
        interface SeriesTypesDictionary {
            flags: typeof FlagsSeries;
        }
        class FlagsPoint extends ColumnPoint {
            public _y?: number;
            public anchorX?: number;
            public fillColor?: (ColorString|GradientColorObject|PatternObject);
            public lineWidth?: number;
            public options: FlagsPointOptions;
            public raised?: boolean;
            public series: FlagsSeries;
            public stackIndex?: number;
            public style?: CSSObject;
            public isValid(): boolean;
        }
        class FlagsSeries extends ColumnSeries {
            public allowDG: boolean;
            public data: Array<FlagsPoint>;
            public getPlotBox: OnSeriesMixin['getPlotBox'];
            public onSeries?: Series;
            public options: FlagsSeriesOptions;
            public pointClass: typeof FlagsPoint;
            public points: Array<FlagsPoint>;
            public takeOrdinalPosition: boolean;
            public translate: OnSeriesMixin['translate'];
            public setClip(): void;
        }
    }
}

/**
 * @typedef {"circlepin"|"flag"|"squarepin"} Highcharts.FlagsShapeValue
 */

import U from './Utilities.js';
const {
    defined,
    isNumber,
    objectEach,
    wrap
} = U;

import './Series.js';
import './SvgRenderer.js';
import onSeriesMixin from '../mixins/on-series.js';

var addEvent = H.addEvent,
    merge = H.merge,
    noop = H.noop,
    Renderer = H.Renderer,
    Series = H.Series,
    seriesType = H.seriesType,
    SVGRenderer = H.SVGRenderer,
    TrackerMixin = H.TrackerMixin,
    VMLRenderer = H.VMLRenderer,
    symbols = SVGRenderer.prototype.symbols;

/**
 * The Flags series.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.flags
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.FlagsSeries>(
    'flags',
    'column'

    /**
     * Flags are used to mark events in stock charts. They can be added on the
     * timeline, or attached to a specific series.
     *
     * @sample stock/demo/flags-general/
     *         Flags on a line series
     *
     * @extends      plotOptions.column
     * @excluding    animation, borderColor, borderRadius, borderWidth,
     *               colorByPoint, dataGrouping, pointPadding, pointWidth,
     *               turboThreshold
     * @product      highstock
     * @optionparent plotOptions.flags
     */
    , {

        /**
         * In case the flag is placed on a series, on what point key to place
         * it. Line and columns have one key, `y`. In range or OHLC-type series,
         * however, the flag can optionally be placed on the `open`, `high`,
         *  `low` or `close` key.
         *
         * @sample {highstock} stock/plotoptions/flags-onkey/
         *         Range series, flag on high
         *
         * @type       {string}
         * @default    y
         * @since      4.2.2
         * @product    highstock
         * @validvalue ["y", "open", "high", "low", "close"]
         * @apioption  plotOptions.flags.onKey
         */

        /**
         * The id of the series that the flags should be drawn on. If no id
         * is given, the flags are drawn on the x axis.
         *
         * @sample {highstock} stock/plotoptions/flags/
         *         Flags on series and on x axis
         *
         * @type      {string}
         * @product   highstock
         * @apioption plotOptions.flags.onSeries
         */

        pointRange: 0, // #673

        /**
         * Whether the flags are allowed to overlap sideways. If `false`, the
         * flags are moved sideways using an algorithm that seeks to place every
         * flag as close as possible to its original position.
         *
         * @sample {highstock} stock/plotoptions/flags-allowoverlapx
         *         Allow sideways overlap
         *
         * @since 6.0.4
         */
        allowOverlapX: false,

        /**
         * The shape of the marker. Can be one of "flag", "circlepin",
         * "squarepin", or an image of the format `url(/path-to-image.jpg)`.
         * Individual shapes can also be set for each point.
         *
         * @sample {highstock} stock/plotoptions/flags/
         *         Different shapes
         *
         * @type    {Highcharts.FlagsShapeValue}
         * @product highstock
         */
        shape: 'flag',

        /**
         * When multiple flags in the same series fall on the same value, this
         * number determines the vertical offset between them.
         *
         * @sample {highstock} stock/plotoptions/flags-stackdistance/
         *         A greater stack distance
         *
         * @product highstock
         */
        stackDistance: 12,

        /**
         * Text alignment for the text inside the flag.
         *
         * @since      5.0.0
         * @product    highstock
         * @validvalue ["left", "center", "right"]
         */
        textAlign: 'center',

        /**
         * Specific tooltip options for flag series. Flag series tooltips are
         * different from most other types in that a flag doesn't have a data
         * value, so the tooltip rather displays the `text` option for each
         * point.
         *
         * @extends   plotOptions.series.tooltip
         * @excluding changeDecimals, valueDecimals, valuePrefix, valueSuffix
         * @product   highstock
         */
        tooltip: {
            pointFormat: '{point.text}<br/>'
        },

        threshold: null as any,

        /**
         * The text to display on each flag. This can be defined on series
         * level, or individually for each point. Defaults to `"A"`.
         *
         * @type      {string}
         * @default   A
         * @product   highstock
         * @apioption plotOptions.flags.title
         */

        /**
         * The y position of the top left corner of the flag relative to either
         * the series (if onSeries is defined), or the x axis. Defaults to
         * `-30`.
         *
         * @product highstock
         */
        y: -30,

        /**
         * Whether to use HTML to render the flag texts. Using HTML allows for
         * advanced formatting, images and reliable bi-directional text
         * rendering. Note that exported images won't respect the HTML, and that
         * HTML won't respect Z-index settings.
         *
         * @type      {boolean}
         * @default   false
         * @since     1.3
         * @product   highstock
         * @apioption plotOptions.flags.useHTML
         */

        /**
         * Fixed width of the flag's shape. By default, width is autocalculated
         * according to the flag's title.
         *
         * @sample {highstock} stock/demo/flags-shapes/
         *         Flags with fixed width
         *
         * @type      {number}
         * @product   highstock
         * @apioption plotOptions.flags.width
         */

        /**
         * Fixed height of the flag's shape. By default, height is
         * autocalculated according to the flag's title.
         *
         * @type      {number}
         * @product   highstock
         * @apioption plotOptions.flags.height
         */

        /**
         * The fill color for the flags.
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product highstock
         */
        fillColor: '${palette.backgroundColor}',

        /**
         * The color of the line/border of the flag.
         *
         * In styled mode, the stroke is set in the
         * `.highcharts-flag-series.highcharts-point` rule.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   #000000
         * @product   highstock
         * @apioption plotOptions.flags.lineColor
         */

        /**
         * The pixel width of the flag's line/border.
         *
         * @product highstock
         */
        lineWidth: 1,

        states: {

            /**
             * @extends plotOptions.column.states.hover
             * @product highstock
             */
            hover: {

                /**
                 * The color of the line/border of the flag.
                 *
                 * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product highstock
                 */
                lineColor: '${palette.neutralColor100}',

                /**
                 * The fill or background color of the flag.
                 *
                 * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product highstock
                 */
                fillColor: '${palette.highlightColor20}'
            }
        },

        /**
         * The text styles of the flag.
         *
         * In styled mode, the styles are set in the
         * `.highcharts-flag-series .highcharts-point` rule.
         *
         * @type    {Highcharts.CSSObject}
         * @default {"fontSize": "11px", "fontWeight": "bold"}
         * @product highstock
         */
        style: {
            /** @ignore-option */
            fontSize: '11px',
            /** @ignore-option */
            fontWeight: 'bold'
        }

    },
    /**
     * @lends seriesTypes.flags.prototype
     */
    {
        sorted: false,
        noSharedTooltip: true,
        allowDG: false,
        takeOrdinalPosition: false, // #1074
        trackerGroups: ['markerGroup'],
        forceCrop: true,

        /* eslint-disable no-invalid-this, valid-jsdoc */

        /**
         * Inherit the initialization from base Series.
         *
         * @private
         * @borrows Highcharts.Series#init as Highcharts.seriesTypes.flags#init
         */
        init: Series.prototype.init,

        /**
         * Get presentational attributes
         *
         * @private
         * @function Highcharts.seriesTypes.flags#pointAttribs
         *
         * @param {Highcharts.Point} point
         *
         * @param {string} [state]
         *
         * @return {Highcharts.SVGAttributes}
         */
        pointAttribs: function (
            this: Highcharts.FlagsSeries,
            point: Highcharts.FlagsPoint,
            state?: string
        ): Highcharts.SVGAttributes {
            var options = this.options,
                color = (point && point.color) || this.color,
                lineColor = options.lineColor,
                lineWidth = (point && point.lineWidth),
                fill = (point && point.fillColor) || options.fillColor;

            if (state) {
                fill = (options.states as any)[state].fillColor;
                lineColor = (options.states as any)[state].lineColor;
                lineWidth = (options.states as any)[state].lineWidth;
            }

            return {
                fill: fill || color,
                stroke: lineColor || color,
                'stroke-width': lineWidth || options.lineWidth || 0
            };
        },

        translate: onSeriesMixin.translate,
        getPlotBox: onSeriesMixin.getPlotBox,

        /**
         * Draw the markers.
         *
         * @private
         * @function Highcharts.seriesTypes.flags#drawPoints
         * @return {void}
         */
        drawPoints: function (this: Highcharts.FlagsSeries): void {
            var series = this,
                points = series.points,
                chart = series.chart,
                renderer = chart.renderer,
                plotX: (number|undefined),
                plotY: (number|undefined),
                inverted = chart.inverted,
                options = series.options,
                optionsY = options.y,
                shape,
                i,
                point,
                graphic,
                stackIndex,
                anchorY,
                attribs: Highcharts.SVGAttributes,
                outsideRight,
                yAxis = series.yAxis,
                boxesMap =
                    {} as Highcharts.Dictionary<Highcharts.DataLabelsBoxObject>,
                boxes = [] as Highcharts.DataLabelsBoxArray,
                centered;

            i = points.length;
            while (i--) {
                point = points[i];
                outsideRight =
                    (inverted ? point.plotY : point.plotX) as any >
                    series.xAxis.len;
                plotX = point.plotX;
                stackIndex = point.stackIndex;
                shape = point.options.shape || options.shape;
                plotY = point.plotY;

                if (typeof plotY !== 'undefined') {
                    plotY = (point.plotY as any) + (optionsY as any) -
                    (
                        typeof stackIndex !== 'undefined' &&
                        (stackIndex * (options.stackDistance as any)) as any
                    );
                }
                // skip connectors for higher level stacked points
                point.anchorX = stackIndex ? void 0 : point.plotX;
                anchorY = stackIndex ? void 0 : point.plotY;
                centered = shape !== 'flag';

                graphic = point.graphic;

                // Only draw the point if y is defined and the flag is within
                // the visible area
                if (
                    typeof plotY !== 'undefined' &&
                    (plotX as any) >= 0 &&
                    !outsideRight
                ) {

                    // Create the flag
                    if (!graphic) {
                        graphic = point.graphic = renderer.label(
                            '',
                            null as any,
                            null as any,
                            shape as any,
                            null as any,
                            null as any,
                            options.useHTML
                        );

                        if (!chart.styledMode) {
                            graphic
                                .attr(series.pointAttribs(point))
                                .css(merge(options.style as any, point.style));
                        }

                        graphic.attr({
                            align: centered ? 'center' : 'left',
                            width: options.width,
                            height: options.height,
                            'text-align': options.textAlign
                        })
                            .addClass('highcharts-point')
                            .add(series.markerGroup);

                        // Add reference to the point for tracker (#6303)
                        if (point.graphic.div) {
                            point.graphic.div.point = point;
                        }

                        if (!chart.styledMode) {
                            graphic.shadow(options.shadow);
                        }

                        graphic.isNew = true;
                    }

                    if ((plotX as any) > 0) { // #3119
                        (plotX as any) -= graphic.strokeWidth() % 2; // #4285
                    }

                    // Plant the flag
                    attribs = {
                        y: plotY,
                        anchorY: anchorY
                    };
                    if (options.allowOverlapX) {
                        attribs.x = plotX;
                        attribs.anchorX = point.anchorX;
                    }
                    graphic.attr({
                        text: point.options.title || options.title || 'A'
                    })[graphic.isNew ? 'attr' : 'animate'](attribs);

                    // Rig for the distribute function
                    if (!options.allowOverlapX) {
                        if (!boxesMap[point.plotX as any]) {
                            boxesMap[point.plotX as any] = {
                                align: centered ? 0.5 : 0,
                                size: graphic.width,
                                target: plotX as any,
                                anchorX: plotX as any
                            };
                        } else {
                            boxesMap[point.plotX as any].size = Math.max(
                                boxesMap[point.plotX as any].size,
                                graphic.width
                            );
                        }
                    }

                    // Set the tooltip anchor position
                    point.tooltipPos = [
                        plotX as any,
                        plotY + (yAxis.pos as any) - chart.plotTop
                    ]; // #6327

                } else if (graphic) {
                    point.graphic = graphic.destroy();
                }

            }

            // Handle X-dimension overlapping
            if (!options.allowOverlapX) {
                objectEach(boxesMap, function (
                    box: Highcharts.DataLabelsBoxObject
                ): void {
                    box.plotX = box.anchorX;
                    boxes.push(box);
                });

                H.distribute(boxes, inverted ? yAxis.len : this.xAxis.len, 100);

                points.forEach(function (point: Highcharts.FlagsPoint): void {
                    var box = point.graphic && boxesMap[point.plotX as any];

                    if (box) {
                        (point.graphic as any)[
                            (point.graphic as any).isNew ? 'attr' : 'animate'
                        ]({
                            x: (box.pos as any) + (box.align as any) * box.size,
                            anchorX: point.anchorX
                        });
                        // Hide flag when its box position is not specified
                        // (#8573, #9299)
                        if (!defined(box.pos)) {
                            (point.graphic as any).attr({
                                x: -9999,
                                anchorX: -9999
                            });
                            (point.graphic as any).isNew = true;
                        } else {
                            (point.graphic as any).isNew = false;
                        }
                    }
                });
            }

            // Can be a mix of SVG and HTML and we need events for both (#6303)
            if (options.useHTML) {
                wrap(series.markerGroup, 'on', function (
                    this: Highcharts.FlagsSeries,
                    proceed
                ): Highcharts.SVGElement {
                    return H.SVGElement.prototype.on.apply(
                        // for HTML
                        proceed.apply(this, [].slice.call(arguments, 1)),
                        // and for SVG
                        [].slice.call(arguments, 1) as any
                    );
                });
            }

        },

        /**
         * Extend the column trackers with listeners to expand and contract
         * stacks.
         *
         * @private
         * @function Highcharts.seriesTypes.flags#drawTracker
         * @return {void}
         */
        drawTracker: function (this: Highcharts.FlagsSeries): void {
            var series = this,
                points = series.points;

            TrackerMixin.drawTrackerPoint.apply(this);

            /* *
            * Bring each stacked flag up on mouse over, this allows readability
            * of vertically stacked elements as well as tight points on the x
            * axis. #1924.
            */
            points.forEach(function (point: Highcharts.FlagsPoint): void {
                var graphic = point.graphic;

                if (graphic) {
                    addEvent(graphic.element, 'mouseover', function (): void {

                        // Raise this point
                        if ((point.stackIndex as any) > 0 &&
                            !point.raised
                        ) {
                            point._y = (graphic as any).y;
                            (graphic as any).attr({
                                y: (point._y as any) - 8
                            });
                            point.raised = true;
                        }

                        // Revert other raised points
                        points.forEach(function (
                            otherPoint: Highcharts.FlagsPoint
                        ): void {
                            if (
                                otherPoint !== point &&
                            otherPoint.raised &&
                            otherPoint.graphic
                            ) {
                                otherPoint.graphic.attr({
                                    y: otherPoint._y
                                });
                                otherPoint.raised = false;
                            }
                        });
                    });
                }
            });
        },

        /**
         * Disable animation, but keep clipping (#8546).
         *
         * @private
         * @function Highcharts.seriesTypes.flags#animate
         * @param {boolean} [init]
         * @return {void}
         */
        animate: function (this: Highcharts.FlagsSeries, init?: boolean): void {
            if (init) {
                this.setClip();
            } else {
                this.animate = null as any;
            }
        },

        /**
         * @private
         * @function Highcharts.seriesTypes.flags#setClip
         * @return {void}
         */
        setClip: function (this: Highcharts.FlagsSeries): void {
            Series.prototype.setClip.apply(this, arguments as any);
            if (this.options.clip !== false && this.sharedClipKey) {
                (this.markerGroup as any)
                    .clip((this.chart as any)[this.sharedClipKey]);
            }
        },

        /**
         * @private
         * @function Highcharts.seriesTypes.flags#buildKDTree
         */
        buildKDTree: noop as any,

        /**
         * Don't invert the flag marker group (#4960).
         *
         * @private
         * @function Highcharts.seriesTypes.flags#invertGroups
         */
        invertGroups: noop as any

        /* eslint-enable no-invalid-this, valid-jsdoc */

    },
    /**
     * @lends Highcharts.seriesTypes.flag.prototype.pointClass.prototype
     */
    {
        isValid: function (this: Highcharts.FlagsPoint): boolean {
            // #9233 - Prevent from treating flags as null points (even if
            // they have no y values defined).
            return isNumber(this.y) || typeof this.y === 'undefined';
        }
    }

);

// create the flag icon with anchor
symbols.flag = function (
    x: number,
    y: number,
    w: number,
    h: number,
    options: Highcharts.Dictionary<number>
): Highcharts.SVGPathArray {
    var anchorX = (options && options.anchorX) || x,
        anchorY = (options && options.anchorY) || y;

    return symbols.circle(anchorX - 1, anchorY - 1, 2, 2).concat(
        [
            'M', anchorX, anchorY,
            'L', x, y + h,
            x, y,
            x + w, y,
            x + w, y + h,
            x, y + h,
            'Z'
        ]
    );
};

/**
 * Create the circlepin and squarepin icons with anchor.
 * @private
 * @param {string} shape - circle or square
 * @return {void}
 */
function createPinSymbol(shape: string): void {
    symbols[shape + 'pin'] = function (
        x: number,
        y: number,
        w: number,
        h: number,
        options: Highcharts.Dictionary<number>
    ): Highcharts.SVGPathArray {

        var anchorX = options && options.anchorX,
            anchorY = options && options.anchorY,
            path: Highcharts.SVGPathArray,
            labelTopOrBottomY;

        // For single-letter flags, make sure circular flags are not taller
        // than their width
        if (shape === 'circle' && h > w) {
            x -= Math.round((h - w) / 2);
            w = h;
        }

        path = (symbols[shape] as any)(x, y, w, h);

        if (anchorX && anchorY) {
            /**
             * If the label is below the anchor, draw the connecting line
             * from the top edge of the label
             * otherwise start drawing from the bottom edge
             */
            labelTopOrBottomY = (y > anchorY) ? y : y + h;
            path.push(
                'M',
                shape === 'circle' ?
                    x + w / 2 :
                    (path[1] as any) + (path[4] as any) / 2,
                labelTopOrBottomY,
                'L',
                anchorX,
                anchorY
            );
            path = path.concat(
                symbols.circle(anchorX - 1, anchorY - 1, 2, 2) as any
            );
        }

        return path;
    };
}
createPinSymbol('circle');
createPinSymbol('square');

/**
 * The symbol callbacks are generated on the SVGRenderer object in all browsers.
 * Even VML browsers need this in order to generate shapes in export. Now share
 * them with the VMLRenderer.
 */
if ((Renderer as unknown) === VMLRenderer) {
    ['circlepin', 'flag', 'squarepin'].forEach(function (shape: string): void {
        VMLRenderer.prototype.symbols[shape] = symbols[shape];
    });
}

/**
 * A `flags` series. If the [type](#series.flags.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.flags
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.flags
 */

/**
 * An array of data points for the series. For the `flags` series type,
 * points can be given in the following ways:
 *
 * 1. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.flags.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        title: "A",
 *        text: "First event"
 *    }, {
 *        x: 1,
 *        title: "B",
 *        text: "Second event"
 *    }]
 *    ```
 *
 * @type      {Array<*>}
 * @extends   series.line.data
 * @excluding dataLabels, marker, name, y
 * @product   highstock
 * @apioption series.flags.data
 */

/**
 * The fill color of an individual flag. By default it inherits from
 * the series color.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highstock
 * @apioption series.flags.data.fillColor
 */

/**
 * The longer text to be shown in the flag's tooltip.
 *
 * @type      {string}
 * @product   highstock
 * @apioption series.flags.data.text
 */

/**
 * The short text to be shown on the flag.
 *
 * @type      {string}
 * @product   highstock
 * @apioption series.flags.data.title
 */

''; // adds doclets above to transpiled file
