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

import type ColorString from './ColorString';

/* *
 *
 *  Declarations
 *
 * */
export interface PaletteSchemeColors {
    backgroundColor?: ColorString;
    colors?: Array<ColorString|null|undefined>;
    neutralColor?: ColorString;
    highlightColor?: ColorString;
    positiveColor?: ColorString;
    negativeColor?: ColorString;
}

export interface PaletteOptions {
    colors?: Array<ColorString>;
    colorScheme?: 'light dark' |'light' | 'dark' | 'inherit';
    dark?: PaletteSchemeColors;
    injectCSS?: boolean;
    light?: PaletteSchemeColors;
}


/* *
 *
 *  Default Export
 *
 * */

export default PaletteOptions;
