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

import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options'{
    interface Options {
        scrollbar?: ScrollbarOptions;
    }
}

export interface ScrollbarOptions {
    barBackgroundColor?: ColorType;
    barBorderColor?: ColorType;
    barBorderRadius?: number;
    barBorderWidth?: number;
    buttonArrowColor?: ColorType;
    buttonBackgroundColor?: ColorType;
    buttonBorderColor?: ColorType;
    buttonBorderRadius?: number;
    buttonBorderWidth?: number;
    buttonsEnabled?: boolean;
    enabled?: boolean;
    height?: number;
    inverted?: boolean;
    liveRedraw?: boolean;
    margin?: number;
    minWidth?: number;
    opposite?: boolean;
    rifleColor?: ColorType;
    showFull?: boolean;
    size?: number;
    step?: number;
    trackBackgroundColor?: ColorType;
    trackBorderColor?: ColorType;
    trackBorderRadius?: number;
    trackBorderWidth?: number;
    vertical?: boolean;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ScrollbarOptions;
