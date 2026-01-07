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

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type ButtonThemeObject from '../../Core/Renderer/SVG/ButtonThemeObject';
import type ColorString from '../../Core/Color/ColorString';
import type Exporting from '../../Extensions/Exporting/Exporting';
import type Options from '../../Core/Options';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface LangOptions {
        contextButtonTitle?: string;
        exitFullscreen?: string;
        downloadJPEG?: string;
        downloadPDF?: string;
        downloadPNG?: string;
        downloadSVG?: string;
        printChart?: string;
        viewFullscreen?: string;
    }

    interface Options {
        exporting?: ExportingOptions;
    }
}

export interface PdfFontOptions {
    bold?: string;
    bolditalic?: string;
    italic?: string;
    normal?: string;
}

export interface ExportingOptions {
    allowHTML?: boolean;
    allowTableSorting?: boolean;
    applyStyleSheets?: boolean;
    buttons?: ExportingButtonsOptions;
    chartOptions?: Options;
    enabled?: boolean;
    error?: Exporting.ErrorCallbackFunction;
    fallbackToExportServer?: boolean;
    filename?: string;
    fetchOptions?: RequestInit;
    libURL?: string;
    local?: boolean;
    menuItemDefinitions?: Record<string, Exporting.MenuObject>;
    pdfFont?: PdfFontOptions;
    printMaxWidth?: number;
    scale?: number;
    sourceHeight?: number;
    sourceWidth?: number;
    type?: string;
    url?: string;
    useMultiLevelHeaders?: boolean;
    useRowspanHeaders?: boolean;
    width?: number;
}

export interface ExportingButtonOptions {
    _titleKey?: string;
    align?: AlignValue;
    buttonSpacing?: number;
    className?: string;
    enabled?: boolean;
    height?: number;
    menuClassName?: string;
    menuItems?: Array<string>;
    onclick?: Function;
    symbol?: ('menu' | 'menuball' | SymbolKey);
    symbolFill?: ColorString;
    symbolSize?: number;
    symbolStroke?: ColorString;
    symbolStrokeWidth?: number;
    symbolX?: number;
    symbolY?: number;
    text?: string;
    theme?: ButtonThemeObject;
    titleKey?: string;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    width?: number;
    x?: number;
    y?: number;
}

export interface ExportingButtonsOptions {
    [key: string]: ExportingButtonOptions;
    contextButton: ExportingButtonOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default ExportingOptions;
