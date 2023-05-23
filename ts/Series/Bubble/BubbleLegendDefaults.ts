/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Paweł Potaczek
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

import type BubbleLegendItem from './BubbleLegendItem';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * The bubble legend is an additional element in legend which
 * presents the scale of the bubble series. Individual bubble ranges
 * can be defined by user or calculated from series. In the case of
 * automatically calculated ranges, a 1px margin of error is
 * permitted.
 *
 * @since        7.0.0
 * @product      highcharts highstock highmaps
 * @requires     highcharts-more
 * @optionparent legend.bubbleLegend
 */
const BubbleLegendDefaults: BubbleLegendItem.Options = {
    /**
     * The color of the ranges borders, can be also defined for an
     * individual range.
     *
     * @sample highcharts/bubble-legend/similartoseries/
     *         Similar look to the bubble series
     * @sample highcharts/bubble-legend/bordercolor/
     *         Individual bubble border color
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    borderColor: void 0,
    /**
     * The width of the ranges borders in pixels, can be also
     * defined for an individual range.
     */
    borderWidth: 2,
    /**
     * An additional class name to apply to the bubble legend'
     * circle graphical elements. This option does not replace
     * default class names of the graphical element.
     *
     * @sample {highcharts} highcharts/css/bubble-legend/
     *         Styling by CSS
     *
     * @type {string}
     */
    className: void 0,
    /**
     * The main color of the bubble legend. Applies to ranges, if
     * individual color is not defined.
     *
     * @sample highcharts/bubble-legend/similartoseries/
     *         Similar look to the bubble series
     * @sample highcharts/bubble-legend/color/
     *         Individual bubble color
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    color: void 0,
    /**
     * An additional class name to apply to the bubble legend's
     * connector graphical elements. This option does not replace
     * default class names of the graphical element.
     *
     * @sample {highcharts} highcharts/css/bubble-legend/
     *         Styling by CSS
     *
     * @type {string}
     */
    connectorClassName: void 0,
    /**
     * The color of the connector, can be also defined
     * for an individual range.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    connectorColor: void 0,
    /**
     * The length of the connectors in pixels. If labels are
     * centered, the distance is reduced to 0.
     *
     * @sample highcharts/bubble-legend/connectorandlabels/
     *         Increased connector length
     */
    connectorDistance: 60,
    /**
     * The width of the connectors in pixels.
     *
     * @sample highcharts/bubble-legend/connectorandlabels/
     *         Increased connector width
     */
    connectorWidth: 1,
    /**
     * Enable or disable the bubble legend.
     */
    enabled: false,
    /**
     * Options for the bubble legend labels.
     */
    labels: {
        /**
         * An additional class name to apply to the bubble legend
         * label graphical elements. This option does not replace
         * default class names of the graphical element.
         *
         * @sample {highcharts} highcharts/css/bubble-legend/
         *         Styling by CSS
         *
         * @type {string}
         */
        className: void 0,
        /**
         * Whether to allow data labels to overlap.
         */
        allowOverlap: false,
        /**
         * A format string for the bubble legend labels. Available
         * variables are the same as for `formatter`.
         *
         * @sample highcharts/bubble-legend/format/
         *         Add a unit
         *
         * @type {string}
         */
        format: '',
        /**
         * Available `this` properties are:
         *
         * - `this.value`: The bubble value.
         *
         * - `this.radius`: The radius of the bubble range.
         *
         * - `this.center`: The center y position of the range.
         *
         * @type {Highcharts.FormatterCallbackFunction<Highcharts.BubbleLegendFormatterContextObject>}
         */
        formatter: void 0,
        /**
         * The alignment of the labels compared to the bubble
         * legend. Can be one of `left`, `center` or `right`.
         *
         * @sample highcharts/bubble-legend/connectorandlabels/
         *         Labels on left
         *
         * @type {Highcharts.AlignValue}
         */
        align: 'right',
        /**
         * CSS styles for the labels.
         *
         * @type {Highcharts.CSSObject}
         */
        style: {
            /** @ignore-option */
            fontSize: '0.9em',
            /** @ignore-option */
            color: Palette.neutralColor100
        },
        /**
         * The x position offset of the label relative to the
         * connector.
         */
        x: 0,
        /**
         * The y position offset of the label relative to the
         * connector.
         */
        y: 0
    },
    /**
     * Miximum bubble legend range size. If values for ranges are
     * not specified, the `minSize` and the `maxSize` are calculated
     * from bubble series.
     */
    maxSize: 60, // Number
    /**
     * Minimum bubble legend range size. If values for ranges are
     * not specified, the `minSize` and the `maxSize` are calculated
     * from bubble series.
     */
    minSize: 10, // Number
    /**
     * The position of the bubble legend in the legend.
     * @sample highcharts/bubble-legend/connectorandlabels/
     *         Bubble legend as last item in legend
     */
    legendIndex: 0, // Number
    /**
     * Options for specific range. One range consists of bubble,
     * label and connector.
     *
     * @sample highcharts/bubble-legend/ranges/
     *         Manually defined ranges
     * @sample highcharts/bubble-legend/autoranges/
     *         Auto calculated ranges
     *
     * @type {Array<*>}
     */
    ranges: {
        /**
         * Range size value, similar to bubble Z data.
         * @type {number}
         */
        value: void 0,
        /**
         * The color of the border for individual range.
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        borderColor: void 0,
        /**
         * The color of the bubble for individual range.
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        color: void 0,
        /**
         * The color of the connector for individual range.
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        connectorColor: void 0
    } as any,
    /**
     * Whether the bubble legend range value should be represented
     * by the area or the width of the bubble. The default, area,
     * corresponds best to the human perception of the size of each
     * bubble.
     *
     * @sample highcharts/bubble-legend/ranges/
     *         Size by width
     *
     * @type {Highcharts.BubbleSizeByValue}
     */
    sizeBy: 'area',
    /**
     * When this is true, the absolute value of z determines the
     * size of the bubble. This means that with the default
     * zThreshold of 0, a bubble of value -1 will have the same size
     * as a bubble of value 1, while a bubble of value 0 will have a
     * smaller size according to minSize.
     */
    sizeByAbsoluteValue: false,
    /**
     * Define the visual z index of the bubble legend.
     */
    zIndex: 1,
    /**
     * Ranges with with lower value than zThreshold, are skipped.
     */
    zThreshold: 0
};

/* *
 *
 *  Default Export
 *
 * */

export default BubbleLegendDefaults;
