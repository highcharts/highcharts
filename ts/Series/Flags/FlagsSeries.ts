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

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type { FlagsShapeValue } from './FlagsPointOptions';
import type FlagsSeriesOptions from './FlagsSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import FlagsPoint from './FlagsPoint.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import OnSeriesMixin from '../../Mixins/OnSeries.js';
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    extend,
    merge,
    objectEach,
    wrap
} = U;

import './FlagsSymbols.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        allowDG?: boolean;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {
        fillColor?: ColorType;
        lineColor?: ColorType;
        shape?: FlagsShapeValue;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DataLabelsBoxObject {
            anchorX?: number;
            plotX?: number;
        }
    }
}

/**
 * The Flags series.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.flags
 *
 * @augments Highcharts.Series
 */
class FlagsSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

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
    public static defaultOptions: FlagsSeriesOptions = merge(ColumnSeries.defaultOptions, {

        /**
         * In case the flag is placed on a series, on what point key to place
         * it. Line and columns have one key, `y`. In range or OHLC-type series,
         * however, the flag can optionally be placed on the `open`, `high`,
         * `low` or `close` key.
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
            pointFormat: '{point.text}'
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
        fillColor: palette.backgroundColor,

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
                lineColor: palette.neutralColor100,

                /**
                 * The fill or background color of the flag.
                 *
                 * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product highstock
                 */
                fillColor: palette.highlightColor20
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

    } as FlagsSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<FlagsPoint> = void 0 as any;

    public onSeries?: typeof Series.prototype;

    public options: FlagsSeriesOptions = void 0 as any;

    public points: Array<FlagsPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Disable animation, but keep clipping (#8546).
     * @private
     */
    public animate(init?: boolean): void {
        if (init) {
            this.setClip();
        }
    }

    /**
     * Draw the markers.
     * @private
     */
    public drawPoints(): void {
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
            attribs: SVGAttributes,
            outsideRight,
            yAxis = series.yAxis,
            boxesMap: Record<string, Highcharts.DataLabelsBoxObject> = {},
            boxes: Highcharts.DataLabelsBoxArray = [],
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
                    )
                        .addClass('highcharts-point')
                        .add(series.markerGroup);

                    // Add reference to the point for tracker (#6303)
                    if (point.graphic.div) {
                        point.graphic.div.point = point;
                    }

                    graphic.isNew = true;
                }

                graphic.attr({
                    align: centered ? 'center' : 'left',
                    width: options.width,
                    height: options.height,
                    'text-align': options.textAlign
                });

                if (!chart.styledMode) {
                    graphic
                        .attr(series.pointAttribs(point))
                        .css(merge(options.style as any, point.style))
                        .shadow(options.shadow);
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

            points.forEach(function (point): void {
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
                this: FlagsSeries,
                proceed
            ): SVGElement {
                return SVGElement.prototype.on.apply(
                    // for HTML
                    // eslint-disable-next-line no-invalid-this
                    proceed.apply(this, [].slice.call(arguments, 1)),
                    // and for SVG
                    [].slice.call(arguments, 1) as any
                );
            });
        }

    }

    /**
     * Extend the column trackers with listeners to expand and contract
     * stacks.
     * @private
     */
    public drawTracker(): void {
        var series = this,
            points = series.points;

        super.drawTracker();

        /* *
        * Bring each stacked flag up on mouse over, this allows readability
        * of vertically stacked elements as well as tight points on the x
        * axis. #1924.
        */
        points.forEach(function (point): void {
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
                    points.forEach(function (otherPoint): void {
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
    }

    /**
     * Get presentational attributes
     * @private
     */
    public pointAttribs(
        point: FlagsPoint,
        state?: string
    ): SVGAttributes {
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
    }

    /**
     * @private
     */
    public setClip(): void {
        Series.prototype.setClip.apply(this, arguments as any);
        if (this.options.clip !== false && this.sharedClipKey) {
            (this.markerGroup as any)
                .clip((this.chart as any)[this.sharedClipKey]);
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface FlagsSeries {
    allowDG: boolean;
    getPlotBox: typeof OnSeriesMixin['getPlotBox'];
    init: typeof Series.prototype['init'];
    pointClass: typeof FlagsPoint;
    takeOrdinalPosition: boolean;
    translate: typeof OnSeriesMixin['translate'];
}
extend(FlagsSeries.prototype, {

    allowDG: false,

    /**
     * @private
     * @function Highcharts.seriesTypes.flags#buildKDTree
     */
    buildKDTree: noop as any,

    forceCrop: true,

    getPlotBox: OnSeriesMixin.getPlotBox,

    /**
     * Inherit the initialization from base Series.
     *
     * @private
     * @borrows Highcharts.Series#init as Highcharts.seriesTypes.flags#init
     */
    init: Series.prototype.init,

    /**
     * Don't invert the flag marker group (#4960).
     *
     * @private
     * @function Highcharts.seriesTypes.flags#invertGroups
     */
    invertGroups: noop as any,

    // Flags series group should not be invertible (#14063).
    invertible: false,

    noSharedTooltip: true,

    pointClass: FlagsPoint,

    sorted: false,

    takeOrdinalPosition: false, // #1074

    trackerGroups: ['markerGroup'],

    translate: OnSeriesMixin.translate

});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypesDictionary {
        flags: typeof FlagsSeries;
    }
}
SeriesRegistry.registerSeriesType('flags', FlagsSeries);

/* *
 *
 *  Default Export
 *
 * */

export default FlagsSeries;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @typedef {"circlepin"|"flag"|"squarepin"} Highcharts.FlagsShapeValue
 */

''; // detach doclets above

/* *
 *
 *  API Option
 *
 * */

/**
 * A `flags` series. If the [type](#series.flags.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.flags
 * @excluding animation, borderColor, borderRadius, borderWidth, colorByPoint,
 *            connectNulls, dashStyle, dataGrouping, dataParser, dataURL,
 *            gapSize, gapUnit, linecap, lineWidth, marker, pointPadding,
 *            pointWidth, step, turboThreshold, useOhlcData
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
