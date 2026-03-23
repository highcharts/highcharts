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

import type ColorType from '../Color/ColorType';
import type Legend from './Legend';
import type LegendItem from './LegendItem';
import type Point from '../Series/Point';
import type { PointMarkerOptions } from '../Series/PointOptions';
import type Series from '../Series/Series';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGPath from '../Renderer/SVG/SVGPath';
import type SymbolOptions from '../Renderer/SVG/SymbolOptions';

import { extend, merge, pick } from '../../Shared/Utilities.js';

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
        /**
         * Legend data for the series.
         *
         * @since 10.3.0
         */
        legendItem?: LegendItem['legendItem'];

        /** @internal */
        drawLegendSymbol: (
            legend: Legend,
            item: (Point|Series)
        ) => void;
    }
}

/**
 * Options for the legend symbol.
 */
export interface LegendSymbolOptions {
    /**
     * The symbol type to use for the legend symbol. Same values as the
     * string form of `series.legendSymbol`: `'rectangle'`, `'lineMarker'`
     * or `'areaMarker'`.
     */
    symbol?: string;

    /**
     * The line width to use in the legend symbol. Only applies when
     * `symbol` is `'lineMarker'` or `'areaMarker'`.
     */
    lineWidth?: number;

    /**
     * A color override for the legend symbol. When not set, the series
     * color is used.
     */
    color?: ColorType;

    /**
     * Options for the marker part of the legend symbol. Only applies when
     * `symbol` is `'lineMarker'` or `'areaMarker'`. These options are merged
     * on top of the series `marker` options, so only the properties set here
     * will be overridden in the legend. Priority order for each property:
     * `legendSymbol.marker` → `series.marker` → built-in default.
     *
     * For example, setting `marker.symbol` here changes the legend marker
     * shape without affecting the actual point markers in the chart.
     * Setting `marker.fillColor` to an `rgba` color is a convenient way to
     * apply opacity to the legend marker independently of the series color.
     */
    marker?: Pick<PointMarkerOptions,
        'enabled' | 'fillColor' | 'lineColor' | 'lineWidth' | 'radius' |
        'symbol'
    >;
}

declare module '../Series/SeriesOptions' {
    interface SeriesOptions {
        /**
         * What type of legend symbol to render for this series. Can be one of
         * `areaMarker`, `lineMarker` or `rectangle`, or an object with further
         * options.
         *
         * @sample {highcharts} highcharts/series/legend-symbol/
         *         Change the legend symbol
         *
         * @default 'rectangle'
         * @since   11.0.1
         */
        legendSymbol?: string | LegendSymbolOptions;

        /**
         * Defines the color of the legend symbol for this series. Defaults to
         * undefined, in which case the series color is used. Does not work with
         * styled mode.
         *
         * @sample {highcharts|highstock} highcharts/series/legend-symbol-color/
         *         Change the legend symbol color
         *
         * @since   12.0.0
         * @product highcharts highstock highmaps
         */
        legendSymbolColor?: ColorType;
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
            legendSymbolOption = options.legendSymbol,
            legendSymbolObject: LegendSymbolOptions | undefined =
                typeof legendSymbolOption === 'object' ?
                    legendSymbolOption : void 0,
            legendMarkerOptions = legendSymbolObject?.marker,
            { baseline = 0, symbolWidth, symbolHeight } = legend,
            symbol = legendMarkerOptions?.symbol || this.symbol || 'circle',
            generalRadius = symbolHeight / 2,
            renderer = chart.renderer,
            legendItemGroup = legendItem.group,
            verticalCenter = baseline - Math.round(
                (legend.fontMetrics?.b || symbolHeight) *
                // Render line and marker slightly higher to make room for the
                // area
                (hasArea ? 0.4 : 0.3)
            ),
            attr: SVGAttributes = {},
            markerOptions = options.marker;

        let legendSymbol,
            lineSizer = 0;

        // Draw the line
        if (!chart.styledMode) {
            attr['stroke-width'] = Math.min(
                legendSymbolObject?.lineWidth ?? options.lineWidth ?? 0,
                24
            );

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

        // Merge legendSymbol.marker on top of series marker options. This
        // allows per-legend overrides without affecting the series itself.
        const effectiveMarkerOptions = legendMarkerOptions ?
            merge(markerOptions, legendMarkerOptions) :
            markerOptions;

        // Draw the marker
        const markerEnabled = legendMarkerOptions?.enabled ??
            effectiveMarkerOptions?.enabled;

        if (
            effectiveMarkerOptions &&
            markerEnabled !== false &&
            symbolWidth
        ) {

            // When the user explicitly sets legendSymbol.marker.radius, use
            // it as-is. Otherwise cap at generalRadius (symbolHeight / 2) to
            // avoid overflow outside the legend row.
            let radius = legendMarkerOptions?.radius !== void 0 ?
                legendMarkerOptions.radius :
                Math.min(
                    pick(effectiveMarkerOptions.radius, generalRadius),
                    generalRadius
                );

            // Restrict symbol markers size
            if (symbol.indexOf('url') === 0) {
                radius = 0;
            }

            legendItem.symbol = legendSymbol = renderer
                .symbol(
                    symbol,
                    (symbolWidth / 2) - radius,
                    verticalCenter - radius,
                    2 * radius,
                    2 * radius,
                    extend<SymbolOptions>(
                        { context: 'legend' },
                        symbol.indexOf('url') === 0 ?
                            merge(effectiveMarkerOptions, {
                                width: symbolHeight,
                                height: symbolHeight
                            }) :
                            effectiveMarkerOptions
                    )
                )
                .addClass('highcharts-point')
                .add(legendItemGroup);
            legendSymbol.isMarker = true;
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default LegendSymbol;
