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

import type ColorType from './Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

declare module './Options'{
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
    enabled?: boolean;
    height?: number;
    inverted?: boolean;
    liveRedraw?: boolean;
    margin?: number;
    minWidth?: number;
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
