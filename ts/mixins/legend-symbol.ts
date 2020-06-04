/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Point from '../parts/Point';
import H from '../parts/Globals.js';

/**
 * @private
 */
declare global {
    namespace Highcharts {
        interface BubbleLegend extends LegendItemObject {
        }
        interface LegendItemObject extends LegendSymbolMixin {
            _legendItemPos?: Array<number>;
            checkbox?: LegendCheckBoxElement;
            checkboxOffset?: number;
            itemHeight?: number;
            itemWidth?: number;
            legend: Legend;
            legendGroup?: SVGElement;
            legendItem?: SVGElement;
            legendItems?: Array<SVGElement>;
            legendItemHeight?: number;
            legendItemWidth?: number;
            legendLine?: SVGElement;
            legendSymbol?: SVGElement;
            pageIx?: number;
            renderAsLegendItem(): void;
        }
        interface LegendSymbolMixin {
            drawLineMarker(legend: Legend): void;
            drawRectangle(legend: Legend, item: (Point|Series)): void;
        }
        interface PointLike extends LegendItemObject {
        }
        interface Series extends LegendItemObject {
        }
        let LegendSymbolMixin: LegendSymbolMixin;
    }
}

import U from '../parts/Utilities.js';
const {
    merge,
    pick
} = U;

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
    drawRectangle: function (
        this: Highcharts.Series,
        legend: Highcharts.Legend,
        item: (Point|Highcharts.Series)
    ): void {
        var options = legend.options,
            symbolHeight = legend.symbolHeight,
            square = options.squareSymbol,
            symbolWidth = square ? symbolHeight : legend.symbolWidth;

        item.legendSymbol = this.chart.renderer.rect(
            square ? (legend.symbolWidth - symbolHeight) / 2 : 0,
            (legend.baseline as any) - symbolHeight + 1, // #3988
            symbolWidth,
            symbolHeight,
            pick(legend.options.symbolRadius, symbolHeight / 2)
        )
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
    drawLineMarker: function (
        this: Highcharts.Series,
        legend: Highcharts.Legend
    ): void {

        var options = this.options,
            markerOptions = options.marker,
            radius,
            legendSymbol,
            symbolWidth = legend.symbolWidth,
            symbolHeight = legend.symbolHeight,
            generalRadius = symbolHeight / 2,
            renderer = this.chart.renderer,
            legendItemGroup = this.legendGroup,
            verticalCenter = (legend.baseline as any) -
                Math.round((legend.fontMetrics as any).b * 0.3),
            attr = {} as Highcharts.SVGAttributes;

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
            radius = Math.min(
                pick(markerOptions.radius, generalRadius),
                generalRadius
            );

            // Restrict symbol markers size
            if ((this.symbol as any).indexOf('url') === 0) {
                markerOptions = merge(markerOptions, {
                    width: symbolHeight,
                    height: symbolHeight
                });
                radius = 0;
            }

            this.legendSymbol = legendSymbol = renderer.symbol(
                this.symbol as any,
                (symbolWidth / 2) - radius,
                verticalCenter - radius,
                2 * radius,
                2 * radius,
                markerOptions
            )
                .addClass('highcharts-point')
                .add(legendItemGroup);
            legendSymbol.isMarker = true;
        }
    }
};

export default H.LegendSymbolMixin;
