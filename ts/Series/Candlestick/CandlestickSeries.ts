/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type CandlestickPoint from './CandlestickPoint';
import type CandlestickSeriesOptions from './CandlestickSeriesOptions';
import type Legend from '../../Core/Legend/Legend';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import CandlestickSeriesDefaults from './CandlestickSeriesDefaults.js';
import FinancialSymbols from '../FinancialSymbols.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries,
    ohlc: OHLCSeries
} = SeriesRegistry.seriesTypes;
import { crisp, merge } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * The candlestick series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.candlestick
 *
 * @augments Highcharts.seriesTypes.ohlc
 */
class CandlestickSeries extends OHLCSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: CandlestickSeriesOptions = merge(
        OHLCSeries.defaultOptions,
        { tooltip: OHLCSeries.defaultOptions.tooltip },
        CandlestickSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<CandlestickPoint>;

    public legendSymbolBoxes?: Array<{ element: SVGElement; up?: boolean }>;

    public options!: CandlestickSeriesOptions;

    public points!: Array<CandlestickPoint>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Postprocess mapping between options and SVG attributes
     *
     * @private
     * @function Highcharts.seriesTypes.candlestick#pointAttribs
     */
    public pointAttribs(
        point?: CandlestickPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        if (!point) {
            return { fill: this.options.lineColor || this.color };
        }

        const attribs = ColumnSeries.prototype.pointAttribs.call(
                this,
                point,
                state
            ),
            options = this.options,
            isUp = (point.open || 0) < (point.close || 0),
            stroke = options.lineColor || this.color,
            color = point.color || this.color; // (#14826)

        attribs['stroke-width'] = options.lineWidth;

        attribs.fill = point.options.color ||
            (isUp ? (options.upColor || color) : color);
        attribs.stroke = point.options.lineColor ||
            (isUp ? (options.upLineColor || stroke) : stroke);

        // Select or hover states
        if (state) {
            const stateOptions = (options.states as any)[state];
            attribs.fill = stateOptions.color || attribs.fill;
            attribs.stroke = stateOptions.lineColor || attribs.stroke;
            attribs['stroke-width'] =
                stateOptions.lineWidth || attribs['stroke-width'];
        }

        return attribs;
    }

    /**
     * Draw the candlestick legend symbol. The symbol path carries only the
     * wicks; the two box bodies are drawn here as bordered rectangles and
     * colored/dimmed by `FinancialSymbols` on `afterColorizeItem` (#24567).
     *
     * @private
     * @function Highcharts.seriesTypes.candlestick#drawLegendSymbol
     */
    public drawLegendSymbol(legend: Legend, item: Legend.Item): void {
        super.drawLegendSymbol(legend, item);

        const { chart } = this,
            { renderer } = chart,
            { lineColor } = this.options,
            legendItem = item.legendItem || {},
            symbolHeight = legend.symbolHeight,
            squareSymbol = legend.options.squareSymbol,
            w = squareSymbol ? symbolHeight : legend.symbolWidth,
            x = squareSymbol ?
                (legend.symbolWidth - symbolHeight) / 2 :
                0,
            y = (legend.baseline || 0) - symbolHeight + 1,
            { filled, hollow, strokeWidth } =
                FinancialSymbols.candlestickBoxes(x, y, w, symbolHeight),
            boxes: NonNullable<CandlestickSeries['legendSymbolBoxes']> = [],
            // A bordered box; `up` flags the hollow (background-filled) candle
            box = (rect: FinancialSymbols.Rect, up?: boolean): void => {
                const element = renderer
                    .rect(rect.x, rect.y, rect.width, rect.height, rect.r)
                    .addClass('highcharts-point')
                    .attr({ zIndex: 3, 'stroke-width': strokeWidth })
                    .add(legendItem.group);

                if (up) {
                    element.addClass('highcharts-point-up');
                }
                boxes.push({ element, up });
            };

        // In styled mode the wicks would inherit the series color from CSS;
        // tint them with the border color so the line matches the boxes.
        if (chart.styledMode && lineColor) {
            legendItem.symbol?.attr({ fill: lineColor });
        }

        box(filled);
        box(hollow, true);

        // `FinancialSymbols` colors and dims these on every `colorizeItem`.
        this.legendSymbolBoxes = boxes;
    }

    /**
     * Create the SVGPath of the point based on the plot positions
     * @private
     */
    protected getPointPath(point: CandlestickPoint): SVGPath {
        // Crisp vector coordinates
        const strokeWidth = this.borderWidth,
            // #2596:
            crispX = crisp(point.plotX || 0, strokeWidth),
            plotOpen = point.plotOpen,
            plotClose = point.plotClose,
            topBoxFloat = Math.min(plotOpen, plotClose),
            bottomBoxFloat = Math.max(plotOpen, plotClose),
            halfWidth = Math.round((point.shapeArgs as any).width / 2),
            reversedYAxis = this.yAxis.reversed,
            hasTopWhisker = reversedYAxis ?
                bottomBoxFloat !== point.yBottom :
                Math.round(topBoxFloat) !==
                Math.round(point.plotHigh || 0),
            hasBottomWhisker = reversedYAxis ?
                Math.round(topBoxFloat) !==
                Math.round(point.plotHigh || 0) :
                bottomBoxFloat !== point.yBottom,
            topBox = crisp(topBoxFloat, strokeWidth),
            bottomBox = crisp(bottomBoxFloat, strokeWidth);

        // Create the path. Due to a bug in Chrome 49, the path is
        // first instantiated with no values, then the values
        // pushed. For unknown reasons, instantiating the path array
        // with all the values would lead to a crash when updating
        // frequently (#5193).
        const path: SVGPath = [];
        path.push(
            ['M', crispX - halfWidth, bottomBox],
            ['L', crispX - halfWidth, topBox],
            ['L', crispX + halfWidth, topBox],
            ['L', crispX + halfWidth, bottomBox],
            ['Z'], // Ensure a nice rectangle #2602
            ['M', crispX, topBox],
            [
                'L',
                // #460, #2094
                crispX,
                hasTopWhisker ?
                    Math.round(
                        reversedYAxis ?
                            point.yBottom :
                            (point.plotHigh as any)
                    ) :
                    topBox
            ],
            ['M', crispX, bottomBox],
            [
                'L',
                // #460, #2094
                crispX,
                hasBottomWhisker ?
                    Math.round(
                        reversedYAxis ?
                            (point.plotHigh as any) :
                            point.yBottom
                    ) :
                    bottomBox
            ]);
        return path;
    }

}

interface CandlestickSeries{
    pointClass: typeof CandlestickPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType'{
    interface SeriesTypeRegistry {
        candlestick: typeof CandlestickSeries;
    }
}

SeriesRegistry.registerSeriesType('candlestick', CandlestickSeries);

/* *
 *
 *  Default Export
 *
 * */

export default CandlestickSeries;
