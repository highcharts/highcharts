import type ContourSeriesOptions from './ContourSeriesOptions';
import ContourPoint from './ContourPoint';

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
    states: {
        hover: {
            /** @ignore-option */
            halo: void 0
        }
    },

    tooltip: {
        /**
         * A callback function for formatting the HTML output for a single point
         * in the tooltip. Like the `pointFormat` string, but with more
         * flexibility.
         *
         * For contour plots, this function, by default, ensures a correctly
         * colored tooltip.
         *
         * @type      {Highcharts.FormatterCallbackFunction<Highcharts.Point>}
         * @since     4.1.0
         * @context   Highcharts.Point
         * @apioption plotOptions.contour.tooltip.pointFormatter
         */
        pointFormatter: function (): string {
            const point = (this as ContourPoint),
                { series, value } = point;

            return `<span style="color: ${
                series.colorAxis?.toColor(value ?? 0, point.value as any) ||
                'black'
            };">●●●●●●●●●●●●●●●●●●●●●●●●●●●</span>`;
        }
    }

};
''; // Keeps doclets above separate

export default ContourSeriesDefaults;
