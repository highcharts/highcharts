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

import type ColorString from '../Color/ColorString';

/* *
 *
 *  Declarations
 *
 * */

export type CursorValue = (
    'alias'|'all-scroll'|'auto'|'cell'|'col-resize'|'context-menu'|
    'copy'|'crosshair'|'default'|'e-resize'|'ew-resize'|'grab'|
    'grabbing'|'help'|'move'|'n-resize'|'ne-resize'|'nesw-resize'|
    'no-drop'|'none'|'not-allowed'|'ns-resize'|'nw-resize'|
    'nwse-resize'|'pointer'|'progress'|'row-resize'|'s-resize'|
    'se-resize'|'sw-resize'|'text'|'vertical-text'|'w-resize'|'wait'|
    'zoom-in'|'zoom-out'
);

export interface CSSObject {
    [key: string]: (boolean|number|string|undefined);
    backgroundColor?: ColorString;
    borderRadius?: (number|string);
    color?: ('contrast'|ColorString);
    cursor?: CursorValue;
    fontSize?: (number|string);
    lineWidth?: (number|string);
    pointerEvents?: string;
    stroke?: ColorString;
    strokeWidth?: (number|string);
    width?: string;
}

/* *
 *
 *  Export
 *
 * */

export default CSSObject;
