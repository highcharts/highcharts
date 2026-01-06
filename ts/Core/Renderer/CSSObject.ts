/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { AlignValue } from './AlignObject';
import type ColorString from '../Color/ColorString';
import ColorType from '../Color/ColorType';

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
    /**
     * Text alignment.
     */
    align?: string;
    /**
     * Alignment of items in a flex container.
     */
    'align-items'?: string;
    /**
     * Microsoft-specific filter property.
     */
    '-ms-filter'?: string;
    /**
     * Microsoft-specific touch action property.
     */
    '-ms-touch-action'?: string;
    /**
     * Microsoft-specific transform property.
     */
    '-ms-transform'?: string;
    /**
     * Opera-specific transform property.
     */
    '-o-transform'?: string;
    /**
     * WebKit-specific transform property.
     */
    '-webkit-transform'?: string;
    /**
     * Background property shorthand.
     */
    background?: string;
    /**
     * Background color.
     */
    backgroundColor?: ColorString;
    /**
     * Background image.
     */
    backgroundImage?: string;
    /**
     * Border radius shorthand.
     */
    borderRadius?: string;
    /**
     * Border width.
     */
    borderWidth?: number;
    /**
     * Border property shorthand.
     */
    border?: string|0;
    /**
     * Border radius.
     */
    'border-radius'?: string;
    /**
     * Bottom position.
     */
    bottom?: string;
    /**
     * Box shadow.
     */
    boxShadow?: string;
    /**
     * Clipping region.
     */
    clip?: string;
    /**
     * Text color.
     */
    color?: ColorString; // @todo ('contrast'|ColorString);
    /**
     * Cursor style.
     */
    cursor?: CursorValue;
    /**
     * Text direction.
     */
    direction?: string;
    /**
     * Display style.
     */
    display?: string;
    /**
     * Fill color.
     */
    fill?: ColorType;
    /**
     * Filter property.
     */
    filter?: string;
    /**
     * Flip transformation.
     */
    flip?: string;
    /**
     * Flex direction.
     */
    'flex-direction'?: string;
    /**
     * Font property shorthand.
     */
    font?: string;
    /**
     * Font family.
     */
    fontFamily?: string;
    /**
     * Font size.
     */
    fontSize?: (number|string);
    /**
     * Font style.
     */
    fontStyle?: string;
    /**
     * Font weight.
     */
    fontWeight?: string;
    /**
     * Height.
     */
    height?: string|0;
    /**
     * Justify content in a flex container.
     */
    'justify-content'?: AlignValue;
    /**
     * Left position.
     */
    left?: string|0;
    /**
     * Line clamp for multiline text truncation.
     */
    lineClamp?: number;
    /**
     * Line height.
     */
    lineHeight?: string|0;
    /**
     * Line width (not a standard CSS property, used internally).
     */
    lineWidth?: (number|string);
    /**
     * List style.
     */
    listStyle?: string;
    /**
     * Margin shorthand.
     */
    margin?: string|0;
    /**
     * Left margin.
     */
    marginLeft?: string|0;
    /**
     * Top margin.
     */
    marginTop?: string|0;
    /**
     * Max height.
     */
    'max-height'?: string;
    /**
     * Max width.
     */
    'max-width'?: string;
    /**
     * Mixed blend mode.
     */
    mixedBlendMode?: string;
    /**
     * Mozilla-specific box shadow.
     */
    MozBoxShadow?: string;
    /**
     * Mozilla-specific transform.
     */
    MozTransform?: string;
    /**
     * Opacity.
     */
    opacity?: number;
    /**
     * Overflow behavior.
     */
    overflow?: string;
    /**
     * Horizontal overflow behavior.
     */
    overflowX?: string;
    /**
     * Vertical overflow behavior.
     */
    overflowY?: string;
    /**
     * Outline style.
     */
    outline?: string;
    /**
     * Padding.
     */
    padding?: number|string;
    /**
     * Pointer events.
     */
    'pointer-events'?: string;
    /**
     * Pointer events.
     */
    pointerEvents?: CSSObject['pointer-events'];
    /**
     * Positioning method.
     */
    position?: 'absolute'|'fixed'|'relative'|'static';
    /**
     * Right position.
     */
    right?: string;
    /**
     * Rotation transformation.
     */
    rotation?: number;
    /**
     * Stroke color.
     */
    stroke?: ColorType;
    /**
     * Stroke width.
     */
    'stroke-width'?: (number|string);
    /**
     * Stroke width.
     */
    strokeWidth?: CSSObject['stroke-width'];
    /**
     * Text alignment.
     */
    'text-align'?: AlignValue;
    /**
     * Text alignment.
     */
    textAlign?: CSSObject['text-align'];
    /**
     * Text decoration.
     */
    textDecoration?: string;
    /**
     * Text overflow behavior.
     */
    textOverflow?: string;
    /**
     * Text outline.
     */
    textOutline?: string;
    /**
     * Text transform.
     */
    textTransform?: string;
    /**
     * Top position.
     */
    top?: string|0;
    /**
     * Touch action.
     */
    'touch-action'?: string;
    /**
     * Transform property.
     */
    transform?: string;
    /**
     * Transform origin.
     */
    transformOrigin?: string;
    /**
     * Transition property.
     */
    transition?: string;
    /**
     * User select behavior.
     */
    userSelect?: string;
    /**
     * Vertical alignment.
     */
    verticalAlign?: 'bottom'|'middle'|'top';
    /**
     * Visibility.
     */
    visibility?: 'hidden'|'inherit'|'visible';
    /**
     * White space handling.
     */
    'white-space'?: string;
    /**
     * White space handling.
     */
    whiteSpace?: CSSObject['white-space'];
    /**
     * Width.
     */
    width?: string|0;
    /**
     * WebKit-specific box shadow.
     */
    WebkitBoxShadow?: string;
    /**
     * WebKit-specific overflow scrolling.
     */
    WebkitOverflowScrolling?: string;
    /**
     * WebKit-specific box orientation.
     */
    WebkitBoxOrient?: 'vertical'|'horizontal';
    /**
     * WebKit-specific line clamp for multiline text truncation.
     */
    WebkitLineClamp?: number;
    /**
     * WebKit-specific tap highlight color.
     */
    '-webkit-tap-highlight-color'?: string;
    /**
     * Z-index.
     */
    zIndex?: number;
    /**
     * Z-index.
     */
    'z-index'?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default CSSObject;
