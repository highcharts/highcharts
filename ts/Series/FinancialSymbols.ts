'use strict';

import type ColorType from '../Core/Color/ColorType';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';
import H from '../Core/Globals.js';
import Legend from '../Core/Legend/Legend.js';
import { addEvent, crisp, pushUnique } from '../Shared/Utilities.js';
const { composed } = H;

/**
 * A legend item (the candlestick) whose symbol has extra candle bodies that
 * are colored and dimmed alongside the item.
 * @internal
 */
interface LegendBoxSeries {
    color?: ColorType;
    legendSymbolBoxes?: Array<{ element: SVGElement; up?: boolean }>;
    options: {
        legendSymbolColor?: ColorType;
        lineColor?: ColorType;
        upColor?: ColorType;
        upLineColor?: ColorType;
    };
}

/* *
 * Declarations
 * */
declare module '../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        hlc: SymbolFunction;
        ohlc: SymbolFunction;
        candlestick: SymbolFunction;
    }
}

/* *
 * Composition
 * */
namespace FinancialSymbols {

    /**
     * One of the two candle bodies of the candlestick legend symbol, in
     * pixel coordinates. The `up` body renders hollow.
     * @internal
     */
    export interface CandleBox {
        height: number;
        up?: boolean;
        width: number;
        x: number;
        y: number;
    }

    /**
     * The two candle bodies (filled/down left, hollow/up right) of the
     * candlestick legend symbol. The wicks of the `candlestick` symbol path
     * derive from the same boxes (#24567).
     */
    export function candlestickBoxes(
        x: number, y: number, w: number, h: number
    ): Array<CandleBox> {
        // Even body width keeps 1px borders crisp around half-pixel centers
        const width = 2 * Math.round(w * 0.2);

        return [
            { cx: 0.2, top: 0.25, bottom: 0.65 },
            { cx: 0.8, top: 0.45, bottom: 0.8, up: true }
        ].map(({ cx, top, bottom, up }): CandleBox => {
            const y1 = crisp(y + h * top, 1),
                y2 = crisp(y + h * bottom, 1);

            return {
                x: crisp(x + w * cx, 1) - width / 2,
                y: y1,
                width,
                height: y2 - y1,
                up
            };
        });
    }

    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {
        if (pushUnique(composed, 'Series.FinancialSymbols')) {
            const symbols = SVGRendererClass.prototype.symbols;

            // Color the candlestick's candle bodies (stored by its
            // `drawLegendSymbol`) like chart points, and dim them with the
            // legend item. The wicks are the symbol path, already handled by
            // `colorizeItem`.
            addEvent(Legend, 'afterColorizeItem', function (e): void {
                const { item, visible } = e as {
                        item: LegendBoxSeries;
                        visible: boolean;
                    },
                    boxes = item.legendSymbolBoxes;

                if (boxes && !this.chart.styledMode) {
                    const {
                            legendSymbolColor, lineColor, upColor, upLineColor
                        } = item.options,
                        color = legendSymbolColor || item.color,
                        stroke = lineColor || color,
                        hidden = visible ? void 0 : this.itemHiddenStyle?.color;

                    boxes.forEach(({ element, up }): void => {
                        element.attr({
                            fill: hidden ?? (up ? upColor : color),
                            stroke: hidden ??
                                (up ? upLineColor || stroke : stroke)
                        });
                    });
                }
            });

            // Two staggered stems, a down bar (left) and an up bar (right),
            // each with a close tick to the right; OHLC adds open ticks to
            // the left
            const hlcPath = (
                x: number, y: number, w: number, h: number, isOhlc?: boolean
            ): SVGPath => {
                const x1 = crisp(x + w * 0.25, 1),
                    x2 = crisp(x + w * 0.75, 1),
                    tick = (x2 - x1 - 1) / 2,
                    close1 = crisp(y + h * 0.7, 1),
                    close2 = crisp(y + h * 0.4, 1),
                    path: SVGPath = [
                        ['M', x1, y], ['L', x1, y + h],
                        ['M', x1, close1], ['L', x1 + tick, close1],
                        ['M', x2, Math.round(y + h * 0.15)],
                        ['L', x2, Math.round(y + h * 0.9)],
                        ['M', x2, close2], ['L', x2 + tick, close2]
                    ];

                if (isOhlc) {
                    // The up bar opens at the height the down bar closes,
                    // weaving the two bars together as in the design
                    const open1 = crisp(y + h * 0.2, 1),
                        open2 = close1;

                    path.push(
                        ['M', x1 - tick, open1], ['L', x1, open1],
                        ['M', x2 - tick, open2], ['L', x2, open2]
                    );
                }
                return path;
            };

            symbols.hlc = (x, y, w, h): SVGPath => hlcPath(x, y, w, h);

            symbols.ohlc = (x, y, w, h): SVGPath => hlcPath(x, y, w, h, true);

            // Candlestick: the wicks above and below each candle body (the
            // bodies themselves are drawn by the legend, see
            // `candlestickBoxes`)
            symbols.candlestick = (x, y, w, h): SVGPath => {
                const path: SVGPath = [];

                candlestickBoxes(x, y, w, h).forEach((box): void => {
                    const cx = box.x + box.width / 2;

                    path.push(
                        ['M', cx, y], ['L', cx, box.y],
                        ['M', cx, box.y + box.height], ['L', cx, y + h]
                    );
                });
                return path;
            };
        }
    }
}

export default FinancialSymbols;
