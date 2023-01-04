/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import type Options from '../../Core/Options';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface ExportingOptions {
    allowHTML?: boolean;
    allowTableSorting?: boolean;
    buttons?: ExportingButtonsOptions;
    chartOptions?: Options;
    enabled?: boolean;
    error?: Exporting.ErrorCallbackFunction;
    fallbackToExportServer?: boolean;
    filename?: string;
    formAttributes?: HTMLAttributes;
    libURL?: string;
    menuItemDefinitions?: Record<string, Exporting.MenuObject>;
    pdfFont?: {
        bold?: string;
        bolditalic?: string;
        italic?: string;
        normal?: string;
    };
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
    symbol?: ('menu'|'menuball'|SymbolKey);
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
