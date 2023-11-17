/* *
 *
 *  Plugin for displaying a message when there is no data visible in chart.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Oystein Moseng
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

import type { LangOptions } from '../../Core/Options';
import type NoDataOptions from './NoDataOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * @optionparent lang
 */
const lang: Partial<LangOptions> = {
    /**
     * The text to display when the chart contains no data.
     *
     * @see [noData](#noData)
     *
     * @sample highcharts/no-data-to-display/no-data-line
     *         No-data text
     *
     * @since    3.0.8
     * @product  highcharts highstock
     * @requires modules/no-data-to-display
     */
    noData: 'No data to display'
};

/**
 * Options for displaying a message like "No data to display".
 * This feature requires the file no-data-to-display.js to be loaded in the
 * page. The actual text to display is set in the lang.noData option.
 *
 * @sample highcharts/no-data-to-display/no-data-line
 *         Line chart with no-data module
 * @sample highcharts/no-data-to-display/no-data-pie
 *         Pie chart with no-data module
 *
 * @product      highcharts highstock gantt
 * @requires     modules/no-data-to-display
 * @optionparent noData
 */
const noData: NoDataOptions = {

    /**
     * An object of additional SVG attributes for the no-data label.
     *
     * @type      {Highcharts.SVGAttributes}
     * @since     3.0.8
     * @product   highcharts highstock gantt
     * @apioption noData.attr
     */
    attr: {
        zIndex: 1
    },

    /**
     * Whether to insert the label as HTML, or as pseudo-HTML rendered with
     * SVG.
     *
     * @type      {boolean}
     * @default   false
     * @since     4.1.10
     * @product   highcharts highstock gantt
     * @apioption noData.useHTML
     */

    /**
     * The position of the no-data label, relative to the plot area.
     *
     * @type  {Highcharts.AlignObject}
     * @since 3.0.8
     */
    position: {

        /**
         * Horizontal offset of the label, in pixels.
         */
        x: 0,

        /**
         * Vertical offset of the label, in pixels.
         */
        y: 0,

        /**
         * Horizontal alignment of the label.
         *
         * @type {Highcharts.AlignValue}
         */
        align: 'center',

        /**
         * Vertical alignment of the label.
         *
         * @type {Highcharts.VerticalAlignValue}
         */
        verticalAlign: 'middle'
    },

    /**
     * CSS styles for the no-data label.
     *
     * @sample highcharts/no-data-to-display/no-data-line
     *         Styled no-data text
     *
     * @type {Highcharts.CSSObject}
     */
    style: {
        /** @ignore */
        fontWeight: 'bold',
        /** @ignore */
        fontSize: '0.8em',
        /** @ignore */
        color: Palette.neutralColor60
    }

};

/* *
 *
 *  Default Export
 *
 * */

const NoDataDefaults = {
    lang,
    noData
};

export default NoDataDefaults;
