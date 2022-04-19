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
import U from '../Utilities.js';
var merge = U.merge, pick = U.pick;
/* *
 *
 *  Namespace
 *
 * */
var LegendSymbol;
(function (LegendSymbol) {
    /* *
    *
    *  Functions
    *
    * */
    /* eslint-disable valid-jsdoc */
    /**
     * Get the series' symbol in the legend.
     *
     * This method should be overridable to create custom symbols through
     * Highcharts.seriesTypes[type].prototype.drawLegendSymbol.
     *
     * @private
     * @function Highcharts.LegendSymbolMixin.drawLineMarker
     *
     * @param {Highcharts.Legend} legend
     * The legend object.
     */
    function drawLineMarker(legend) {
        var options = this.options, symbolWidth = legend.symbolWidth, symbolHeight = legend.symbolHeight, generalRadius = symbolHeight / 2, renderer = this.chart.renderer, legendItemGroup = this.legendGroup, verticalCenter = legend.baseline -
            Math.round(legend.fontMetrics.b * 0.3);
        var attr = {}, legendSymbol, markerOptions = options.marker;
        // Draw the line
        if (!this.chart.styledMode) {
            attr = {
                'stroke-width': options.lineWidth || 0
            };
            if (options.dashStyle) {
                attr.dashstyle = options.dashStyle;
            }
        }
        this.legendLine = renderer
            .path([
            ['M', 0, verticalCenter],
            ['L', symbolWidth, verticalCenter]
        ])
            .addClass('highcharts-graph')
            .attr(attr)
            .add(legendItemGroup);
        // Draw the marker
        if (markerOptions && markerOptions.enabled !== false && symbolWidth) {
            // Do not allow the marker to be larger than the symbolHeight
            var radius = Math.min(pick(markerOptions.radius, generalRadius), generalRadius);
            // Restrict symbol markers size
            if (this.symbol.indexOf('url') === 0) {
                markerOptions = merge(markerOptions, {
                    width: symbolHeight,
                    height: symbolHeight
                });
                radius = 0;
            }
            this.legendSymbol = legendSymbol = renderer.symbol(this.symbol, (symbolWidth / 2) - radius, verticalCenter - radius, 2 * radius, 2 * radius, markerOptions)
                .addClass('highcharts-point')
                .add(legendItemGroup);
            legendSymbol.isMarker = true;
        }
    }
    LegendSymbol.drawLineMarker = drawLineMarker;
    /**
     * Get the series' symbol in the legend.
     *
     * This method should be overridable to create custom symbols through
     * Highcharts.seriesTypes[type].prototype.drawLegendSymbol.
     *
     * @private
     * @function Highcharts.LegendSymbolMixin.drawRectangle
     *
     * @param {Highcharts.Legend} legend
     * The legend object
     *
     * @param {Highcharts.Point|Highcharts.Series} item
     * The series (this) or point
     */
    function drawRectangle(legend, item) {
        var options = legend.options, symbolHeight = legend.symbolHeight, square = options.squareSymbol, symbolWidth = square ? symbolHeight : legend.symbolWidth;
        item.legendSymbol = this.chart.renderer.rect(square ? (legend.symbolWidth - symbolHeight) / 2 : 0, legend.baseline - symbolHeight + 1, // #3988
        symbolWidth, symbolHeight, pick(legend.options.symbolRadius, symbolHeight / 2))
            .addClass('highcharts-point')
            .attr({
            zIndex: 3
        }).add(item.legendGroup);
    }
    LegendSymbol.drawRectangle = drawRectangle;
})(LegendSymbol || (LegendSymbol = {}));
/* *
 *
 *  Default Export
 *
 * */
export default LegendSymbol;
