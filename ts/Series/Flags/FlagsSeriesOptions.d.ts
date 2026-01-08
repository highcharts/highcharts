/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { AlignValue } from '../../Core/Renderer/AlignObject';
import type ColorType from '../../Core/Color/ColorType';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type FlagsPointOptions from './FlagsPointOptions';
import type { FlagsShapeValue } from './FlagsPointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Flags are used to mark events in stock charts. They can be added on the
 * timeline, or attached to a specific series.
 *
 * A `flags` series. If the [type](#series.flags.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample stock/demo/flags-general/
 *         Flags on a line series
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.flags
 *
 * @excluding animation, borderColor, borderWidth,
 *            colorByPoint, cropThreshold, dataGrouping, pointPadding,
 *            pointWidth, turboThreshold
 *
 * @excluding animation, borderColor, borderRadius, borderWidth, colorByPoint,
 *            connectNulls, cropThreshold, dashStyle, dataGrouping, dataParser,
 *            dataURL, gapSize, gapUnit, linecap, lineWidth, marker,
 *            pointPadding, pointWidth, step, turboThreshold, useOhlcData
 *
 * @product highstock
 */
export interface FlagsSeriesOptions extends ColumnSeriesOptions {

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
    allowOverlapX?: boolean;

    /**
     * The corner radius of the border surrounding each flag. For `squarepin`
     * shaped flags only. A number signifies pixels. A percentage string, like
     * for example 50%, signifies a relative size.
     */
    borderRadius?: number;

    /**
     * The fill color for the flags.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highstock
     */
    fillColor?: ColorType;

    /**
     * Fixed height of the flag's shape. By default, height is
     * autocalculated according to the flag's title.
     *
     * @type {number}
     *
     * @product highstock
     */
    height?: number;

    /**
     * The color of the line/border of the flag.
     *
     * In styled mode, the stroke is set in the
     * `.highcharts-flag-series.highcharts-point` rule.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @default #000000
     *
     * @product highstock
     */
    lineColor?: ColorType;

    /**
     * The pixel width of the flag's line/border.
     *
     * @product highstock
     */
    lineWidth?: number;

    /**
     * In case the flag is placed on a series, on what point key to place
     * it. Line and columns have one key, `y`. In range or OHLC-type series,
     * however, the flag can optionally be placed on the `open`, `high`,
     * `low` or `close` key.
     *
     * @sample {highstock} stock/plotoptions/flags-onkey/
     *         Range series, flag on high
     *
     * @type {string}
     *
     * @default y
     *
     * @since 4.2.2
     *
     * @product highstock
     *
     * @validvalue ["y", "open", "high", "low", "close"]
     */
    onKey?: string;

    /**
     * The id of the series that the flags should be drawn on. If no id
     * is given, the flags are drawn on the x axis.
     *
     * @sample {highstock} stock/plotoptions/flags/
     *         Flags on series and on x axis
     *
     * @type {string}
     *
     * @product highstock
     */
    onSeries?: string;

    /**
     * The shape of the marker. Can be one of "flag", "circlepin",
     * "squarepin", or an image of the format `url(/path-to-image.jpg)`.
     * Individual shapes can also be set for each point.
     *
     * @sample {highstock} stock/plotoptions/flags/
     *         Different shapes
     *
     * @type {Highcharts.FlagsShapeValue}
     *
     * @product highstock
     */
    shape?: FlagsShapeValue;

    /**
     * When multiple flags in the same series fall on the same value, this
     * number determines the vertical offset between them.
     *
     * @sample {highstock} stock/plotoptions/flags-stackdistance/
     *         A greater stack distance
     *
     * @product highstock
     */
    stackDistance?: number;

    states?: SeriesStatesOptions<FlagsSeriesOptions>;

    /**
     * The text styles of the flag.
     *
     * In styled mode, the styles are set in the
     * `.highcharts-flag-series .highcharts-point` rule.
     *
     * @type {Highcharts.CSSObject}
     *
     * @default {"fontSize": "11px", "fontWeight": "bold"}
     *
     * @product highstock
     */
    style?: CSSObject;

    /**
     * Text alignment for the text inside the flag.
     *
     * @since 5.0.0
     *
     * @product highstock
     *
     * @validvalue ["left", "center", "right"]
     */
    textAlign?: AlignValue;

    /**
     * The text to display on each flag. This can be defined on series
     * level, or individually for each point. Defaults to `"A"`.
     *
     * @type {string}
     *
     * @default A
     *
     * @product highstock
     */
    title?: string;

    /**
     * Whether to use HTML to render the flag texts. Using HTML allows for
     * advanced formatting, images and reliable bi-directional text
     * rendering. Note that exported images won't respect the HTML, and that
     * HTML won't respect Z-index settings.
     *
     * @type {boolean}
     *
     * @default false
     *
     * @since 1.3
     *
     * @product highstock
     */
    useHTML?: boolean;

    /**
     * Fixed width of the flag's shape. By default, width is autocalculated
     * according to the flag's title.
     *
     * @sample {highstock} stock/demo/flags-shapes/
     *         Flags with fixed width
     *
     * @type {number}
     *
     * @product highstock
     */
    width?: number;

    /**
     * The y position of the top left corner of the flag relative to either
     * the series (if onSeries is defined), or the x axis. Defaults to
     * `-30`.
     *
     * @product highstock
     */
    y?: number;

    /**
     * An array of data points for the series. For the `flags` series type,
     * points can be given in the following ways:
     *
     * 1. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
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
     * @type {Array<*>}
     *
     * @extends series.line.data
     *
     * @excluding dataLabels, marker, name, y
     *
     * @product highstock
     *
     * @apioption series.flags.data
     */
    data?: Array<FlagsPointOptions>;

    /**
     *
     * @type {number|null}
     */
    threshold?: number|null;

    /**
     * Specific tooltip options for flag series. Flag series tooltips are
     * different from most other types in that a flag doesn't have a data
     * value, so the tooltip rather displays the `text` option for each
     * point.
     *
     * @extends plotOptions.series.tooltip
     *
     * @excluding changeDecimals, valueDecimals, valuePrefix, valueSuffix
     *
     * @product highstock
     */
    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default FlagsSeriesOptions;
