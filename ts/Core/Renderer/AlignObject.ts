/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
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
    /**
     * Horizontal alignment of the object.
     * @type {Highcharts.AlignValue}
     */
    align?: AlignValue;
    /**
     * Align element by translation.
     */
    alignByTranslate?: boolean;
    /**
     * Vertical alignment of the object.
     * @type {Highcharts.VerticalAlignValue}
     */
    verticalAlign?: VerticalAlignValue;
    /**
     * Horizontal offset of the object.
     */
    x?: number;
    /**
     * Vertical offset of the object.
     */
    y?: number;
    /**
     * The width of the object.
     */
    width?: number;
    /**
     * The height of the object.
     */
    height?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AlignObject;
