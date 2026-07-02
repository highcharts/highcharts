'use strict';

import type ColorType from '../Core/Color/ColorType';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';
import H from '../Core/Globals.js';
import Legend from '../Core/Legend/Legend.js';
import { addEvent, pushUnique } from '../Shared/Utilities.js';
const { composed } = H;

/**
 * A legend item (the candlestick) whose symbol has extra box bodies that are
 * colored and dimmed alongside the item.
 * @internal
 */
interface LegendBoxSeries {
    color?: ColorType;
    legendSymbolBoxes?: Array<{ element: SVGElement; up?: boolean }>;
    options: {
        legendSymbolColor?: ColorType;
        lineColor?: ColorType;
        upColor?: ColorType;
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
     * Scaled drawing helpers mapping the design viewBox onto the legend
     * symbol box.
     * @internal
     */
    export interface Pen {
        stem: (cx: number, y1: number, y2: number) => SVGPath;
        tick: (cy: number, x1: number, x2: number) => SVGPath;
    }

    /**
     * A rounded rectangle in symbol-box coordinates.
     * @internal
     */
    export interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
        r: number;
    }

    /**
     * The candlestick legend's two box bodies (stroked rectangles) plus the
     * border width that the legend should apply.
     * @internal
     */
    export interface CandleBoxes {
        filled: Rect;
        hollow: Rect;
        strokeWidth: number;
    }

    // Largest content box across the designs (in design units). Every icon
    // shares one scale derived from this, so the 1-unit bars keep a uniform
    // weight; each icon is then centered on its own content (cx, cy).
    const contentW = 11,
        contentH = 12;

    /**
     * Map design coordinates onto the symbol box: a single shared scale (so
     * bars keep a consistent weight across icons), with the icon's content
     * center (cx, cy) aligned to the center of the box.
     */
    function place(
        x: number, y: number, w: number, h: number, cx: number, cy: number
    ): { s: number; ox: number; oy: number } {
        const s = Math.min(w / contentW, h / contentH);
        return {
            s,
            ox: x + w / 2 - cx * s,
            oy: y + h / 2 - cy * s
        };
    }

    /**
     * The candlestick legend's two box bodies. Each is stroked with
     * `strokeWidth` (one design unit) and inset by half of it, so the border
     * and the remaining fill "field" are also one unit wide — keeping wick,
     * border and field equal at every scale (#24567).
     */
    export function candlestickBoxes(
        x: number, y: number, w: number, h: number
    ): CandleBoxes {
        const { s, ox, oy } = place(x, y, w, h, 4.5, 6),
            r = 0.3 * s;
        return {
            // Filled (left) candle body: visual x0.5..3.5, y2..8
            filled: {
                x: ox + s,
                y: oy + 2.5 * s,
                width: 2 * s,
                height: 5 * s,
                r
            },
            // Hollow (right) candle body: visual x5.5..8.5, y6..10
            hollow: {
                x: ox + 6 * s,
                y: oy + 6.5 * s,
                width: 2 * s,
                height: 3 * s,
                r
            },
            strokeWidth: s
        };
    }

    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {
        if (pushUnique(composed, 'Series.FinancialSymbols')) {
            const symbols = SVGRendererClass.prototype.symbols,
                nudge = 3;

            // Color the candlestick's box bodies (stored by its
            // `drawLegendSymbol`) and dim them with the legend item. The wicks
            // are the symbol path, already handled by `colorizeItem`.
            addEvent(Legend, 'afterColorizeItem', function (e): void {
                const { item, visible } = e as {
                        item: LegendBoxSeries;
                        visible: boolean;
                    },
                    boxes = item.legendSymbolBoxes;

                if (boxes && !this.chart.styledMode) {
                    const { upColor, lineColor, legendSymbolColor } =
                            item.options,
                        color = legendSymbolColor || item.color,
                        hidden = visible ? void 0 : this.itemHiddenStyle?.color;

                    boxes.forEach(({ element, up }): void => {
                        element.attr({
                            fill: hidden ?? (up ? upColor : color),
                            stroke: hidden ?? lineColor
                        });
                    });
                }
            });

            // `pen` maps design coordinates onto the symbol box, centering the
            // icon's content (cx, cy) and rendering bars as rounded capsules.
            const pen = (
                x: number, y: number, w: number, h: number,
                cx: number, cy: number
            ): FinancialSymbols.Pen => {
                const { s, ox, oy } = place(x, y, w, h, cx, cy),
                    r = s / 2;

                return {
                    stem: (bx, y1, y2): SVGPath => symbols.rect(
                        ox + bx * s - r, oy + y1 * s,
                        s, (y2 - y1) * s,
                        { r }
                    ),
                    tick: (by, x1, x2): SVGPath => symbols.rect(
                        ox + x1 * s, oy + by * s - r,
                        (x2 - x1) * s, s,
                        { r }
                    )
                };
            };

            // High-Low-Close: two stems, each with a close tick to the right.
            symbols.hlc = (x, y, w, h): SVGPath => {
                const { stem, tick } = pen(x + nudge, y, w, h, 5, 6);
                return [
                    ...stem(1.5, 0, 9.6), ...tick(5.4, 1, 4),
                    ...stem(6.5, 1.2, 12), ...tick(3, 6, 9)
                ];
            };

            // Open-High-Low-Close: stems with open (left) and close (right)
            // ticks.
            symbols.ohlc = (x, y, w, h): SVGPath => {
                const { stem, tick } = pen(x + nudge, y, w, h, 5.5, 6);
                return [
                    ...stem(2.5, 0, 12),
                    ...tick(2.5, 0, 3), ...tick(8.5, 2, 5),
                    ...stem(8.5, 2, 11),
                    ...tick(8.5, 6, 9), ...tick(3.5, 8, 11)
                ];
            };

            // Candlestick: just the wicks (the box bodies are drawn by the
            // legend, see `candlestickBoxes`).
            symbols.candlestick = (x, y, w, h): SVGPath => {
                const { stem } = pen(x, y, w, h, 4.5, 6);
                return [
                    // Filled (left) candle wicks, above and below its body
                    ...stem(2, 0, 3), ...stem(2, 7, 12),
                    // Hollow (right) candle wicks, above and below its body
                    ...stem(7, 0, 7), ...stem(7, 9, 12)
                ];
            };
        }
    }
}

export default FinancialSymbols;
