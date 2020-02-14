/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var merge = U.merge, pick = U.pick;
/* eslint-disable valid-jsdoc */
/**
 * Legend symbol mixin.
 *
 * @private
 * @mixin Highcharts.LegendSymbolMixin
 */
H.LegendSymbolMixin = {
    /**
     * Get the series' symbol in the legend
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
    drawRectangle: function (legend, item) {
        var options = legend.options, symbolHeight = legend.symbolHeight, square = options.squareSymbol, symbolWidth = square ? symbolHeight : legend.symbolWidth;
        item.legendSymbol = this.chart.renderer.rect(square ? (legend.symbolWidth - symbolHeight) / 2 : 0, legend.baseline - symbolHeight + 1, // #3988
        symbolWidth, symbolHeight, pick(legend.options.symbolRadius, symbolHeight / 2))
            .addClass('highcharts-point')
            .attr({
            zIndex: 3
        }).add(item.legendGroup);
    },
    /**
     * Get the series' symbol in the legend. This method should be overridable
     * to create custom symbols through
     * Highcharts.seriesTypes[type].prototype.drawLegendSymbols.
     *
     * @private
     * @function Highcharts.LegendSymbolMixin.drawLineMarker
     *
     * @param {Highcharts.Legend} legend
     * The legend object.
     */
    drawLineMarker: function (legend) {
        var options = this.options, markerOptions = options.marker, radius, legendSymbol, symbolWidth = legend.symbolWidth, symbolHeight = legend.symbolHeight, generalRadius = symbolHeight / 2, renderer = this.chart.renderer, legendItemGroup = this.legendGroup, verticalCenter = legend.baseline -
            Math.round(legend.fontMetrics.b * 0.3), attr = {};
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
            'M',
            0,
            verticalCenter,
            'L',
            symbolWidth,
            verticalCenter
        ])
            .addClass('highcharts-graph')
            .attr(attr)
            .add(legendItemGroup);
        // Draw the marker
        if (markerOptions && markerOptions.enabled !== false && symbolWidth) {
            // Do not allow the marker to be larger than the symbolHeight
            radius = Math.min(pick(markerOptions.radius, generalRadius), generalRadius);
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
};
export default H.LegendSymbolMixin;
