'use strict';

import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';
import H from '../Core/Globals.js';
import { pushUnique } from '../Shared/Utilities.js';
const { composed } = H;

/* *
 * Declarations
 * */
declare module '../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        hlc: SymbolFunction;
        ohlc: SymbolFunction;
        candlestick: SymbolFunction;
        'flag-icon': SymbolFunction;
    }
}

/* *
 * Composition
 * */
namespace FinancialSymbols {

    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {
        if (pushUnique(composed, 'Series.FinancialSymbols')) {
            const symbols = SVGRendererClass.prototype.symbols;

            const hlcPath = (
                x: number, y: number, w: number, h: number, isOhlc?: boolean
            ): SVGPath => {
                const cx = Math.round(x + w / 2),
                    closeY = Math.round(y + h * (isOhlc ? 0.7 : 0.5)),
                    path: SVGPath = [
                        ['M', cx, y], ['L', cx, y + h],
                        ['M', cx, closeY], ['L', x + w, closeY]
                    ];

                if (isOhlc) {
                    const openY = Math.round(y + h * 0.3);
                    path.push(['M', x, openY], ['L', cx, openY]);
                }
                return path;
            };

            symbols.hlc = (x, y, w, h): SVGPath => hlcPath(x, y, w, h);

            symbols.ohlc = (x, y, w, h): SVGPath => hlcPath(x, y, w, h, true);

            symbols.candlestick = (
                x: number, y: number, w: number, h: number
            ): SVGPath => {
                const cx = Math.round(x + w / 2),
                    top = Math.round(y + h * 0.25),
                    bottom = Math.round(y + h * 0.75);

                return [
                    ['M', cx, y], ['L', cx, top],
                    ['M', cx, bottom], ['L', cx, y + h],
                    ['M', x, top], ['L', x + w, top],
                    ['L', x + w, bottom], ['L', x, bottom],
                    ['Z']
                ];
            };

            symbols['flag-icon'] = function (
                this: SVGRenderer, x: number, y: number, w: number, h: number
            ): SVGPath {
                return symbols.flag ? symbols.flag.call(
                    this,
                    x,
                    y,
                    w,
                    Math.round(h * 0.6),
                    {
                        anchorX: Math.round(x),
                        anchorY: Math.round(y + h)
                    }
                ) : [];
            };
        }
    }
}

export default FinancialSymbols;
