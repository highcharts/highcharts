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
} from '../Core/Renderer/AlignObject';
import type CSSObject from '../Core/Renderer/CSSObject';
import type ButtonThemeObject from '../Core/Renderer/SVG/ButtonThemeObject';

/* *
 *
 *  Declarations
 *
 * */

export type ButtonRelativeToValue = ('plotBox'|'spacingBox');

export interface MapNavigationButtonOptions {
    align?: AlignValue;
    alignTo?: ButtonRelativeToValue;
    height?: number;
    onclick?: Function;
    padding?: number;
    style?: CSSObject;
    text?: string;
    theme?: ButtonThemeObject;
    verticalAlign?: VerticalAlignValue;
    width?: number;
    x?: number;
    y?: number;
}

export interface MapNavigationOptions {
    buttonOptions?: MapNavigationButtonOptions;
    buttons?: Record<string, MapNavigationButtonOptions>;
    enableButtons?: boolean;
    enabled?: boolean;
    enableDoubleClickZoom?: boolean;
    enableDoubleClickZoomTo?: boolean;
    enableMouseWheelZoom?: boolean;
    enableTouchZoom?: boolean;
    mouseWheelSensitivity?: number;
}

// @todo declare module
declare global {
    namespace Highcharts {
        interface Options {
            mapNavigation?: MapNavigationOptions;
        }
    }
}

export default MapNavigationOptions;
