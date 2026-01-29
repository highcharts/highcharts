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

'use strict';

import type PaletteOptions from './PaletteOptions';

/**
 * The palette object specifies colors for the charts and how to apply them.
 *
 * @sample       highcharts/palette/general
 *               General palette options
 * @type         {*}
 * @since        13.0.0
 * @optionparent palette
 */
const palette: PaletteOptions = {
    /**
     * Color scheme to use. When `light dark` is set, the chart will
     * automatically switch between light and dark mode based on the user's
     * system preferences.
     *
     * @type       {'light dark'|'light'|'dark'}
     * @default    light dark
     * @since      13.0.0
     * @apioption  palette.colorScheme
     */
    /**
     * Whether to inject the CSS for the dark and light mode. If not injected,
     * you need to include the CSS manually in your page or application, with
     * the appropriate CSS variables. The default CSS is available in
     * [css/highcharts.css](https://code.highcharts.com/css/highcharts.css).
     *
     * @type       {boolean}
     * @default    true
     * @since      13.0.0
     * @apioption  palette.injectCSS
     */
    /**
     * Palette options for dark mode.
     *
     * @extends palette.light
     */
    dark: {
        backgroundColor: '#141414',
        neutralColor: '#ffffff',
        highlightColor: '#2caffe',
        colors: ['#2caffe', '#00e272', '#efdf00']
    },
    /**
     * Palette options for light mode.
     */
    light: {
        /**
         * Chart background, point stroke for markers and columns etc
         * @type {Highcharts.ColorType}
         */
        backgroundColor: '#ffffff',
        /**
         * Strong text.
         * @type {Highcharts.ColorType}
         */
        neutralColor: '#000000',
        /**
         * Drilldown clickable labels, color axis max color.
         * @type {Highcharts.ColorType}
         */
        highlightColor: '#0022ff',
        /**
         * Indicators
         * @type {Highcharts.ColorType}
         */
        positiveColor: '#06b535',
        /**
         * Indicators
         * @type {Highcharts.ColorType}
         */
        negativeColor: '#f21313',

        /**
         * Colors for data series and points
         * @type {Array<Highcharts.ColorType>}
         */
        colors: [
            '#2caffe',
            '#544fc5',
            '#00e272',
            '#fe6a35',
            '#6b8abc',
            '#d568fb',
            '#2ee0ca',
            '#fa4b42',
            '#feb56a',
            '#91e8e1'
        ]
    }
};
export default palette;
