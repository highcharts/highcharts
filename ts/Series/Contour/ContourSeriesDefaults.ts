/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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

import type ContourSeriesOptions from './ContourSeriesOptions';


/* *
 *
 *  Definitions
 *
 * */

/**
 * A contour plot is a graphical representation of three-dimensional data
 * in two dimensions using contour lines or color-coded regions.
 *
 * @productdesc {highcharts}
 * Requires `modules/contour`.
 *
 * @sample highcharts/demo/contour/
 *         Simple contour
 *
 * @extends      plotOptions.scatter
 * @excluding    animationLimit, cluster, connectEnds, connectNulls,
 *               cropThreshold, dashStyle, dragDrop, findNearestPointBy,
 *               getExtremesFromAll, jitter, legendSymbolColor, linecap,
 *               lineWidth, pointInterval, pointIntervalUnit, pointRange,
 *               pointStart, shadow, softThreshold, stacking, step, threshold,
 *               boostBlending, boostThreshold, crisp, clip, colorIndex,
 *               inactiveOtherPoints, negativeColor, color, turboThreshold,
 *
 *
 * @product      highcharts highmaps
 * @optionparent plotOptions.contour
 */

const ContourSeriesDefaults: ContourSeriesOptions = {

    /**
     * The offset of the contour lines.
     */
    contourOffset: 0,

    /**
     * This must be set to 'value' to make the colorAxis track with the contour
     * plot.
     */
    colorKey: 'value',

    clip: false,

    /**
     * Whether to use smooth color transitions.
     *
     * @type      {boolean}
     * @default   true
     * @apioption plotOptions.contour.smoothColoring
     */

    /**
     * Interval between contour lines.
     *
     * @type      {number}
     * @default   1
     * @apioption plotOptions.contour.contourInterval
     */

    /**
     * @excluding radius, enabledThreshold
     */
    marker: {
        /**
         * A predefined shape or symbol for the marker. When undefined, the
         * symbol is pulled from options.symbols. Other possible values are
         * `'circle'`, `'square'`,`'diamond'`, `'triangle'`,
         * `'triangle-down'`, `'rect'`, `'ellipse'`, and `'cross'`.
         *
         * Additionally, the URL to a graphic can be given on this form:
         * `'url(graphic.png)'`. Note that for the image to be applied to
         * exported charts, its URL needs to be accessible by the export
         * server.
         *
         * Custom callbacks for symbol path generation can also be added to
         * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
         * used by its method name, as shown in the demo.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         */
        symbol: 'cross',
        /** @ignore-option */
        radius: 0,
        lineColor: void 0,
        states: {
            /**
             * @excluding radius, radiusPlus
             */
            hover: {
                /**
                 * Color of the cross marker. Defaults to `'black'`.
                 */
                lineColor: 'black',

                /**
                 * Fill of the cross marker. Defaults to `'transparent'`.
                 */
                fillColor: 'transparent'
            }
        }
    },

    /**
     * Whether to render the series on the background, so that it is visible
     * behind axes and grid lines. It will be also visible behind series that
     * are rendered before it.
     */
    renderOnBackground: true,

    states: {
        hover: {
            /** @ignore-option */
            halo: void 0
        }
    },

    tooltip: {
        pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
    },

    zIndex: 0

};
''; // Keeps doclets above separate

export default ContourSeriesDefaults;
