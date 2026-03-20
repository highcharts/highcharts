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
        'f-flag': SymbolFunction;
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
            symbols.hlc = hlc;
            symbols.ohlc = ohlc;
            symbols.candlestick = candlestick;
            symbols['f-flag'] = fFlag;
        }
    }

    function hlc(x: number, y: number, w: number, h: number): SVGPath {
        const cx = x + w / 2;
        return [
            ['M', cx, y], ['L', cx, y + h],
            ['M', cx, y + h / 2], ['L', x + w, y + h / 2]
        ];
    }

    function ohlc(x: number, y: number, w: number, h: number): SVGPath {
        const cx = x + w / 2;
        return [
            ['M', cx, y], ['L', cx, y + h],
            ['M', x, y + h * 0.3], ['L', cx, y + h * 0.3],
            ['M', cx, y + h * 0.7], ['L', x + w, y + h * 0.7]
        ];
    }

    function candlestick(x: number, y: number, w: number, h: number): SVGPath {
        const cx = x + w / 2;
        return [
            ['M', cx, y], ['L', cx, y + h],
            ['M', x, y + h * 0.25], ['L', x + w, y + h * 0.25],
            ['L', x + w, y + h * 0.75], ['L', x, y + h * 0.75],
            ['Z']
        ];
    }

    function fFlag(x: number, y: number, w: number, h: number): SVGPath {
        const px = x + w / 3;
        return [
            ['M', px, y + h], ['L', px, y],
            ['L', x + w, y], ['L', x + w, y + h * 0.6],
            ['L', px, y + h * 0.6], ['Z']
        ];
    }
}

export default FinancialSymbols;
