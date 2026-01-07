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
