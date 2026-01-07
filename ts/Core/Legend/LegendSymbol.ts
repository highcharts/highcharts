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

/* *
 *
 *  Imports
 *
 * */

import type Legend from './Legend';
import type LegendItem from './LegendItem';
import type Point from '../Series/Point';
import type Series from '../Series/Series';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGPath from '../Renderer/SVG/SVGPath';
import type SymbolOptions from '../Renderer/SVG/SymbolOptions';

import U from '../Utilities.js';
const {
    extend,
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Axis/AxisBase' {
    interface AxisBase extends LegendItem {
        // Nothing to add
    }
}

declare module '../Series/PointBase' {
    interface PointBase extends LegendItem {
        // Nothing to add
    }
}

declare module '../Series/SeriesBase' {
    interface SeriesBase extends LegendItem {
        /** @internal */
        drawLegendSymbol: (
            legend: Legend,
            item: (Point|Series)
        ) => void;
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

    /**
     * Draw a line, a point marker and an area in the legend.
     *
     * @function Highcharts.LegendSymbolMixin.areaMarker
     *
     * @param {Highcharts.Legend} legend
     * The legend object.
     */
    export function areaMarker(
        this: Series,
        legend: Legend,
        item?: LegendItem
    ): void {
        lineMarker.call(this, legend, item, true);
    }

    /**
     * Draw a line and a point marker in the legend.
     *
     * @function Highcharts.LegendSymbolMixin.lineMarker
     *
     * @param {Highcharts.Legend} legend
     * The legend object.
     */
    export function lineMarker(
        this: Series,
        legend: Legend,
        item?: LegendItem,
        hasArea?: boolean
    ): void {

        const legendItem = this.legendItem = this.legendItem || {},
            { chart, options } = this,
            { baseline = 0, symbolWidth, symbolHeight } = legend,
            symbol = this.symbol || 'circle',
            generalRadius = symbolHeight / 2,
            renderer = chart.renderer,
            legendItemGroup = legendItem.group,
            verticalCenter = baseline - Math.round(
                (legend.fontMetrics?.b || symbolHeight) *
                // Render line and marker slightly higher to make room for the
                // area
                (hasArea ? 0.4 : 0.3)
            ),
            attr: SVGAttributes = {};

        let legendSymbol,
            markerOptions = options.marker,
            lineSizer = 0;

        // Draw the line
        if (!chart.styledMode) {
            attr['stroke-width'] = Math.min(options.lineWidth || 0, 24);

            if (options.dashStyle) {
                attr.dashstyle = options.dashStyle;
            } else if (options.linecap !== 'square') {
                attr['stroke-linecap'] = 'round';
            }
        }

        legendItem.line = renderer
            .path()
            .addClass('highcharts-graph')
            .attr(attr)
            .add(legendItemGroup);

        if (hasArea) {
            legendItem.area = renderer
                .path()
                .addClass('highcharts-area')
                .add(legendItemGroup);
        }

        if (attr['stroke-linecap']) {
            lineSizer = Math.min(
                legendItem.line.strokeWidth(),
                symbolWidth
            ) / 2;
        }

        if (symbolWidth) {
            const d: SVGPath = [
                ['M', lineSizer, verticalCenter],
                ['L', symbolWidth - lineSizer, verticalCenter]
            ];

            legendItem.line.attr({ d });

            legendItem.area?.attr({
                d: [
                    ...d,
                    ['L', symbolWidth - lineSizer, baseline],
                    ['L', lineSizer, baseline]
                ]
            });
        }

        // Draw the marker
        if (markerOptions && markerOptions.enabled !== false && symbolWidth) {

            // Do not allow the marker to be larger than the symbolHeight
            let radius = Math.min(
                pick(markerOptions.radius, generalRadius),
                generalRadius
            );

            // Restrict symbol markers size
            if (symbol.indexOf('url') === 0) {
                markerOptions = merge(markerOptions, {
                    width: symbolHeight,
                    height: symbolHeight
                });
                radius = 0;
            }

            legendItem.symbol = legendSymbol = renderer
                .symbol(
                    symbol,
                    (symbolWidth / 2) - radius,
                    verticalCenter - radius,
                    2 * radius,
                    2 * radius,
                    extend<SymbolOptions>({ context: 'legend' }, markerOptions)
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
     * @function Highcharts.LegendSymbolMixin.rectangle
     *
     * @param {Highcharts.Legend} legend
     * The legend object
     *
     * @param {Highcharts.Point|Highcharts.Series} item
     * The series (this) or point
     */
    export function rectangle(
        this: Series,
        legend: Legend,
        item: LegendItem
    ): void {
        const legendItem = item.legendItem || {},
            options = legend.options,
            symbolHeight = legend.symbolHeight,
            square = options.squareSymbol,
            symbolWidth = square ? symbolHeight : legend.symbolWidth;

        legendItem.symbol = this.chart.renderer
            .rect(
                square ? (legend.symbolWidth - symbolHeight) / 2 : 0,
                (legend.baseline as any) - symbolHeight + 1, // #3988
                symbolWidth,
                symbolHeight,
                pick(legend.options.symbolRadius, symbolHeight / 2)
            )
            .addClass('highcharts-point')
            .attr({
                zIndex: 3
            })
            .add(legendItem.group);

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default LegendSymbol;
