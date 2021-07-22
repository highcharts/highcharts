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

import type Legend from './Legend';
import type LegendItemObject from './LegendItemObject';
import type Point from '../Series/Point';
import type Series from '../Series/Series';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';

import U from '../Utilities.js';
const {
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Axis/AxisLike' {
    interface AxisLike extends LegendItemObject {
        // nothing to add
    }
}

declare module '../Series/PointLike' {
    interface PointLike extends LegendItemObject {
        // nothing to add
    }
}

declare module '../Series/SeriesLike' {
    interface SeriesLike extends LegendItemObject {
        drawLegendSymbol: (
            typeof LegendSymbol.drawLineMarker|
            typeof LegendSymbol.drawRectangle
        );
    }
}

/* *
 *
 *  Namespace
 *
 * */

namespace LegendSymbol {

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
    export function drawLineMarker(
        this: Series,
        legend: Legend
    ): void {

        const options = this.options,
            symbolWidth = legend.symbolWidth,
            symbolHeight = legend.symbolHeight,
            generalRadius = symbolHeight / 2,
            renderer = this.chart.renderer,
            legendItemGroup = this.legendGroup,
            verticalCenter = (legend.baseline as any) -
                Math.round((legend.fontMetrics as any).b * 0.3);

        let attr: SVGAttributes = {},
            legendSymbol,
            markerOptions = options.marker;

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
            let radius = Math.min(
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
    export function drawRectangle(
        this: Series,
        legend: Legend,
        item: (Point|Series)
    ): void {
        const options = legend.options,
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

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default LegendSymbol;
