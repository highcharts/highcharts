/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export type AlignValue = ('center'|'left'|'right');

export type VerticalAlignValue = ('bottom'|'middle'|'top');

export interface AlignObject {
    align?: AlignValue;
    alignByTranslate?: boolean;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AlignObject;
